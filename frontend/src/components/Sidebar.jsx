import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [currentWeather, setCurrentWeather] = useState({ temperature: '--', condition: 'loading', city: 'Loading...' });

    useEffect(() => {
        const fetchWeather = async () => {
            const fetchDefault = async () => {
                try {
                    const res = await axios.get('http://127.0.0.1:8000/api/current/');
                    setCurrentWeather({
                        temperature: Math.round(res.data.temperature),
                        condition: res.data.description,
                        city: res.data.city || 'Local'
                    });
                } catch (e) {
                    console.error(e);
                    setCurrentWeather(prev => ({ ...prev, city: 'Unavailable' }));
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    try {
                        let cityName = 'My Location';
                        try {
                            // Reverse Geocoding to get Exact Location Name
                            const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&count=1&language=en&format=json`);
                            if (geoRes.data.results && geoRes.data.results.length > 0) {
                                cityName = geoRes.data.results[0].name;
                            }
                        } catch (geoErr) {
                            console.warn("Reverse geo failed", geoErr);
                        }

                        const res = await axios.get(`http://127.0.0.1:8000/api/current/?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&city=${encodeURIComponent(cityName)}`);
                        setCurrentWeather({
                            temperature: Math.round(res.data.temperature),
                            condition: res.data.description,
                            city: res.data.city
                        });
                    } catch (e) {
                        fetchDefault();
                    }
                }, () => fetchDefault());
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
            setLoading(true);
            try {
                const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
                setSearchResults(response.data.results || []);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
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
            <div className={`sidebar-container backdrop-blur border-end border-white border-opacity-10 d-flex flex-column ${isMobileOpen ? 'show' : ''}`}
                style={{ background: 'linear-gradient(180deg, rgba(41, 98, 255, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)' }}>

                {/* Current Weather Widget (Integrated) */}
                <div className="p-4 text-center border-bottom border-white border-opacity-10">
                    <div className="d-flex flex-column align-items-center">
                        <span style={{ fontSize: '3rem' }}>{getWeatherIcon(currentWeather.condition)}</span>
                        <h2 className="text-white fw-bold mb-0 mt-2">{currentWeather.temperature}°C</h2>
                        <small className="text-white-50 text-uppercase fw-bold">{currentWeather.condition}</small>
                        <div className="mt-2 badge bg-white bg-opacity-10 text-white border border-white border-opacity-25">
                            📍 {currentWeather.city}
                        </div>
                    </div>
                </div>

                {/* Global Search */}
                <div className="p-3">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control bg-transparent text-white border-white border-opacity-25"
                            placeholder="🔍 Search City..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {searchResults.length > 0 && (
                            <div className="search-results position-absolute w-100 bg-dark border border-white border-opacity-10 rounded mt-1 shadow-lg" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                {searchResults.map((city) => (
                                    <button
                                        key={city.id}
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

                {/* Navigation removed as per user request (kept in Top Navbar) */}



                {/* Global Weather (Popular Cities) */}
                <div className="px-3 py-2 mt-auto">
                    <small className="text-uppercase text-white-50 fw-bold px-2">Global Weather</small>
                    <div className="d-flex flex-column gap-2 mt-2">
                        {[
                            { name: 'New York', country: 'USA', lat: 40.71, lon: -74.01 },
                            { name: 'London', country: 'UK', lat: 51.51, lon: -0.13 },
                            { name: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
                            { name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21 }
                        ].map((city) => (
                            <button
                                key={city.name}
                                className="btn btn-sm btn-outline-light text-start d-flex justify-content-between align-items-center"
                                onClick={() => handleCitySelect({ name: city.name, latitude: city.lat, longitude: city.lon })}
                            >
                                <span>{city.name}</span>
                                <small className="opacity-50">{city.country}</small>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="p-3 mt-2 border-top border-white border-opacity-10">
                    <small className="text-uppercase text-white-50 fw-bold">Daily Tip</small>
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
