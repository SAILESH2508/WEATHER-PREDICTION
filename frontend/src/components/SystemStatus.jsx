import { useState, useEffect } from 'react';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    ui: 'online',
    api: 'checking',
    models: 'checking'
  });

  useEffect(() => {
    // Simulate status checks
    const timer = setTimeout(() => {
      setStatus({
        ui: 'online',
        api: 'online',
        models: 'online'
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'var(--success)';
      case 'checking': return 'var(--warning)';
      case 'offline': return 'var(--danger)';
      default: return 'var(--gray-400)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '✅';
      case 'checking': return '🔄';
      case 'offline': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <span className="me-2">🔧</span>
          System Status
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
                {getStatusIcon(status.ui)}
              </div>
              <h6>User Interface</h6>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: getStatusColor(status.ui),
                  color: 'white'
                }}
              >
                {status.ui.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
                {getStatusIcon(status.api)}
              </div>
              <h6>API Server</h6>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: getStatusColor(status.api),
                  color: 'white'
                }}
              >
                {status.api.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-3">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
                {getStatusIcon(status.models)}
              </div>
              <h6>AI Models</h6>
              <span 
                className="badge" 
                style={{ 
                  backgroundColor: getStatusColor(status.models),
                  color: 'white'
                }}
              >
                {status.models.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3" style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
          <h6 className="mb-2">✨ UI Features Status</h6>
          <div className="row">
            <div className="col-6">
              <small className="text-success">✅ Responsive Design</small><br />
              <small className="text-success">✅ Clean Typography</small><br />
              <small className="text-success">✅ Modern Cards</small>
            </div>
            <div className="col-6">
              <small className="text-success">✅ Interactive Elements</small><br />
              <small className="text-success">✅ Mobile Optimized</small><br />
              <small className="text-success">✅ Accessible Design</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;