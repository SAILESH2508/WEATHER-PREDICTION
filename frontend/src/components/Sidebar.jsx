import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Sidebar = ({ setLocationName, isOpen, closeSidebar }) => {
    const navigate = useNavigate();
    const abortControllerRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const [currentWeather, setCurrentWeather] = useState({ temperature: '--', condition: 'loading', city: 'Loading...' });

    const fetchDefault = useCallback(async () => {
        setIsLoading(true);
        
        try {
            // Try to get weather data from API
            const res = await axios.get(`${API_BASE_URL}/api/current/?lat=11.0168&lon=76.9558&city=Coimbatore, Tamil Nadu, India`, {
                timeout: 10000 // 10 second timeout
            });
            const defaultCity = res.data.city || 'Coimbatore, Tamil Nadu, India';
            setCurrentWeather({
                temperature: Math.round(res.data.temperature),
                condition: res.data.description,
                city: defaultCity,
                humidity: res.data.humidity,
                wind_speed: res.data.wind_speed
            });
            if (setLocationName) setLocationName(defaultCity);
        } catch (e) {
            console.error("API unavailable, using fallback data:", e.message);
            
            // Fallback to static data when API is completely unavailable
            const fallback = 'Coimbatore, Tamil Nadu, India';
            setCurrentWeather({
                temperature: '25',
                condition: 'API Offline - Demo Mode',
                city: fallback,
                humidity: '65',
                wind_speed: '12'
            });
            if (setLocationName) setLocationName(fallback);
        } finally {
            setIsLoading(false);
        }
    }, [setLocationName]);

    const fetchWeatherForCoords = useCallback(async (coords, autoNavigate) => {
        setIsLoading(true);
        let cityName = ''; // Move declaration outside try block
        
        try {
            // Cancel any previous geocoding request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Create cache key for coordinates (rounded to avoid too many cache entries)
            const cacheKey = `${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`;
            
            // Check cache first
            if (geocodeCache.current.has(cacheKey)) {
                const cachedData = geocodeCache.current.get(cacheKey);
                const now = Date.now();
                // Use cached data if it's less than 10 minutes old
                if (now - cachedData.timestamp < 600000) {
                    cityName = cachedData.cityName;
                } else {
                    geocodeCache.current.delete(cacheKey);
                }
            }
            
            // Only geocode if not in cache
            if (!cityName) {
                // Create a new abort controller for this request
                abortControllerRef.current = new AbortController();
                const signal = abortControllerRef.current.signal;
                
                try {
                    // Use a race between the request and a timeout
                    const geocodingPromise = axios.get(
                        `${API_BASE_URL}/api/reverse-geocode/?latitude=${coords.latitude}&longitude=${coords.longitude}`,
                        { 
                            signal,
                            timeout: 5000 // Increased timeout for better geocoding
                        }
                    );

                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('Geocoding timeout')), 4500);
                    });

                    const geoRes = await Promise.race([geocodingPromise, timeoutPromise]);
                    console.log('Geocoding response:', geoRes.data);

                    if (geoRes.data && geoRes.data.results && geoRes.data.results.length > 0) {
                        const result = geoRes.data.results[0];
                        console.log('Geocoded city name:', result.name);
                        
                        // Enhanced city name processing
                        if (result.name) {
                            cityName = result.name;
                            
                            // Log precision and source information
                            console.log('Display city components:', {
                                cityName: result.name,
                                apiCity: result.name,
                                coordinates: `${coords.latitude.toFixed(3)}°, ${coords.longitude.toFixed(3)}°`,
                                finalDisplayCity: result.name,
                                precision: result.precision || 'unknown',
                                source: result.source || 'unknown'
                            });
                            
                            // Cache the result
                            geocodeCache.current.set(cacheKey, {
                                cityName,
                                timestamp: Date.now()
                            });
                            
                            // Limit cache size to prevent memory issues
                            if (geocodeCache.current.size > 50) {
                                const firstKey = geocodeCache.current.keys().next().value;
                                geocodeCache.current.delete(firstKey);
                            }
                        }
                    }
                } catch (geoErr) {
                    console.error('Geocoding failed:', geoErr.message);
                    // Geocoding failed, will use fallback
                }
                
                // If geocoding failed or returned no results, create a user-friendly location name
                if (!cityName) {
                    const lat = coords.latitude;
                    const lon = coords.longitude;
                    
                    // Create a more user-friendly location name that clearly shows it's the user's location
                    cityName = `My Location (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`;
                }
            }

            // Proceed with weather request regardless of geocoding result
            const cityParam = cityName || '';
            
            // Implement retry logic for weather API
            let weatherRes;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount <= maxRetries) {
                try {
                    const timeoutDuration = 8000 + (retryCount * 2000); // Increase timeout with each retry
                    
                    weatherRes = await axios.get(
                        `${API_BASE_URL}/api/current/?lat=${coords.latitude}&lon=${coords.longitude}&city=${encodeURIComponent(cityParam)}`,
                        { 
                            signal: abortControllerRef.current?.signal,
                            timeout: timeoutDuration
                        }
                    );
                    break; // Success, exit retry loop
                    
                } catch (weatherErr) {
                    retryCount++;
                    
                    if (abortControllerRef.current?.signal.aborted) {
                        throw weatherErr; // Don't retry if aborted
                    }
                    
                    if (retryCount > maxRetries) {
                        console.error(`Weather API failed after ${maxRetries} retries:`, weatherErr.message);
                        throw weatherErr;
                    }
                    
                    console.log(`Weather API retry ${retryCount}/${maxRetries} after error:`, weatherErr.message);
                    
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
            
            const displayCity = cityName || weatherRes.data.city || `Your Location (${coords.latitude.toFixed(3)}°, ${coords.longitude.toFixed(3)}°)`;

            console.log('Set location name to:', displayCity);

            setCurrentWeather({
                temperature: Math.round(weatherRes.data.temperature),
                condition: weatherRes.data.description,
                city: displayCity,
                humidity: weatherRes.data.humidity,
                wind_speed: weatherRes.data.wind_speed
            });
            
            if (setLocationName) setLocationName(displayCity);

            if (autoNavigate) {
                console.log('Navigating to:', `/dashboard?lat=${coords.latitude}&lon=${coords.longitude}&city=${encodeURIComponent(displayCity)}`);
                navigate(`/dashboard?lat=${coords.latitude}&lon=${coords.longitude}&city=${encodeURIComponent(displayCity)}`);
                if (closeSidebar) closeSidebar();
            }
        } catch (error) {
            // Only log if not aborted
            if (!abortControllerRef.current?.signal.aborted) {
                console.error("Weather fetch error:", error.message);
                
                // Provide fallback data when API is unavailable
                const fallbackCity = cityName || `My Location (${coords.latitude.toFixed(3)}°, ${coords.longitude.toFixed(3)}°)`;
                
                setCurrentWeather({
                    temperature: '--',
                    condition: 'API Unavailable',
                    city: fallbackCity,
                    humidity: '--',
                    wind_speed: '--'
                });
                
                if (setLocationName) setLocationName(fallbackCity);
                
                // Still navigate if requested, even with fallback data
                if (autoNavigate) {
                    navigate(`/dashboard?lat=${coords.latitude}&lon=${coords.longitude}&city=${encodeURIComponent(fallbackCity)}`);
                    if (closeSidebar) closeSidebar();
                }
                
                // Don't call fetchDefault if we have coordinates - use the fallback instead
                return;
            }
            
            // Only fall back to default location if request was aborted or no coordinates
            fetchDefault();
        } finally {
            setIsLoading(false);
        }
    }, [setLocationName, navigate, closeSidebar, fetchDefault]);

    const debounceTimeoutRef = useRef(null);
    const isRequestingRef = useRef(false);
    const geocodeCache = useRef(new Map());

    const handleLocationClick = useCallback(async (autoNavigate = true) => {
        console.log('Location button clicked!');
        console.log('🎯 handleLocationClick called with autoNavigate:', autoNavigate);
        setIsGettingLocation(true);
        
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            fetchDefault();
            setIsGettingLocation(false);
            return;
        }

        // Prevent multiple simultaneous requests
        if (isRequestingRef.current) {
            setIsGettingLocation(false);
            return;
        }

        // Clear any existing debounce timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        console.log('🔄 Starting geolocation request...');

        // Debounce the geolocation request
        debounceTimeoutRef.current = setTimeout(() => {
            console.log('⏰ Debounce timeout completed, calling geolocation API...');
            isRequestingRef.current = true;
            
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log('✅ Got geolocation position:', pos.coords);
                    console.log('🎯 ULTRA-PRECISE GPS Coordinates:', {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        altitudeAccuracy: pos.coords.altitudeAccuracy,
                        heading: pos.coords.heading,
                        speed: pos.coords.speed,
                        timestamp: new Date(pos.timestamp).toLocaleString(),
                        precision: pos.coords.accuracy < 10 ? 'Very High' : pos.coords.accuracy < 50 ? 'High' : 'Medium'
                    });
                    fetchWeatherForCoords(pos.coords, autoNavigate).finally(() => {
                        isRequestingRef.current = false;
                        setIsGettingLocation(false);
                    });
                },
                (error) => {
                    console.error('❌ Geolocation error:', error);
                    isRequestingRef.current = false;
                    setIsGettingLocation(false);
                    
                    let errorMessage = "Unable to retrieve your location. ";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += "Please allow location access in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "Location information is unavailable. Try moving to an area with better GPS signal.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "Location request timed out. Please try again.";
                            break;
                        default:
                            errorMessage += "An unknown error occurred.";
                            break;
                    }
                    
                    if (autoNavigate) alert(errorMessage);
                    fetchDefault();
                },
                { 
                    enableHighAccuracy: true,    // Enable high accuracy for precise location
                    timeout: 20000,              // Longer timeout for precise location (20 seconds)
                    maximumAge: 30000            // Shorter cache age for more current location (30 seconds)
                }
            );
        }, 500);
    }, [fetchDefault, fetchWeatherForCoords]);

    useEffect(() => {
        // Cleanup function to cancel any pending requests
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            // Reset request state
            isRequestingRef.current = false;
        };
    }, []);

    // Initial load - only fetch default location, don't request geolocation automatically
    useEffect(() => {
        // Don't auto-request geolocation to avoid browser violations
        // Just load default location
        fetchDefault();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - this should only run once on mount

    const getWeatherIcon = (c) => {
        if (!c) return '🌤️';
        const condition = c.toLowerCase();
        if (condition.includes('rain')) return '🌧️';
        if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
        if (condition.includes('cloud')) return '☁️';
        if (condition.includes('storm')) return '⛈️';
        if (condition.includes('snow')) return '❄️';
        return '🌤️';
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/search-city/?name=${query}`);
                setSearchResults(response.data.results || []);
            } catch (error) {
                console.error("Search failed", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleCitySelect = (city) => {
        setSearchQuery("");
        setSearchResults([]);
        navigate(`/dashboard?lat=${city.latitude}&lon=${city.longitude}&city=${encodeURIComponent(city.name)}`);
        if (closeSidebar) closeSidebar();
    };

    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className={`sidebar-container d-flex flex-column shadow-lg ${isOpen ? 'show' : ''}`}
            style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>

            {/* Mobile Close Button */}
            <div className="d-flex d-lg-none justify-content-end p-3 pb-0">
                <button className="btn btn-sm btn-outline-light rounded-circle border-0" onClick={closeSidebar}>✕</button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="d-lg-none p-3 pb-0">
                <div className="d-flex flex-column gap-2">
                    {[
                        { path: '/', label: 'Home', icon: '🏠' },
                        { path: '/dashboard', label: 'Live Forecast', icon: '🌤️' },
                        { path: '/about', label: 'About', icon: 'ℹ️' }
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`btn btn-sm text-start d-flex align-items-center gap-3 w-100 p-3 rounded-3 border-0 ${isActive(item.path) ? 'bg-primary text-white' : 'text-white hover-bg-white-10'}`}
                            onClick={closeSidebar}
                        >
                            <span className="fs-5">{item.icon}</span>
                            <span className="fw-bold tracking-wide">{item.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="my-4 border-top border-secondary"></div>
            </div>

            {/* Current Weather Widget (Simple Glass) */}
            {/* Current Weather Widget (Unified) */}
            <div className="p-4 text-center">
                <div className="d-flex flex-column align-items-center position-relative">

                    <span className="weather-icon mb-2 drop-shadow" style={{ fontSize: '3.5rem' }}>
                        {isLoading ? '⏳' : getWeatherIcon(currentWeather.condition)}
                    </span>
                    <h1 className="fw-bold mb-0 display-4 text-white text-shadow">
                        {isLoading ? '...' : currentWeather.temperature}°
                    </h1>
                    <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 rounded-pill px-3 py-1 mb-3">
                        {isLoading ? 'Loading weather...' : currentWeather.condition}
                    </span>

                    <div className="d-flex align-items-center justify-content-center text-white-50 small mb-3">
                        <span className="me-1">📍</span> 
                        <span className="me-2">{currentWeather.city}</span>
                        <button 
                            className="btn btn-sm btn-outline-light border-0 rounded-circle p-1" 
                            onClick={() => handleLocationClick(true)}
                            title="Use my location"
                            style={{ fontSize: '0.7rem', width: '24px', height: '24px' }}
                            disabled={isGettingLocation}
                        >
                            {isGettingLocation ? '⏳' : '🎯'}
                        </button>
                    </div>

                    <div className="row w-100 g-2 mt-1">
                        <div className="col-6">
                            <div className="text-center">
                                <small className="d-block text-white-50" style={{ fontSize: '0.65rem' }}>WIND</small>
                                <span className="fw-bold text-white">{currentWeather.wind_speed || 0} k/h</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="text-center">
                                <small className="d-block text-white-50" style={{ fontSize: '0.65rem' }}>HUMIDITY</small>
                                <span className="fw-bold text-white">{currentWeather.humidity || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Search (Unified) */}
            <div className="px-3 mb-4">
                <div className="position-relative mb-3">
                    <input
                        type="text"
                        className="form-control form-control-lg border-0 border-bottom border-white border-opacity-25 text-white placeholder-white-50 rounded-0 bg-transparent px-0"
                        placeholder="🔍 Search City..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ boxShadow: 'none', paddingLeft: '0.5rem' }}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results position-absolute w-100 border border-white border-opacity-10 rounded-3 mt-2 shadow-lg overflow-hidden custom-scrollbar"
                            style={{ zIndex: 99999, maxHeight: '300px', overflowY: 'auto', background: 'rgba(20, 20, 35, 0.95)', backdropFilter: 'blur(10px)' }}>
                            {searchResults.map((city, index) => (
                                <button
                                    key={city.id || index}
                                    className="btn btn-link text-white text-decoration-none d-block w-100 text-start px-3 py-2 border-bottom border-white border-opacity-10 hover-bg-white-10"
                                    onClick={() => handleCitySelect(city)}
                                >
                                    <span className="fw-bold d-block">{city.name}</span>
                                    <small className="text-white-50">{city.country}</small>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Cities (Unified List) */}
            <div className="px-3 flex-grow-1 overflow-auto custom-scrollbar">
                <h6 className="text-uppercase text-white-50 fw-bold px-2 mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Popular Cities</h6>
                <div className="d-flex flex-column gap-1">
                    {[
                        { name: 'Coimbatore', country: 'India', lat: 11.0168, lon: 76.9558 },
                        { name: 'New York', country: 'USA', lat: 40.71, lon: -74.01 },
                        { name: 'London', country: 'UK', lat: 51.51, lon: -0.13 },
                        { name: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
                        { name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21 }
                    ].map((city) => (
                        <button
                            key={city.name}
                            className="btn btn-sm text-start d-flex justify-content-between align-items-center p-2 rounded-3 w-100 hover-bg-white-10 border-0"
                            style={{ transition: 'all 0.2s' }}
                            onClick={() => handleCitySelect({ name: city.name, latitude: city.lat, longitude: city.lon })}
                        >
                            <div>
                                <span className="fw-bold text-white d-block">{city.name}</span>
                                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>{city.country}</small>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Daily Tip (Unified) */}
            <div className="p-3 mt-auto">
                <div className="p-0">
                    <div className="d-flex gap-2 align-items-start">
                        <span className="fs-6">💡</span>
                        <small className="text-white-50" style={{ lineHeight: '1.4' }}>
                            <strong className="text-white">Tip:</strong> High humidity (&gt;80%) significantly increases rainfall probability.
                        </small>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
