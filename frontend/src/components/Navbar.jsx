import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from '../config';

const Navbar = () => {
    const navigate = useNavigate();
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
                const response = await axios.get(`${API_BASE_URL}/api/current/`);
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



    const handleDateSelect = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        // Update URL to trigger dashboard refresh or state
        const params = new URLSearchParams(location.search);
        params.set('date', date);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/dashboard', label: 'Live Forecast', icon: '🌤️' },
        { path: '/about', label: 'About', icon: 'ℹ️' }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-enhanced">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <div className="brand-icon-wrapper bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <span className="fs-4">🌦️</span>
                    </div>
                    <span className="brand-text fw-bold text-white tracking-wide" style={{ letterSpacing: '0.5px' }}>WeatherAI</span>
                </Link>

                <div className="navbar-collapse justify-content-end" id="navbarNav">
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
                        <div className="d-none d-lg-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-2 border border-white border-opacity-10 shadow-sm">
                            <span className="fw-bold text-white mb-0" style={{ fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' }}>
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>

                        {/* Date (Full Date with Day) */}
                        <div className="d-none d-lg-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1 border border-white border-opacity-10">
                            <span className="text-white-50 fw-medium" style={{ fontSize: '0.8rem' }}>
                                {time.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Calendar Picker */}
                        <div className="position-relative theme-datepicker-wrapper">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    if (date) handleDateSelect({ target: { value: date.toISOString().split('T')[0] } });
                                }}
                                dateFormat="yyyy-MM-dd"
                                className="custom-datepicker-input"
                                placeholderText="Select Date"
                                withPortal
                                portalId="root-portal"
                                customInput={
                                    <button
                                        className="btn btn-sm bg-white bg-opacity-10 rounded-circle border border-white border-opacity-10 d-flex align-items-center justify-content-center p-0"
                                        style={{ width: '28px', height: '28px' }}
                                        title="Select Date"
                                    >
                                        <span style={{ fontSize: '0.9rem' }}>📅</span>
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Date/Time Integration */}
                    <div className="d-lg-none border-top border-white border-opacity-10 pt-3 mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-white-50 fw-bold">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            <span className="badge bg-white bg-opacity-10 text-white">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Mobile Date Picker */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-white small">Navigate Date:</span>
                            <input
                                type="date"
                                className="form-control form-control-sm bg-white bg-opacity-10 text-white border-white border-opacity-10"
                                value={selectedDate}
                                onChange={(e) => handleDateSelect(e)}
                                style={{ maxWidth: '150px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;