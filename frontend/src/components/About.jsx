// About Component
import AnalysisDashboard from './AnalysisDashboard';
import SystemStatus from './SystemStatus';

const About = () => {
    return (
        <div className="container py-5">
            <h1 className="display-4 fw-bold text-center mb-5 hover-animate">🤖 Advanced AI Technology</h1>

            {/* AI Technology Showcase (Moved from Home) */}
            <section className="py-5 tech-showcase">
                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="card tech-card">
                            <div className="card-header bg-info">
                                <div className="d-flex align-items-center">
                                    <span className="tech-icon me-3">🧠</span>
                                    <div>
                                        <h5 className="mb-0">AI Model Architecture</h5>
                                        <small className="opacity-75">Multiple algorithms working together</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="model-grid">
                                    <div className="model-item">
                                        <div className="model-badge bg-primary">
                                            <span className="model-icon">🔮</span>
                                            <span className="model-name">LSTM</span>
                                        </div>
                                        <div className="model-description">
                                            <strong>Deep Learning</strong><br />
                                            <small>Time series prediction with neural networks</small>
                                        </div>
                                        <div className="model-accuracy">95.8%</div>
                                    </div>
                                    <div className="model-item">
                                        <div className="model-badge bg-success">
                                            <span className="model-icon">🌳</span>
                                            <span className="model-name">Random Forest</span>
                                        </div>
                                        <div className="model-description">
                                            <strong>Ensemble Method</strong><br />
                                            <small>Robust predictions through multiple trees</small>
                                        </div>
                                        <div className="model-accuracy">94.2%</div>
                                    </div>
                                    <div className="model-item">
                                        <div className="model-badge bg-warning">
                                            <span className="model-icon">📈</span>
                                            <span className="model-name">Linear Regression</span>
                                        </div>
                                        <div className="model-description">
                                            <strong>Fast Baseline</strong><br />
                                            <small>Quick predictions for real-time analysis</small>
                                        </div>
                                        <div className="model-accuracy">89.5%</div>
                                    </div>
                                    <div className="model-item">
                                        <div className="model-badge bg-danger">
                                            <span className="model-icon">🎯</span>
                                            <span className="model-name">Ensemble</span>
                                        </div>
                                        <div className="model-description">
                                            <strong>Combined Power</strong><br />
                                            <small>Consensus from all models for best results</small>
                                        </div>
                                        <div className="model-accuracy">96.1%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="card performance-card">
                            <div className="card-header bg-dark">
                                <div className="d-flex align-items-center">
                                    <span className="tech-icon me-3">📊</span>
                                    <div>
                                        <h5 className="mb-0">Real-time Performance</h5>
                                        <small className="opacity-75">Live system metrics and benchmarks</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="performance-grid">
                                    <div className="performance-metric">
                                        <div className="metric-circle primary">
                                            <div className="metric-value">95.2%</div>
                                            <div className="metric-label">Accuracy</div>
                                        </div>
                                    </div>
                                    <div className="performance-metric">
                                        <div className="metric-circle success">
                                            <div className="metric-value">1.2s</div>
                                            <div className="metric-label">Latency</div>
                                        </div>
                                    </div>
                                    <div className="performance-metric">
                                        <div className="metric-circle warning">
                                            <div className="metric-value">2.1°C</div>
                                            <div className="metric-label">Error</div>
                                        </div>
                                    </div>
                                    <div className="performance-metric">
                                        <div className="metric-circle danger">
                                            <div className="metric-value">99.9%</div>
                                            <div className="metric-label">Uptime</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="performance-chart mt-4">
                                    <div className="chart-bar">
                                        <div className="bar-label">Temperature Prediction</div>
                                        <div className="bar-container">
                                            <div className="bar-fill primary" style={{ width: '95%' }}></div>
                                            <span className="bar-value">95%</span>
                                        </div>
                                    </div>
                                    <div className="chart-bar">
                                        <div className="bar-label">Rainfall Prediction</div>
                                        <div className="bar-container">
                                            <div className="bar-fill success" style={{ width: '87%' }}></div>
                                            <span className="bar-value">87%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live System Performance Section (Moved from Home) */}
            <section className="py-5 stats-section">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3">⚡ Live System Performance</h2>
                    <p className="lead text-muted">Real-time metrics and system health monitoring</p>
                </div>
                
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <SystemStatus />
                    </div>
                </div>
            </section>

            <div className="row mb-5">
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 hover-card">
                        <div className="card-body p-4">
                            <h3 className="h4 fw-bold text-primary mb-3">Ensemble Learning</h3>
                            <p className="text-muted">
                                Our system utilizes a "Consensus Engine" that combines predictions from multiple advanced algorithms.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 hover-card">
                        <div className="card-body p-4">
                            <h3 className="h4 fw-bold text-success mb-3">AI Advisory System</h3>
                            <p className="text-muted">
                                Beyond just numbers, our AI interprets weather conditions to provide actionable lifestyle advice.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-5">
                <div className="card-header bg-transparent border-0">
                    <h3 className="h4 fw-bold text-center mb-0 mt-3">Model Performance Analytics</h3>
                </div>
                <div className="card-body">
                    <AnalysisDashboard />
                </div>
            </div>
        </div>
    );
};

export default About;
