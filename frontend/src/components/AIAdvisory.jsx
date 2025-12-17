// AIAdvisory Component

const AIAdvisory = ({ condition, temperature, wind_speed }) => {
    // Logic to generate advice
    const getAdvice = () => {
        const advice = [];

        // Condition based
        if (condition === 'Rainy') {
            advice.push({ icon: '☔', text: 'Carry an umbrella. High chance of rain.' });
            advice.push({ icon: '🚗', text: 'Drive carefully, roads might be slippery.' });
        } else if (condition === 'Sunny') {
            advice.push({ icon: '😎', text: 'Great day for outdoor activities!' });
            advice.push({ icon: '🧴', text: 'Use sunscreen if going out for long.' });
        } else if (condition === 'Cloudy') {
            advice.push({ icon: '☁️', text: 'Good weather for a walk, but keep a jacket.' });
        }

        // Temperature based
        if (temperature > 30) {
            advice.push({ icon: '💧', text: 'Stay hydrated, it\'s hot outside.' });
        } else if (temperature < 10) {
            advice.push({ icon: '🧣', text: 'Wear warm clothes, it\'s chilly.' });
        }

        // Wind based
        if (wind_speed > 20) {
            advice.push({ icon: '🌬️', text: 'Strong winds! Secure loose objects.' });
            advice.push({ icon: '🚴', text: 'Avoid cycling against the wind.' });
        }

        if (advice.length === 0) {
            advice.push({ icon: '👍', text: 'Conditions look normal. Enjoy your day!' });
        }

        return advice;
    };

    const tips = getAdvice();

    return (
        <div className="card shadow-sm mt-4 border-0" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
            <div className="card-header bg-warning text-dark fw-bold">
                🤖 AI Lifestyle Advisory
            </div>
            <div className="card-body">
                <div className="row">
                    {tips.map((tip, index) => (
                        <div key={index} className="col-md-6 mb-2">
                            <div className="d-flex align-items-center p-2 border rounded bg-white text-dark shadow-sm">
                                <span className="fs-2 me-3">{tip.icon}</span>
                                <span className="fw-medium text-dark">{tip.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIAdvisory;
