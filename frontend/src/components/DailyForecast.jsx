import React from 'react';

const DailyForecast = ({ data, locationName }) => {
    if (!data || !data.time) return null;

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getIcon = (code) => {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 45) return '🌫️';
        if (code <= 57) return '🌧️';
        if (code <= 67) return '🌧️';
        if (code <= 77) return '❄️';
        if (code <= 82) return '🌦️';
        if (code <= 99) return '⛈️';
        return '🌤️';
    };

    const days = data.time.slice(0, 7);
    const maxTemps = data.temperature_2m_max?.slice(0, 7) || [];
    const minTemps = data.temperature_2m_min?.slice(0, 7) || [];
    const codes = data.weather_code?.slice(0, 7) || [];

    return (
        <div className="h-100 d-flex flex-column text-shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-white fw-bold d-flex align-items-center gap-2">
                    <span className="fs-4">🗓️</span>
                    <span>7-Day Forecast</span>
                </h5>
                {locationName && (
                    <span className="badge bg-white bg-opacity-10 text-white border border-white border-opacity-10 rounded-pill px-3">
                        {locationName.split(',')[0]}
                    </span>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto custom-scrollbar pe-1">
                {days.map((day, index) => {
                    const min = Math.round(minTemps[index] || 0);
                    const max = Math.round(maxTemps[index] || 0);
                    const rainProb = data.precipitation_probability_max?.[index] || 0;

                    // Gradient bar calculation
                    const globalMin = Math.min(...minTemps) - 2;
                    const globalMax = Math.max(...maxTemps) + 2;
                    const range = globalMax - globalMin;
                    const leftPos = ((min - globalMin) / range) * 100;
                    const width = ((max - min) / range) * 100;

                    return (
                        <div key={day} className="d-flex align-items-center justify-content-between p-3 rounded-4 mb-2 hover-transform position-relative overflow-hidden"
                            style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

                            {/* Day */}
                            <div style={{ width: '60px' }}>
                                <span className={`d-block fw-bold ${index === 0 ? 'text-info' : 'text-white'}`}>
                                    {index === 0 ? 'Today' : getDayName(day)}
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="text-center" style={{ width: '40px' }}>
                                <span className="fs-4 drop-shadow filter-drop-shadow">{getIcon(codes[index])}</span>
                            </div>

                            {/* Rain Chance */}
                            <div className="text-center" style={{ width: '50px' }}>
                                {rainProb > 0 ? (
                                    <small className="text-info fw-bold d-flex align-items-center justify-content-center gap-1">
                                        💧 {rainProb}%
                                    </small>
                                ) : (
                                    <small className="text-white-50 opacity-50">-</small>
                                )}
                            </div>

                            {/* Temp Visualization */}
                            <div className="flex-grow-1 mx-3 position-relative d-flex align-items-center">
                                <small className="text-white-50 fw-bold me-2" style={{ width: '25px', textAlign: 'right' }}>{min}°</small>
                                <div className="flex-grow-1 position-relative bg-white bg-opacity-10 rounded-pill" style={{ height: '6px' }}>
                                    <div
                                        className="position-absolute rounded-pill shadow-sm"
                                        style={{
                                            left: `${leftPos}%`,
                                            width: `${width}%`,
                                            top: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                                        }}
                                    />
                                </div>
                                <small className="text-white fw-bold ms-2" style={{ width: '25px' }}>{max}°</small>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly Outlook */}
            <div className="mt-3 p-3 rounded-4 border border-white border-opacity-10" style={{ background: 'transparent' }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="text-white fw-bold text-uppercase small tracking-wide text-opacity-75">Weekly Outlook</span>
                </div>
                <p className="text-white mb-0 small opacity-90">
                    Highs between <span className="fw-bold">{Math.min(...maxTemps)}°</span> and <span className="fw-bold">{Math.max(...maxTemps)}°</span>.
                    {codes.includes(95) || codes.includes(63) ? " Rain expected." : " Mostly fair weather."}
                </p>
            </div>
        </div>
    );
};

export default DailyForecast;
