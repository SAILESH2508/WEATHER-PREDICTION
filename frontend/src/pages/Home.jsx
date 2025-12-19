import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="mb-5 animate-fade-in">
                <h1 className="display-2 fw-bold text-white mb-2" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    WeatherAI <span className="text-primary">Platform</span>
                </h1>
                <p className="lead text-white-50 fs-4 mb-5">
                    Advanced AI-powered weather prediction and analysis system using machine learning.
                </p>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/dashboard" className="btn btn-lg btn-primary px-5 py-3 rounded-pill shadow-lg hover-scale">
                        🚀 Launch Dashboard
                    </Link>
                    <Link to="/about" className="btn btn-lg btn-glass px-5 py-3 rounded-pill shadow-lg hover-scale">
                        ℹ️ Learn More
                    </Link>
                </div>
            </div>

            <div className="row g-4 w-100 mw-1000px mt-5 animate-fade-in delay-200">
                <div className="col-md-4">
                    <div className="glass-card h-100 p-4 text-center">
                        <div className="display-4 mb-3">🤖</div>
                        <h4 className="text-white">AI Prediction</h4>
                        <p className="text-white-50 small">LSTM & Random Forest models predict weather patterns with high accuracy.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card h-100 p-4 text-center">
                        <div className="display-4 mb-3">📊</div>
                        <h4 className="text-white">Live Analysis</h4>
                        <p className="text-white-50 small">Real-time charts and trends analysis for temperature and rainfall.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card h-100 p-4 text-center">
                        <div className="display-4 mb-3">🌍</div>
                        <h4 className="text-white">Global Coverage</h4>
                        <p className="text-white-50 small">Accurate data for any location worldwide using Open-Meteo integration.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
