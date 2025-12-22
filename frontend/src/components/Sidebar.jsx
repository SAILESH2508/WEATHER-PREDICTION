import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Sidebar = ({ setLocationName, isOpen, closeSidebar }) => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [currentWeather, setCurrentWeather] = useState({ temperature: '--', condition: 'loading', city: 'Loading...' });

    const fetchDefault = async () => {
        try {
            // Default to Coimbatore
            const res = await axios.get(`${API_BASE_URL}/api/current/?lat=11.0168&lon=76.9558&city=Coimbatore, Tamil Nadu, India`);
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
            console.error(e);
            const fallback = 'Coimbatore, Tamil Nadu, India';
            setCurrentWeather(prev => ({ ...prev, city: fallback }));
            if (setLocationName) setLocationName(fallback);
        }
    };

    const handleLocationClick = async (autoNavigate = true) => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            fetchDefault();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    let cityName = '';
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 15000);

                        const geoRes = await axios.get(
                            `${API_BASE_URL}/api/reverse-geocode/?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`,
                            { signal: controller.signal }
                        );
                        clearTimeout(timeoutId);

                        if (geoRes.data.results && geoRes.data.results.length > 0) {
                            const result = geoRes.data.results[0];
                            const parts = [result.name];
                            if (result.admin1 && result.admin1 !== result.name) parts.push(result.admin1);
                            if (result.country_code) parts.push(result.country_code.toUpperCase());
                            cityName = parts.join(', ');
                        }
                    } catch (geoErr) {
                        console.warn("Reverse geocoding failed", geoErr.message);
                    }

                    const cityParam = cityName || '';
                    const weatherRes = await axios.get(`${API_BASE_URL}/api/current/?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&city=${encodeURIComponent(cityParam)}`);
                    const displayCity = cityName || weatherRes.data.city || `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;

                    setCurrentWeather({
                        temperature: Math.round(weatherRes.data.temperature),
                        condition: weatherRes.data.description,
                        city: displayCity,
                        humidity: weatherRes.data.humidity,
                        wind_speed: weatherRes.data.wind_speed
                    });
                    if (setLocationName) setLocationName(displayCity);

                    // Navigate if requested (e.g. button click)
                    if (autoNavigate) {
                        navigate(`/dashboard?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&city=${encodeURIComponent(displayCity)}`);
                        if (closeSidebar) closeSidebar();
                    }

                } catch (error) {
                    console.error("Weather fetch error:", error);
                    fetchDefault();
                }
            },
            (error) => {
                console.warn("Geolocation error:", error.message);
                if (autoNavigate) alert("Unable to retrieve your location. Please check browser permissions.");
                fetchDefault();
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
        );
    };

    useEffect(() => {
        // Initial load - fetch but don't force navigate (pass false)
        handleLocationClick(false);
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
                        {getWeatherIcon(currentWeather.condition)}
                    </span>
                    <h1 className="fw-bold mb-0 display-4 text-white text-shadow">{currentWeather.temperature}°</h1>
                    <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 rounded-pill px-3 py-1 mb-3">
                        {currentWeather.condition}
                    </span>

                    <div className="d-flex align-items-center text-white-50 small mb-3">
                        <span className="me-1">📍</span> {currentWeather.city}
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
