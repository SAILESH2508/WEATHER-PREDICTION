const About = () => {
  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-white">About WeatherAI</h1>
        <p className="lead text-white-50">Advanced Meteorological Prediction & Analysis System</p>
      </div>

      {/* Application Guide */}
      <div className="section-container mb-5" id="guide">
        <div className="d-flex align-items-center mb-4 ps-2">
          <span className="fs-2 me-2">🧭</span>
          <h3 className="mb-0 text-white">Application Guide</h3>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-info mb-3">🏠 Home</h5>
                <p className="text-white-50 small mb-0">The central hub providing an instant system status overview and quick navigation to all active modules.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-success mb-3">🌤️ Live Forecast</h5>
                <p className="text-white-50 small mb-0">Real-time local weather tracking powered by <strong>Open-Meteo</strong>. Includes the <strong>AI Forecast Studio</strong> for generating custom predictions using our ensemble machine learning models.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-warning mb-3">🧪 AI Simulator</h5>
                <p className="text-white-50 small mb-0">An interactive sandbox environment. Adjust core parameters like humidity, pressure, and wind speed to see how our AI models react in hypothetical scenarios.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 bg-transparent border border-white border-opacity-10 hover-effect">
              <div className="card-body">
                <h5 className="text-danger mb-3">📊 Analytics</h5>
                <p className="text-white-50 small mb-0">Deep dive into model performance metrics, feature importance charts, and correlation heatmaps to understand the data science driving the predictions.</p>
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
        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card bg-dark bg-opacity-25 border-0 h-100">
              <div className="card-header bg-primary text-white rounded-top">
                <h5 className="mb-0">Frontend (Client)</h5>
              </div>
              <div className="card-body rounded-bottom">
                <ul className="list-unstyled text-white-50 mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-primary me-3">React</span>
                    <span>High-performance UI rendering with Vite</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-info me-3">Chart.js</span>
                    <span>Interactive data visualization</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-secondary me-3">Bootstrap 5</span>
                    <span>Modern glass-morphism design system</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <span className="badge bg-light text-dark me-3">Axios</span>
                    <span>Efficient API communication</span>
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
                    <span>Robust API architecture</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-warning text-dark me-3">TensorFlow</span>
                    <span>Deep Learning (LSTM) engine</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-danger me-3">Scikit-Learn</span>
                    <span>Random Forest & Linear Regression</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <span className="badge bg-primary me-3">Open-Meteo</span>
                    <span>Real-time global weather data source</span>
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