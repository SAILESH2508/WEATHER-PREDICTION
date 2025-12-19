const About = () => {
  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-white">About WeatherAI</h1>
        <p className="lead text-white-50">Next-Generation Meteorological Prediction & Analysis System</p>
      </div>

      {/* Application Guide */}
      <div className="section-container mb-5" id="guide">
        <div className="d-flex align-items-center mb-4 ps-2">
          <span className="fs-2 me-2">🧭</span>
          <h3 className="mb-0 text-white">System Guide</h3>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-warning mb-3">🏠 Home</h5>
                <p className="text-white-50 small mb-0">
                  The central landing hub ensuring quick access to the main <strong>Weather Dashboard</strong>.
                  It features high-level system status indicators, navigation shortcuts to major modules, and a brief overview of the platform's AI capabilities.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-success mb-3">🌤️ Unified Dashboard</h5>
                <p className="text-white-50 small mb-0">
                  The core of the application. Combines <strong>Real-time Weather Tracking</strong>,
                  <strong>AI Prediction Simulator</strong>, and <strong>Interactive Trends Analysis</strong> into a single, responsive interface.
                </p>
                <ul className="list-unstyled mt-3 mb-0 small text-white-50">
                  <li>• <strong>Dynamic Theming:</strong> UI adapts to current weather conditions.</li>
                  <li>• <strong>24-Hour Trends:</strong> Visual charts for temperature and rainfall.</li>
                  <li>• <strong>AI Advisory:</strong> ML-powered alerts and planning recommendations.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="section-container mb-5" id="tech">
        <div className="d-flex align-items-center mb-4 ps-2">
          <span className="fs-2 me-2">🛠️</span>
          <h3 className="mb-0 text-white">Technical Architecture</h3>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-dark bg-opacity-25 border-0 h-100">
              <div className="card-header bg-primary text-white rounded-top">
                <h5 className="mb-0">Frontend (Client)</h5>
              </div>
              <div className="card-body rounded-bottom">
                <ul className="list-unstyled text-white-50 mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-primary me-3">React 18</span>
                    <span>High-performance Component-Based UI</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-info me-3">Chart.js</span>
                    <span>Real-time Data Visualization</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-light text-dark me-3">Glassmorphism</span>
                    <span>Modern, Translucent Design System</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-dark bg-opacity-25 border-0 h-100">
              <div className="card-header bg-success text-white rounded-top">
                <h5 className="mb-0">Backend (Server)</h5>
              </div>
              <div className="card-body rounded-bottom">
                <ul className="list-unstyled text-white-50 mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-success me-3">Django REST</span>
                    <span>Scalable API Architecture</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-warning text-dark me-3">ML Engine</span>
                    <span>Ensemble Models (LSTM, Random Forest)</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-danger me-3">Open-Meteo</span>
                    <span>High-Precision Global Weather Data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;