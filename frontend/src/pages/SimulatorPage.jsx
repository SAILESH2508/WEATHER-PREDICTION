import Simulator from '../components/Simulator';

const SimulatorPage = () => {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h1 className="display-5 mb-3">🧪 AI Weather Simulator</h1>
        <p className="lead text-muted">Interactive weather scenario modeling and testing</p>
      </div>
      
      <Simulator />
    </div>
  );
};

export default SimulatorPage;