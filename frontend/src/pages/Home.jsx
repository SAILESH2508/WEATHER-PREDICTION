import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center text-center position-relative overflow-hidden p-0">
            {/* Background Blob */}
            <div className="position-absolute top-50 start-50 translate-middle animate-pulse-slow"
                style={{
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(41,98,255,0.2) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: -1
                }}></div>

            <div className="container mw-1000px px-4">
                {/* Hero Section Container */}
                <div className="glass-card p-5 mb-5 animate-fade-in" style={{ background: 'rgba(20, 20, 35, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h1 className="display-2 fw-bold text-white mb-3 tracking-wide text-shadow">
                        Weather<span className="text-primary">AI</span> <span className="fw-light">Platform</span>
                    </h1>
                    <p className="lead text-white opacity-75 fs-4 mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                        Advanced AI-powered meteorological prediction utilizing LSTM & Random Forest models for hyper-local accuracy.
                    </p>

                    <div className="d-flex gap-4 justify-content-center flex-wrap">
                        <Link to="/dashboard" className="btn btn-lg btn-primary px-5 py-3 rounded-pill shadow-lg hover-transform fw-bold d-flex align-items-center gap-2">
                            <span>🚀</span> Launch Dashboard
                        </Link>
                        <Link to="/about" className="btn btn-lg btn-outline-light px-5 py-3 rounded-pill shadow-lg hover-transform fw-bold d-flex align-items-center gap-2"
                            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)' }}>
                            <span>ℹ️</span> System Guide
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="row g-4 w-100 mt-2 animate-fade-in delay-200">
                    <div className="col-md-4">
                        <div className="glass-card h-100 p-4 text-center hover-transform bg-glass">
                            <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.2) 0%, rgba(55, 0, 179, 0.1) 100%)' }}>
                                <span className="display-4">🤖</span>
                            </div>
                            <h4 className="text-white fw-bold mb-3">AI Prediction</h4>
                            <p className="text-white-50 small mb-0 lh-lg">
                                Proprietary ensemble algorithms analyzing decades of data to forecast complex weather patterns.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-card h-100 p-4 text-center hover-transform bg-glass">
                            <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.2) 0%, rgba(0, 96, 100, 0.1) 100%)' }}>
                                <span className="display-4">📊</span>
                            </div>
                            <h4 className="text-white fw-bold mb-3">Live Analysis</h4>
                            <p className="text-white-50 small mb-0 lh-lg">
                                Real-time telemetry processing with interactive visualizations for temperature, wind, and precipitation.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="glass-card h-100 p-4 text-center hover-transform bg-glass">
                            <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, rgba(0, 191, 165, 0.2) 0%, rgba(0, 77, 64, 0.1) 100%)' }}>
                                <span className="display-4">🌍</span>
                            </div>
                            <h4 className="text-white fw-bold mb-3">Global Scale</h4>
                            <p className="text-white-50 small mb-0 lh-lg">
                                Seamless integration with Open-Meteo API ensuring reliable data precision for any coordinate on Earth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
