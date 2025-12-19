import React from 'react';

const AstroWidget = ({ data }) => {
    if (!data || !data.daily || !data.daily.sunrise || !data.daily.sunrise.length) return null;

    const sunrise = new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uvIndex = data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0;

    // UV Level Text
    let uvLevel = 'Low';
    let uvColor = 'text-success';
    if (uvIndex > 2) { uvLevel = 'Moderate'; uvColor = 'text-warning'; }
    if (uvIndex > 5) { uvLevel = 'High'; uvColor = 'text-danger'; }
    if (uvIndex > 7) { uvLevel = 'Very High'; uvColor = 'text-danger fw-bold'; }
    if (uvIndex > 10) { uvLevel = 'Extreme'; uvColor = 'text-danger fw-black'; }

    return (
        <div className="section-container p-4 mt-4 animate-fade-in delay-300" style={{ background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)', border: '1px solid rgba(255, 235, 59, 0.3)' }}>
            <h5 className="mb-3 text-white">
                <span className="me-2">☀️</span> Daily Details
            </h5>

            <div className="d-flex justify-content-between text-center text-white">
                {/* Sunrise */}
                <div className="d-flex flex-column align-items-center">
                    <span className="fs-4 mb-1">🌅</span>
                    <small className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Sunrise</small>
                    <span className="fw-bold">{sunrise}</span>
                </div>

                {/* UV Index */}
                <div className="d-flex flex-column align-items-center border-start border-end border-white border-opacity-10 px-4">
                    <span className="fs-4 mb-1">🛡️</span>
                    <small className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Max UV</small>
                    <div>
                        <span className="fw-bold fs-5">{uvIndex}</span>
                        <div className={`small ${uvColor}`} style={{ fontSize: '0.7rem' }}>{uvLevel}</div>
                    </div>
                </div>

                {/* Sunset */}
                <div className="d-flex flex-column align-items-center">
                    <span className="fs-4 mb-1">🌇</span>
                    <small className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Sunset</small>
                    <span className="fw-bold">{sunset}</span>
                </div>
            </div>
        </div>
    );
};

export default AstroWidget;
