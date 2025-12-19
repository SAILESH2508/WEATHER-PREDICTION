import React from 'react';

const DailyForecast = ({ data, locationName }) => {
    if (!data || !data.time) return null;

    // Helper to get day name
    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Helper for icons based on code (simplified)
    const getIcon = (code) => {
        if (code === 0) return '☀️'; // Clear
        if (code <= 3) return '⛅'; // Part Cloud
        if (code <= 48) return '🌫️'; // Fog
        if (code <= 67) return '🌧️'; // Rain
        if (code <= 77) return '❄️'; // Snow
        if (code <= 82) return '🌦️'; // Showers
        if (code <= 99) return '⛈️'; // Thunder
        return '🌤️';
    };

    const days = data.time.slice(0, 7); // Next 7 days
    const maxTemps = data.temperature_2m_max?.slice(0, 7) || [];
    const minTemps = data.temperature_2m_min?.slice(0, 7) || [];
    const codes = data.weather_code?.slice(0, 7) || [];

    return (
        <div className="glass-card h-100 d-flex flex-column">
            <h5 className="mb-2 text-white">
                <span className="me-2">📅</span> 7-Day Forecast
                {locationName && <div className="small text-white-50 mt-1" style={{ fontSize: '0.8rem' }}>{locationName}</div>}
            </h5>
            <div className="d-flex flex-column h-100 justify-content-start gap-1 overflow-auto" style={{ maxHeight: '100%' }}>
                {days.map((day, index) => {
                    const min = Math.round(minTemps[index] || 0);
                    const max = Math.round(maxTemps[index] || 0);
                    const rainProb = data.precipitation_probability_max?.[index] || 0;
                    const wind = Math.round(data.windspeed_10m_max?.[index] || 0);

                    // Calculate range position relative to fixed global range
                    const globalMin = Math.min(...minTemps);
                    const globalMax = Math.max(...maxTemps);
                    const range = globalMax - globalMin || 1;

                    return (
                        <div key={day} className="d-flex align-items-center justify-content-between p-2 rounded hover-scale-sm mb-1" style={{ transition: 'all 0.2s', cursor: 'default', background: 'rgba(0, 0, 0, 0.2)' }}>

                            {/* Left: Day & Date */}
                            <div className="d-flex flex-column" style={{ width: '60px' }}>
                                <span className="text-white fw-bold">{index === 0 ? 'Today' : getDayName(day)}</span>
                                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>{new Date(day).getDate()} {new Date(day).toLocaleDateString('en-US', { month: 'short' })}</small>
                            </div>

                            {/* Icon */}
                            <div className="d-flex align-items-center justify-content-center" style={{ width: '40px' }}>
                                <span className="fs-3 drop-shadow">{getIcon(codes[index])}</span>
                            </div>

                            {/* Middle: Stats (New) */}
                            <div className="d-flex flex-column align-items-center mx-2" style={{ width: '60px' }}>
                                <div className="d-flex align-items-center gap-1" title="Rain Probability">
                                    <span style={{ fontSize: '0.7rem' }}>💧</span>
                                    <small className="text-info fw-bold" style={{ fontSize: '0.75rem' }}>{rainProb}%</small>
                                </div>
                                <div className="d-flex align-items-center gap-1" title="Wind Speed">
                                    <span style={{ fontSize: '0.7rem' }}>💨</span>
                                    <small className="text-white-50" style={{ fontSize: '0.75rem' }}>{wind}km</small>
                                </div>
                            </div>

                            {/* Right: Temp Range */}
                            <div className="d-flex flex-column align-items-center flex-grow-1" style={{ minWidth: '80px' }}>
                                <div className="d-flex w-100 justify-content-between px-1">
                                    <small className="text-white-50 fw-bold">{min}°</small>
                                    <small className="text-white fw-bold">{max}°</small>
                                </div>
                                <div className="w-100 position-relative bg-white bg-opacity-10 rounded-pill mt-1" style={{ height: '4px' }}>
                                    <div
                                        className="position-absolute rounded-pill"
                                        style={{
                                            left: `${((min - (Math.min(...minTemps) - 2)) / ((Math.max(...maxTemps) + 2) - (Math.min(...minTemps) - 2))) * 100}%`,
                                            right: `${100 - (((max - (Math.min(...minTemps) - 2)) / ((Math.max(...maxTemps) + 2) - (Math.min(...minTemps) - 2))) * 100)}%`,
                                            top: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly Outlook Summary to fill space */}
            <div className="mt-auto pt-3 border-top border-white border-opacity-10">
                <small className="text-uppercase text-white-50 fw-bold" style={{ fontSize: '0.7rem' }}>Weekly Outlook</small>
                <p className="text-white mb-0 mt-1" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    Expect temperatures between <span className="fw-bold">{Math.min(...minTemps)}°</span> and <span className="fw-bold">{Math.max(...maxTemps)}°</span>.
                    {codes.includes(95) || codes.includes(63) ? " Rain or storms possible." : " Generally mild conditions ahead."}
                </p>
            </div>
        </div>
    );
};

export default DailyForecast;
