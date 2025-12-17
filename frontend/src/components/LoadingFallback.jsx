const LoadingFallback = ({ componentName = "Component" }) => {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Loading {componentName}...</h5>
        <p className="text-muted small">Please wait while we prepare the content</p>
      </div>
    </div>
  );
};

export default LoadingFallback;