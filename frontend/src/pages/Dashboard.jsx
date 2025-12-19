import WeatherDashboard from '../components/WeatherDashboard';

const Dashboard = ({ locationName }) => {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-5 mb-3">🌤️ Live Weather Dashboard</h1>
        <p className="lead">Real-time weather predictions powered by AI</p>
      </div>

      <WeatherDashboard locationName={locationName} />
    </div>
  );
};

export default Dashboard;