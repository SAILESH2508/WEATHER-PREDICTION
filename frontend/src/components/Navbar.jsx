import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [currentWeather, setCurrentWeather] = useState({ temperature: '--', condition: 'loading' });
    const [selectedDate, setSelectedDate] = useState('');
    const dateInputRef = useRef(null);
    const location = useLocation();

    // Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Current Weather
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/current/');
                setCurrentWeather({
                    temperature: Math.round(response.data.temperature),
                    condition: response.data.description
                });
            } catch (error) {
                console.error('Failed to fetch weather:', error);
                setCurrentWeather({ temperature: '--', condition: 'offline' });
            }
        };

        fetchWeather();
        const weatherTimer = setInterval(fetchWeather, 30000);
        return () => clearInterval(weatherTimer);
    }, []);

    const getWeatherIcon = (condition) => {
        if (condition.toLowerCase().includes('rain')) return '🌧️';
        if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) return '☀️';
        if (condition.toLowerCase().includes('cloud')) return '☁️';
        if (condition.toLowerCase().includes('storm')) return '⛈️';
        if (condition.toLowerCase().includes('snow')) return '❄️';
        return '🌤️';
    };

    const handleDateSelect = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        console.log(`Prediction requested for: ${date}`);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/dashboard', label: 'Live Forecast', icon: '🌤️' },
        { path: '/simulator', label: 'AI Simulator', icon: '🧪' },
        { path: '/analytics', label: 'Analytics', icon: '📊' },
        { path: '/about', label: 'About', icon: 'ℹ️' }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-enhanced">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span className="brand-icon">🌦️</span>
                    <span className="brand-text">WeatherAI</span>
                </Link>

                <button
                    className={`navbar-toggler hamburger ${isOpen ? 'active' : ''}`}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <Link
                                    className={`nav-link modern-nav-link ${isActive(item.path) ? 'active' : ''}`}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="nav-icon me-1">{item.icon}</span>
                                    <span className="nav-text">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                        {/* Current Weather - Moved to Sidebar */}


                        {/* Clock (Time) */}
                        <div className="d-none d-lg-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1 border border-white border-opacity-10">
                            <span className="fw-bold text-white" style={{ fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>

                        {/* Date (Full Date with Day) */}
                        <div className="d-none d-lg-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1 border border-white border-opacity-10">
                            <span className="text-white-50 fw-medium" style={{ fontSize: '0.8rem' }}>
                                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Calendar Picker */}
                        <div className="position-relative">
                            <button
                                className="btn btn-sm bg-white bg-opacity-10 rounded-circle border border-white border-opacity-10 d-flex align-items-center justify-content-center p-0"
                                style={{ width: '28px', height: '28px' }}
                                onClick={() => dateInputRef.current.showPicker()}
                                title="Select Date"
                            >
                                <span style={{ fontSize: '0.9rem' }}>📅</span>
                            </button>
                            <input
                                type="date"
                                ref={dateInputRef}
                                value={selectedDate}
                                onChange={handleDateSelect}
                                className="position-absolute opacity-0"
                                style={{ top: '100%', right: 0, width: 0, height: 0, colorScheme: 'dark' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;