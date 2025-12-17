import AnalysisDashboard from '../components/AnalysisDashboard';

const Analytics = () => {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-5 mb-3">📊 Analytics Dashboard</h1>
        <p className="lead text-muted">Comprehensive weather data analysis and insights</p>
      </div>
      
      <AnalysisDashboard />
    </div>
  );
};

export default Analytics;