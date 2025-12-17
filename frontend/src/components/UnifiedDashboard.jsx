import WeatherDashboard from './WeatherDashboard';
import AnalysisDashboard from './AnalysisDashboard';
import Simulator from './Simulator';

const UnifiedDashboard = () => {
    return (
        <div className="container-fluid">
            {/* Hero Section */}
            <section className="py-5 text-center">
                <div className="container">
                    <h1 className="display-4 mb-4">🌦️ WeatherAI Platform</h1>
                    <p className="lead text-muted mb-5">Advanced AI-powered weather prediction and analysis system</p>
                </div>
            </section>

            {/* Main Weather Dashboard */}
            <section id="dashboard" className="py-5">
                <div className="container">
                    <div className="section-container">
                        <WeatherDashboard />
                    </div>
                </div>
            </section>

            {/* Simulator Section */}
            <section id="simulator" className="py-5">
                <div className="container">
                    <div className="section-container">
                        <div className="text-center mb-5">
                            <h2 className="display-5 mb-3">🧪 AI Simulator</h2>
                            <p className="lead text-muted">Interactive weather scenario modeling</p>
                        </div>
                        <Simulator />
                    </div>
                </div>
            </section>

            {/* Analytics Section */}
            <section id="analytics" className="py-5">
                <div className="container">
                    <div className="section-container">
                        <div className="text-center mb-5">
                            <h2 className="display-5 mb-3">📊 Analytics Dashboard</h2>
                            <p className="lead text-muted">Comprehensive weather data analysis</p>
                        </div>
                        <AnalysisDashboard />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UnifiedDashboard;
