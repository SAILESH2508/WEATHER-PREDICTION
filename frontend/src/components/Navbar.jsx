import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const location = useLocation();

    // Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDateSelect = (e) => {
        const date = e.target.value;
        const newDate = new Date(date);
        setSelectedDate(newDate);

        // Update URL to trigger dashboard refresh or state
        const params = new URLSearchParams(window.location.search);
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
        <nav className="navbar navbar-expand-lg fixed-top p-0 transition-all"
            style={{
                height: '70px',
                zIndex: 1050,
                background: 'rgba(10, 15, 30, 0.6)',
                backdropFilter: 'blur(15px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
            <div className="container-fluid px-3 px-lg-4 h-100">
                <div className="d-flex align-items-center h-100">
                    {/* Mobile Toggle Button (Visible only on mobile) */}
                    <button
                        className="btn btn-link text-white d-lg-none me-3 p-0 border-0 hover-scale"
                        onClick={toggleSidebar}
                        style={{ fontSize: '1.75rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                        aria-label="Toggle Menu"
                    >
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>

                    {/* Brand / Logo */}
                    <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
                        <div className="brand-icon-wrapper rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                            style={{
                                width: '42px',
                                height: '42px',
                                background: 'linear-gradient(135deg, #2962ff 0%, #0039cb 100%)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                            <span className="fs-5">🌦️</span>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                            <span className="brand-text fw-bold text-white tracking-wide"
                                style={{ fontSize: '1.25rem', letterSpacing: '1px', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                Weather<span className="text-primary">AI</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="collapse navbar-collapse justify-content-end h-100" id="navbarNav">
                    {/* Navigation Links */}
                    <ul className="navbar-nav mx-auto d-none d-lg-flex gap-2">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <Link
                                    className={`nav-link px-3 py-2 rounded-pill d-flex align-items-center gap-2 fw-medium ${isActive(item.path) ? 'bg-primary text-white shadow-sm' : 'text-white text-opacity-75 hover-bg-white-10'}`}
                                    to={item.path}
                                    style={{ transition: 'all 0.2s ease', fontSize: '0.95rem' }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Tools: Time, Date, DatePicker */}
                    <div className="d-flex align-items-center gap-3">

                        {/* Clock Information */}
                        <div className="d-none d-lg-flex flex-column align-items-end text-end me-2">
                            <span className="fw-bold text-white tracking-wide" style={{ fontSize: '1rem', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-white-50 small" style={{ fontSize: '0.75rem' }}>
                                {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Calendar Picker (Desktop) */}
                        <div className="position-relative theme-datepicker-wrapper d-none d-lg-block">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    if (date) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        handleDateSelect({ target: { value: `${year}-${month}-${day}` } });
                                    }
                                }}
                                dateFormat="yyyy-MM-dd"
                                withPortal
                                portalId="root-portal"
                                customInput={
                                    <button
                                        className="btn btn-icon btn-glass rounded-circle d-flex align-items-center justify-content-center hover-transform shadow-sm"
                                        style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                                        title="Select Date"
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>📅</span>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;