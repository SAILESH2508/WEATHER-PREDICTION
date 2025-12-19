import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Sidebar = ({ setLocationName }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [currentWeather, setCurrentWeather] = useState({ temperature: '--', condition: 'loading', city: 'Loading...' });

    useEffect(() => {
        const fetchWeather = async () => {
            const fetchDefault = async () => {
                try {
                    // Default to Coimbatore
                    const res = await axios.get(`${API_BASE_URL}/api/current/?lat=11.0168&lon=76.9558&city=Coimbatore, Tamil Nadu, India`);
                    const defaultCity = res.data.city || 'Coimbatore, Tamil Nadu, India';
                    setCurrentWeather({
                        temperature: Math.round(res.data.temperature),
                        condition: res.data.description,
                        city: defaultCity
                    });
                    if (setLocationName) setLocationName(defaultCity);
                } catch (e) {
                    console.error(e);
                    const fallback = 'Coimbatore, Tamil Nadu, India';
                    setCurrentWeather(prev => ({ ...prev, city: fallback }));
                    if (setLocationName) setLocationName(fallback);
                }
            };



            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        try {
                            console.log("Got location:", pos.coords.latitude, pos.coords.longitude);

                            let cityName = '';

                            try {
                                // Enhanced reverse geocoding with longer timeout
                                const controller = new AbortController();
                                // Increase timeout to 15 seconds for slower connections
                                const timeoutId = setTimeout(() => controller.abort(), 15000);

                                const geoRes = await axios.get(
                                    `${API_BASE_URL}/api/reverse-geocode/?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`,
                                    { signal: controller.signal }
                                );

                                clearTimeout(timeoutId);

                                if (geoRes.data.results && geoRes.data.results.length > 0) {
                                    const result = geoRes.data.results[0];
                                    // Build a smart city name
                                    // Prioritize: Name, Admin1 (State), Country Code/Name
                                    const parts = [result.name];
                                    if (result.admin1 && result.admin1 !== result.name) parts.push(result.admin1);
                                    if (result.country_code) parts.push(result.country_code.toUpperCase());

                                    cityName = parts.join(', ');
                                    console.log("Resolved city name:", cityName);
                                }
                            } catch (geoErr) {
                                console.warn("Reverse geocoding failed, trying backend fallback:", geoErr.message);
                            }

                            // If frontend resolution failed, let backend try or fallback to coords
                            // Don't send "My Location" as a string if we don't know it. Send empty or specific indicator.
                            const cityParam = cityName || '';

                            // Get weather data
                            const weatherRes = await axios.get(`${API_BASE_URL}/api/current/?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&city=${encodeURIComponent(cityParam)}`);

                            // Logic:
                            // 1. Use high-quality reverse geocoded name if we got it.
                            // 2. Else use what backend returned.
                            // 3. Last resort: "Lat: x, Lon: y" (better than "My Location" which implies generic)
                            const displayCity = cityName || weatherRes.data.city || `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;

                            setCurrentWeather({
                                temperature: Math.round(weatherRes.data.temperature),
                                condition: weatherRes.data.description,
                                city: displayCity
                            });
                            if (setLocationName) setLocationName(displayCity);
                        } catch (error) {
                            console.error("Weather fetch error:", error);
                            fetchDefault();
                        }
                    },
                    (error) => {
                        console.warn("Geolocation error:", error.message);
                        fetchDefault();
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000, // Increased timeout
                        maximumAge: 300000 // 5 minutes cache
                    }
                );
            } else {
                fetchDefault();
            }
        };
        fetchWeather();
    }, []);

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

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

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
        // Navigate to dashboard with query params
        navigate(`/dashboard?lat=${city.latitude}&lon=${city.longitude}&city=${encodeURIComponent(city.name)}`);
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="btn btn-dark d-lg-none position-fixed top-0 start-0 m-3 z-3"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                style={{ zIndex: 1050 }}
            >
                ☰
            </button>

            {/* Sidebar Container with Theme Blend */}
            <div className={`sidebar-container backdrop-blur border-end border-white border-opacity-10 d-flex flex-column ${isMobileOpen ? 'show' : ''}`}>

                {/* Current Weather Widget (Integrated) */}
                <div className="p-4 text-center border-bottom border-white border-opacity-10">
                    <div className="d-flex flex-column align-items-center">
                        <span className="weather-icon" style={{ fontSize: '3rem', margin: 0 }}>{getWeatherIcon(currentWeather.condition)}</span>
                        <h2 className="text-white fw-bold mb-0 mt-2">{currentWeather.temperature}°C</h2>
                        <small className="text-white text-uppercase fw-bold opacity-75">{currentWeather.condition}</small>
                        <div className="mt-2 badge bg-white bg-opacity-10 text-white border border-white border-opacity-25">
                            📍 {currentWeather.city}
                        </div>

                        {/* Extra Details to fill space */}
                        <div className="d-flex justify-content-center gap-3 mt-3 w-100">
                            <div className="d-flex flex-column align-items-center">
                                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>WIND</small>
                                <span className="fw-bold">{currentWeather.wind_speed || 10} km/h</span>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>HUMIDITY</small>
                                <span className="fw-bold">{currentWeather.humidity || 60}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Search */}
                <div className="p-3">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control text-white border-white border-opacity-25 search-input-glass"
                            placeholder="🔍 Search City..."
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }}
                        />
                        {searchResults.length > 0 && (
                            <div className="search-results position-absolute w-100 bg-dark border border-white border-opacity-25 rounded mt-1 shadow-lg" style={{ zIndex: 99999, maxHeight: '300px', overflowY: 'auto', top: '100%', left: 0 }}>
                                {searchResults.map((city, index) => (
                                    <button
                                        key={city.id || index}
                                        className="btn btn-sm btn-link text-white text-decoration-none d-block w-100 text-start px-3 py-2 hover-bg-primary"
                                        onClick={() => handleCitySelect(city)}
                                    >
                                        <span className="fw-bold">{city.name}</span>
                                        <small className="d-block text-white-50">{city.country}</small>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Weather (Popular Cities) - Moved UP (Removed mt-auto) */}
                <div className="px-3 py-2">
                    <small className="text-uppercase text-white fw-bold px-2 opacity-75">Global Weather</small>
                    <div className="d-flex flex-column gap-2 mt-2">
                        {[
                            { name: 'Coimbatore', country: 'India', lat: 11.0168, lon: 76.9558 },
                            { name: 'New York', country: 'USA', lat: 40.71, lon: -74.01 },
                            { name: 'London', country: 'UK', lat: 51.51, lon: -0.13 },
                            { name: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
                            { name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21 }
                        ].map((city) => (
                            <button
                                key={city.name}
                                className="btn btn-sm text-start d-flex justify-content-between align-items-center gap-2 border border-white border-opacity-25 w-100 mb-1 hover-bg-white-10"
                                style={{ color: 'white', transition: 'all 0.2s', background: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                onClick={() => handleCitySelect({ name: city.name, latitude: city.lat, longitude: city.lon })}
                            >
                                <span className="fw-bold">{city.name}</span>
                                <small className="opacity-75 text-white-50">{city.country}</small>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="p-3 mt-2 border-top border-white border-opacity-10">
                    <small className="text-uppercase text-white fw-bold opacity-75">Daily Tip</small>
                    <div className="alert alert-info bg-opacity-90 border-white border-opacity-25 p-2 mt-2 mb-0">
                        <div className="d-flex icon-link gap-2 align-items-center">
                            <span>💡</span>
                            <small className="text-dark fw-bold" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                High humidity (&gt;80%) can increase rainfall probability significantly.
                            </small>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Sidebar;
