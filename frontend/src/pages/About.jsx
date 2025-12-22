import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SystemHealth = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/status/`);
      setStatus(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="card border-0 mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
        <h3 className="text-white fw-bold mb-0">🛰️ System Health</h3>
        <button className="btn btn-sm btn-outline-info" onClick={checkStatus} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>
      <div className="card-body p-4">
        {error ? (
          <div className="alert alert-danger mb-0">
            <strong>Connection Error:</strong> {error}
            <br />
            <small>Backend might be starting up or CORS is blocking the request.</small>
          </div>
        ) : status ? (
          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3 rounded bg-white bg-opacity-10 text-center">
                <small className="text-white-50 d-block mb-1">Backend Status</small>
                <span className={`fw-bold ${status.status === 'online' ? 'text-success' : 'text-danger'}`}>
                  {status.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded bg-white bg-opacity-10 text-center">
                <small className="text-white-50 d-block mb-1">Models Loaded</small>
                <span className={`fw-bold ${status.cache_loaded ? 'text-info' : 'text-warning'}`}>
                  {status.cache_loaded ? 'Ready' : 'In Progress'}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded bg-white bg-opacity-10 text-center">
                <small className="text-white-50 d-block mb-1">Local Time</small>
                <span className="text-white small">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            {status.cache_error && (
              <div className="col-12">
                <div className="p-3 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25 mt-2">
                  <h6 className="text-danger fw-bold">Model Initialization Failure:</h6>
                  <pre className="text-white small mb-0 overflow-auto custom-scrollbar" style={{ maxHeight: '200px' }}>
                    {status.cache_error}
                  </pre>
                </div>
              </div>
            )}
            <div className="col-12 mt-3">
              <h6 className="text-white-50 small mb-2 text-uppercase">Models Found on Server:</h6>
              <div className="d-flex flex-wrap gap-2">
                {status.models_in_dir.map(m => (
                  <span key={m} className="badge bg-white bg-opacity-10 fw-normal">{m}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-white-50">
            Initialing hardware diagnostics...
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="container-fluid py-5 overflow-hidden">
      {/* Hero Section */}
      <div className="text-center mb-5 position-relative animate-fade-in">
        <div className="position-absolute top-50 start-50 translate-middle"
          style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,98,255,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 }}></div>
        <h1 className="display-3 fw-bold mb-3 text-white tracking-wide" style={{ textShadow: '0 0 20px rgba(41,98,255,0.5)' }}>
          Weather<span className="text-info">AI</span>
        </h1>
        <p className="lead text-white-50 mx-auto mw-1000px fs-4">
          Next-Generation Meteorological Prediction & Analysis System
        </p>
      </div>

      <div className="container mw-1000px px-lg-5">

        {/* Core Features Grid */}
        <div className="row g-4 mb-5 animate-fade-in delay-100">
          {[
            {
              title: "Home",
              icon: "🏠",
              color: "text-warning",
              bg: "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)",
              desc: "The central command center providing instant access to global city search, live status indicators, and quick navigation to all analytical modules."
            },
            {
              title: "Live Forecast",
              icon: "🌤️",
              color: "text-info",
              bg: "linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.05) 100%)",
              desc: "Real-time weather tracking powered by Open-Meteo. Features dynamic visuals, hourly breakdowns, and a 7-day predictive outlook."
            },
            {
              title: "AI Insights",
              icon: "🤖",
              color: "text-info",
              bg: "linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(13, 202, 240, 0.05) 100%)",
              desc: "Advanced machine learning algorithms analyze historical patterns to provide smart recommendations for travel and outdoor activities."
            }
          ].map((item, idx) => (
            <div className="col-lg-4" key={idx}>
              <div className="card h-100 border-0 shadow-lg hover-transform"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="card-body p-4 position-relative overflow-hidden">
                  {/* Duplicate icon removed */}
                  <div className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px', background: item.bg }}>
                    <span className="fs-3">{item.icon}</span>
                  </div>
                  <h4 className={`fw-bold mb-3 ${item.color}`}>{item.title}</h4>
                  <p className="text-white opacity-75 small mb-0 lh-lg">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack - Glassmorphism List */}
        <div className="row mb-5 animate-fade-in delay-200">
          <div className="col-12">
            <div className="card border-0 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(30,30,50,0.6) 0%, rgba(15,15,25,0.8) 100%)', backdropFilter: 'blur(20px)' }}>
              <div className="card-header bg-transparent border-0 p-4 pb-0">
                <h3 className="text-white fw-bold d-flex align-items-center">
                  <span className="me-2">🛠️</span> Technical Architecture
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6 border-end border-white border-opacity-10">
                    <h5 className="text-info mb-4 text-uppercase tracking-wide small opacity-75 fw-bold">Frontend Ecosystem</h5>
                    <ul className="list-unstyled">
                      {[
                        { name: "React 18", desc: "Component-based UI architecture", badge: "bg-primary" },
                        { name: "Vite", desc: "Next-generation frontend tooling", badge: "bg-warning text-dark" },
                        { name: "Bootstrap 5", desc: "Responsive grid & flexible layouts", badge: "bg-purple" },
                        { name: "Chart.js", desc: "Interactive data visualization", badge: "bg-info text-dark" }
                      ].map(t => (
                        <li className="mb-3 d-flex align-items-center" key={t.name}>
                          <span className={`badge ${t.badge} me-3 rounded-pill`} style={{ minWidth: '80px' }}>{t.name}</span>
                          <span className="text-white-50 small">{t.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 ps-md-4">
                    <h5 className="text-success mb-4 text-uppercase tracking-wide small opacity-75 fw-bold">Backend Infrastructure</h5>
                    <ul className="list-unstyled">
                      {[
                        { name: "Django REST", desc: "Secure API development framework", badge: "bg-success" },
                        { name: "Python 3.10", desc: "Core logic & data processing", badge: "bg-primary" },
                        { name: "Scikit-Learn", desc: "Random Forest & LSTM models", badge: "bg-danger" },
                        { name: "Open-Meteo", desc: "Hyper-local weather data source", badge: "bg-info text-dark" }
                      ].map(t => (
                        <li className="mb-3 d-flex align-items-center" key={t.name}>
                          <span className={`badge ${t.badge} me-3 rounded-pill`} style={{ minWidth: '80px' }}>{t.name}</span>
                          <span className="text-white-50 small">{t.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* System Health Diagnostics */}
        <SystemHealth />

      </div>
    </div>
  );
};

export default About;