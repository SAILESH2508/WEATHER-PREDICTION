const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">
              <span className="me-2">🌦️</span>
              WeatherAI
            </h5>
            <p className="footer-text">
              Advanced AI-powered weather prediction system using machine learning 
              algorithms to provide accurate forecasts and insights.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">🐙 GitHub</a>
              <a href="#" className="social-link">📧 Contact</a>
              <a href="#" className="social-link">📖 Docs</a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="footer-subtitle">Features</h6>
            <ul className="footer-links">
              <li><a href="/dashboard">Live Forecast</a></li>
              <li><a href="/simulator">AI Simulator</a></li>
              <li><a href="/analytics">Analytics</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="footer-subtitle">Models</h6>
            <ul className="footer-links">
              <li><a href="#">Linear Regression</a></li>
              <li><a href="#">Random Forest</a></li>
              <li><a href="#">LSTM Neural Network</a></li>
              <li><a href="#">Ensemble Methods</a></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="footer-subtitle">Resources</h6>
            <ul className="footer-links">
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Model Performance</a></li>
              <li><a href="#">Data Sources</a></li>
              <li><a href="#">Research Papers</a></li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="footer-subtitle">System Status</h6>
            <div className="status-indicators">
              <div className="status-item">
                <span className="status-dot status-online"></span>
                <span>API Online</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-online"></span>
                <span>Models Active</span>
              </div>
              <div className="status-item">
                <span className="status-dot status-online"></span>
                <span>Data Fresh</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="footer-divider" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="footer-copyright">
              © 2024 WeatherAI. Built with ❤️ using React, Django & TensorFlow
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-stats">
              <span className="stat-item">🎯 95.2% Accuracy</span>
              <span className="stat-item">⚡ 1.2s Response</span>
              <span className="stat-item">🌍 Global Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;