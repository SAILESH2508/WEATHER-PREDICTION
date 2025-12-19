// About Component
const About = () => {
    return (
        <div className="container py-5 mt-4">
            <div className="text-center mb-5 fade-in-up">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill mb-3">
                    Version 2.0
                </span>
                <h1 className="display-4 fw-bold text-white mb-3">About WeatherAI</h1>
                <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                    An advanced meteorological system powered by Ensemble Machine Learning algorithms for hyper-local weather prediction.
                </p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-sm hover-lift">
                        <div className="card-body p-4 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                                <span className="fs-2">🧠</span>
                            </div>
                            <h3 className="h5 fw-bold text-white mb-2">Multi-Model AI</h3>
                            <p className="text-white-50 small mb-0">
                                Combines LSTM (Deep Learning), Random Forest, and Linear Regression to form a consensus prediction with higher accuracy than single models.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-sm hover-lift">
                        <div className="card-body p-4 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                                <span className="fs-2">🌐</span>
                            </div>
                            <h3 className="h5 fw-bold text-white mb-2">Global Coverage</h3>
                            <p className="text-white-50 small mb-0">
                                Integrated with Open-Meteo API to provide real-time data and geocoding for millions of locations worldwide, from major cities to remote villages.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-sm hover-lift">
                        <div className="card-body p-4 text-center">
                            <div className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                                <span className="fs-2">⚡</span>
                            </div>
                            <h3 className="h5 fw-bold text-white mb-2">Real-Time Analysis</h3>
                            <p className="text-white-50 small mb-0">
                                Process live atmospheric parameters instantly. The system provides immediate feedback with trend analysis and lifestyle advisories.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 bg-transparent">
                <div className="card-body p-0">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h3 className="fw-bold text-white mb-3">Technical Architecture</h3>
                            <ul className="list-unstyled">
                                <li className="d-flex mb-3">
                                    <span className="text-primary me-3">✔️</span>
                                    <div>
                                        <strong className="text-white">Frontend:</strong>
                                        <span className="text-white-50 d-block">React 18 + Vite, Bootstrap 5 (Glassmorphism), Chart.js</span>
                                    </div>
                                </li>
                                <li className="d-flex mb-3">
                                    <span className="text-primary me-3">✔️</span>
                                    <div>
                                        <strong className="text-white">Backend:</strong>
                                        <span className="text-white-50 d-block">Django REST Framework, Scikit-Learn, TensorFlow/Keras</span>
                                    </div>
                                </li>
                                <li className="d-flex mb-3">
                                    <span className="text-primary me-3">✔️</span>
                                    <div>
                                        <strong className="text-white">Deployment:</strong>
                                        <span className="text-white-50 d-block">Waitress (Production Server), Whitenoise</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <div className="p-4 rounded-3 border border-white border-opacity-10 bg-white bg-opacity-5">
                                <h5 className="text-white mb-3">System Capabilities</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">🌡️ Temperature Forecasting</span>
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">💧 Rainfall Probability</span>
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">🏙️ City Search</span>
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">📅 Historical Data</span>
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">📊 Interactive Charts</span>
                                    <span className="badge bg-dark border border-white border-opacity-25 fw-normal py-2 px-3">📥 Export Reports</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
