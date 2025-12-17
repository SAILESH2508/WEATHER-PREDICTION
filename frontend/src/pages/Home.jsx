import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SystemStatus from '../components/SystemStatus';

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState({ temp: 25, condition: 'sunny' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate real-time weather updates
    const weatherTimer = setInterval(() => {
      setCurrentWeather({
        temp: Math.round(20 + Math.random() * 15),
        condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)]
      });
    }, 5000);

    // Trigger entrance animations
    setIsVisible(true);

    return () => {
      clearInterval(weatherTimer);
    };
  }, []);

  const getWeatherIcon = (condition) => {
    const icons = { sunny: '☀️', cloudy: '☁️', rainy: '🌧️', windy: '💨' };
    return icons[condition] || '🌤️';
  };

  return (
    <div className="container main-content-home">
      {/* Enhanced Hero Section */}
      <section className={`hero-section py-5 text-center ${isVisible ? 'fade-in' : ''}`}>
        <div className="section-container">
          <div className="hero-content">
            <h1 className="display-3 mb-4 gradient-text" style={{
              fontSize: '4rem',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>🌦️ WeatherAI Platform</h1>
            <p className="lead mb-4 hero-subtitle">
              Advanced AI-powered weather prediction and analysis system using machine learning
            </p>
            <div className="hero-badges mb-5">
              <span className="badge badge-floating bg-primary me-2">🎯 95.2% Accurate</span>
              <span className="badge badge-floating bg-success me-2">⚡ Real-time</span>
              <span className="badge badge-floating bg-warning">🤖 AI-Powered</span>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="row mb-5 feature-cards">
            <div className="col-md-4 mb-4">
              <div className="card feature-card h-100" data-tilt>
                <div className="card-glow"></div>
                <div className="card-header bg-primary">
                  <div className="d-flex align-items-center">
                    <span className="feature-icon me-3">🌤️</span>
                    <div>
                      <h5 className="mb-0">Live Forecast</h5>
                      <small className="opacity-75">Real-time predictions</small>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-description">Real-time weather predictions using advanced AI models with high accuracy and instant updates.</p>
                  <div className="feature-stats mb-3">
                    <div className="stat-item">
                      <span className="stat-number">95.2%</span>
                      <span className="stat-label">Accuracy</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">1.2s</span>
                      <span className="stat-label">Response</span>
                    </div>
                  </div>
                  <Link to="/dashboard" className="btn btn-primary btn-enhanced w-100">
                    <span className="btn-icon">📊</span>
                    View Dashboard
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card feature-card h-100" data-tilt>
                <div className="card-glow"></div>
                <div className="card-header bg-success">
                  <div className="d-flex align-items-center">
                    <span className="feature-icon me-3">🧪</span>
                    <div>
                      <h5 className="mb-0">AI Simulator</h5>
                      <small className="opacity-75">Interactive modeling</small>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-description">Interactive weather scenario modeling with real-time parameter adjustment and instant feedback.</p>
                  <div className="feature-stats mb-3">
                    <div className="stat-item">
                      <span className="stat-number">4</span>
                      <span className="stat-label">AI Models</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">∞</span>
                      <span className="stat-label">Scenarios</span>
                    </div>
                  </div>
                  <Link to="/simulator" className="btn btn-success btn-enhanced w-100">
                    <span className="btn-icon">🎮</span>
                    Try Simulator
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card feature-card h-100" data-tilt>
                <div className="card-glow"></div>
                <div className="card-header bg-warning">
                  <div className="d-flex align-items-center">
                    <span className="feature-icon me-3">📊</span>
                    <div>
                      <h5 className="mb-0">Analytics</h5>
                      <small className="opacity-75">Deep insights</small>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-description">Comprehensive data analysis and model performance insights with detailed visualizations.</p>
                  <div className="feature-stats mb-3">
                    <div className="stat-item">
                      <span className="stat-number">24/7</span>
                      <span className="stat-label">Monitoring</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">∞</span>
                      <span className="stat-label">Data Points</span>
                    </div>
                  </div>
                  <Link to="/analytics" className="btn btn-warning btn-enhanced w-100">
                    <span className="btn-icon">📈</span>
                    View Analytics
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Start Guide */}
      <section className="py-5 quick-start-section">
        <div className="container">
          <div className="section-container">
            <div className="text-center mb-5">
              <h2 className="section-title">🚀 Get Started in 4 Simple Steps</h2>
              <p className="section-subtitle">Follow our interactive guide to start predicting weather with AI</p>
            </div>
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="step-card" data-step="1">
                  <div className="step-number">
                    <span className="step-icon">🎯</span>
                    <span className="step-digit">1</span>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">Choose Your Tool</h5>
                    <p className="step-description">Select from Dashboard, Simulator, or Analytics based on your needs</p>
                    <div className="step-options">
                      <span className="option-badge">📊 Dashboard</span>
                      <span className="option-badge">🧪 Simulator</span>
                      <span className="option-badge">📈 Analytics</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="step-card" data-step="2">
                  <div className="step-number">
                    <span className="step-icon">⚙️</span>
                    <span className="step-digit">2</span>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">Input Parameters</h5>
                    <p className="step-description">Enter weather conditions or use our smart presets for quick setup</p>
                    <div className="step-options">
                      <span className="option-badge">🌡️ Temperature</span>
                      <span className="option-badge">💧 Humidity</span>
                      <span className="option-badge">💨 Wind Speed</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="step-card" data-step="3">
                  <div className="step-number">
                    <span className="step-icon">🤖</span>
                    <span className="step-digit">3</span>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">AI Analysis</h5>
                    <p className="step-description">Our advanced AI models analyze patterns and generate accurate forecasts</p>
                    <div className="step-options">
                      <span className="option-badge">🧠 LSTM</span>
                      <span className="option-badge">🌳 Random Forest</span>
                      <span className="option-badge">🎯 Ensemble</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="step-card" data-step="4">
                  <div className="step-number">
                    <span className="step-icon">📋</span>
                    <span className="step-digit">4</span>
                  </div>
                  <div className="step-content">
                    <h5 className="step-title">Get Results</h5>
                    <p className="step-description">Review detailed predictions, visualizations, and download comprehensive reports</p>
                    <div className="step-options">
                      <span className="option-badge">📊 Charts</span>
                      <span className="option-badge">📄 Reports</span>
                      <span className="option-badge">💾 Export</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-5">
              <div className="cta-container">
                <h3 className="cta-title">Ready to Experience AI Weather Prediction?</h3>
                <p className="cta-subtitle">Join thousands of users who trust our AI for accurate weather forecasting</p>
                <div className="cta-buttons">
                  <Link to="/dashboard" className="btn btn-primary btn-lg btn-enhanced me-3">
                    <span className="btn-icon">🚀</span>
                    Start Predicting Now
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg">
                    <span className="btn-icon">📖</span>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;