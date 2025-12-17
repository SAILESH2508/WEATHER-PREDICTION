import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Simulator = () => {
    const [inputs, setInputs] = useState({
        temperature: 25,
        humidity: 60,
        rainfall: 0,
        wind_speed: 10
    });

    const [prediction, setPrediction] = useState(null);
    const [condition, setCondition] = useState(null);

    // Debounce effect or simple effect
    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                // Get Standard Prediction
                const resPred = await axios.post('http://127.0.0.1:8000/api/predict/', inputs);
                setPrediction(resPred.data);

                // Get Classification
                const resCond = await axios.post('http://127.0.0.1:8000/api/predict_condition/', inputs);
                setCondition(resCond.data.condition);
            } catch (err) {
                console.error("Simulator API Error", err);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPrediction();
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [inputs]);

    const handleSliderChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: parseFloat(e.target.value)
        });
    };

    return (
        <div className="row">
            {/* Controls */}
            <div className="col-md-5">
                <div className="card border-0 bg-transparent mb-4">
                    <div className="card-header bg-primary text-white rounded-top fw-bold">
                        <span className="me-2">⚙️</span> Parameters
                    </div>
                    <div className="card-body bg-white bg-opacity-10 rounded-bottom">
                        <div className="mb-4">
                            <label className="form-label text-white fw-bold small text-uppercase">Temperature: <span className="text-info">{inputs.temperature}°C</span></label>
                            <input type="range" className="form-range" min="-10" max="50" step="0.5" name="temperature" value={inputs.temperature} onChange={handleSliderChange} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-white fw-bold small text-uppercase">Humidity: <span className="text-info">{inputs.humidity}%</span></label>
                            <input type="range" className="form-range" min="0" max="100" name="humidity" value={inputs.humidity} onChange={handleSliderChange} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-white fw-bold small text-uppercase">Rainfall: <span className="text-info">{inputs.rainfall} mm</span></label>
                            <input type="range" className="form-range" min="0" max="100" step="0.5" name="rainfall" value={inputs.rainfall} onChange={handleSliderChange} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-white fw-bold small text-uppercase">Wind Speed: <span className="text-info">{inputs.wind_speed} km/h</span></label>
                            <input type="range" className="form-range" min="0" max="100" step="1" name="wind_speed" value={inputs.wind_speed} onChange={handleSliderChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="col-md-7">
                <div className="card shadow-sm h-100">
                    <div className="card-header bg-success text-white">AI Prediction</div>
                    <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                        {prediction ? (
                            <>
                                <h4 className="mb-3">Condition: <span className="badge bg-warning text-dark">{condition || 'Loading...'}</span></h4>

                                <div className="row w-100">
                                    <div className="col-6">
                                        <div className="p-4 border border-white border-opacity-25 rounded shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                            <h5 className="mb-2 text-warning small text-uppercase fw-bold">Predicted Temp</h5>
                                            <h2 className="text-white mb-0 fw-bold">{prediction.predicted_temperature}°C</h2>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-4 border border-white border-opacity-25 rounded shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                            <h5 className="mb-2 text-info small text-uppercase fw-bold">Predicted Rain</h5>
                                            <h2 className="text-white mb-0 fw-bold">{prediction.predicted_rainfall} mm</h2>
                                        </div>
                                    </div>
                                </div>

                                {prediction.alerts && prediction.alerts.length > 0 && (
                                    <div className="alert alert-danger mt-3 w-100">
                                        <strong>Warning:</strong> {prediction.alerts.join(', ')}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Simulating...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Simulator;
