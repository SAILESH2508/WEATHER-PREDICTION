const LoadingScreen = ({ message = "Loading WeatherAI..." }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-icon">🌦️</span>
          <h2 className="loading-title">WeatherAI</h2>
        </div>
        
        <div className="loading-animation">
          <div className="weather-elements">
            <div className="element sun">☀️</div>
            <div className="element cloud">☁️</div>
            <div className="element rain">🌧️</div>
            <div className="element snow">❄️</div>
          </div>
        </div>
        
        <div className="loading-message">{message}</div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        
        <div className="loading-tips">
          <p>💡 Tip: Our AI analyzes multiple weather patterns for accurate predictions</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;