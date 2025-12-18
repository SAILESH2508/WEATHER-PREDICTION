import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import AIAdvisory from './AIAdvisory';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const WeatherDashboard = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [inputs, setInputs] = useState({ temperature: 25, humidity: 60, rainfall: 0, wind_speed: 10 });
    const [prediction, setPrediction] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [ensemble, setEnsemble] = useState(null); // State for ensemble data
    const [loading, setLoading] = useState(false);
    const [useLSTM, setUseLSTM] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const lat = params.get('lat');
        const lon = params.get('lon');

        if (lat && lon) {
            fetchCurrentWeather(lat, lon);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchCurrentWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.warn("Geolocation denied/failed. Using default location.", err);
                    fetchCurrentWeather();
                }
            );
        } else {
            fetchCurrentWeather();
        }

        fetchMetrics();
    }, [location.search]);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/metrics/');
            setMetrics(response.data);
        } catch (err) {
            console.error("Failed to fetch metrics", err);
        }
    };

    const fetchCurrentWeather = async (lat = null, lon = null) => {
        try {
            let url = 'http://127.0.0.1:8000/api/current/';
            if (lat && lon) {
                url += `?lat=${lat}&lon=${lon}`;
            }
            const response = await axios.get(url);
            setCurrentWeather(response.data);

            // Pre-fill inputs with current weather
            setInputs({
                temperature: response.data.temperature,
                humidity: response.data.humidity,
                rainfall: response.data.rainfall,
                wind_speed: response.data.wind_speed
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handlePredict = async (e, customInputs = null) => {
        if (e && e.preventDefault) e.preventDefault();

        const inputData = customInputs || inputs;
        setLoading(true);
        setError(null);
        setPrediction(null);
        setEnsemble(null);

        // Update inputs if custom inputs provided
        if (customInputs) {
            setInputs(customInputs);
        }

        try {
            // 1. Primary Prediction (standard or LSTM)
            const endpoint = useLSTM ? 'http://127.0.0.1:8000/api/predict_lstm/' : 'http://127.0.0.1:8000/api/predict/';
            const response = await axios.post(endpoint, inputData);
            setPrediction(response.data);

            // 2. Ensemble Prediction (Always fetch for comparison/pro-mode)
            try {
                const ensembleRes = await axios.post('http://127.0.0.1:8000/api/predict_ensemble/', inputData);
                setEnsemble(ensembleRes.data);
            } catch (ensErr) {
                console.warn("Ensemble fetch failed", ensErr);
            }

        } catch (err) {
            setError("Failed to fetch prediction. Check connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const downloadReport = () => {
        if (!prediction) return;
        const element = document.createElement("a");
        const file = new Blob([
            `WEATHER FORECAST REPORT\n=======================\n\n` +
            `Date: ${new Date().toLocaleString()}\n` +
            `City: ${currentWeather?.city || 'N/A'}\n\n` +
            `PREDICTION\n----------\n` +
            `Temperature: ${prediction.predicted_temperature}°C\n` +
            `Rainfall: ${prediction.predicted_rainfall} mm\n` +
            (ensemble ? `Ensemble Consensus: ${ensemble.ensemble_temperature}°C\n` : '') +
            `\nADVISORY\n--------\n` +
            `Condition: ${prediction.classification || (prediction.predicted_rainfall > 0 ? 'Rainy' : 'Sunny')}\n` +
            `Note: Use this report for planning purposes only.\n`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "weather_report.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    // Chart Data
    const chartData = {
        labels: ['Current', 'Predicted'],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [currentWeather?.temperature || 0, prediction?.predicted_temperature || 0],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Rainfall (mm)',
                data: [currentWeather?.rainfall || 0, prediction?.predicted_rainfall || 0],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="container-fluid mt-4">

            {/* AI Forecast Studio (Priority Section) */}
            <div id="studio" className="section-container">
                <div className="d-flex align-items-center mb-4">
                    <span className="fs-2 me-2">🔬</span>
                    <h3 className="mb-0 text-white">AI Forecast Studio</h3>
                </div>
                <div className="row">
                    {/* Prediction Form */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-header bg-primary rounded-top">
                                <h5 className="mb-0">
                                    <span className="me-2">🎛️</span>
                                    Custom Prediction
                                </h5>
                            </div>
                            <div className="card-body bg-dark bg-opacity-50 rounded-bottom">
                                <form onSubmit={handlePredict}>
                                    <div className="form-group mb-3">
                                        <label className="form-label small text-uppercase fw-bold text-white-50">Temperature (°C)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="temperature"
                                            className="form-control"
                                            value={inputs.temperature}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label small text-uppercase fw-bold text-white-50">Humidity (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="humidity"
                                            className="form-control"
                                            value={inputs.humidity}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label small text-uppercase fw-bold text-white-50">Rainfall (mm)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="rainfall"
                                            className="form-control"
                                            value={inputs.rainfall}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="form-label small text-uppercase fw-bold text-white-50">Wind Speed (km/h)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="wind_speed"
                                            className="form-control"
                                            value={inputs.wind_speed}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-check form-switch mb-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="lstmToggle"
                                            checked={useLSTM}
                                            onChange={(e) => setUseLSTM(e.target.checked)}
                                        />
                                        <label className="form-check-label text-white" htmlFor="lstmToggle">
                                            🧠 Use LSTM (Deep Learning)
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-success w-100 py-2" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Running Models...
                                            </>
                                        ) : (
                                            <>
                                                <span className="me-2">🔮</span>
                                                Generate Forecast
                                            </>
                                        )}
                                    </button>
                                </form>
                                {error && (
                                    <div className="alert alert-danger mt-3 mb-0">
                                        <small>{error}</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results & Analysis */}
                    <div className="col-lg-8">
                        {/* Live Weather Status (Integrated) */}
                        {/* Live Weather Status - Moved to Sidebar */}


                        {/* Prediction Result Summary */}
                        <div className="card mb-4 border-0 bg-transparent">
                            <div className="card-header bg-success rounded-top">
                                <h5 className="mb-0">
                                    <span className="me-2">🔮</span>
                                    Forecast Result
                                </h5>
                            </div>
                            <div className="card-body bg-dark bg-opacity-50 rounded-bottom text-center">
                                {loading ? (
                                    <div className="py-4">
                                        <div className="spinner-border text-success" role="status"></div>
                                        <p className="mt-2 text-white-50">Analyzing atmospheric patterns...</p>
                                    </div>
                                ) : prediction ? (
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <div className="weather-icon">
                                                {prediction.predicted_rainfall > 5 ? '🌧️' : prediction.predicted_rainfall > 0 ? '🌦️' : prediction.predicted_temperature > 30 ? '☀️' : '⛅'}
                                            </div>
                                            <div className="badge bg-success fs-6 mt-2">
                                                {prediction.classification || 'Normal'}
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-6 mb-3">
                                                    <h2 className="text-white mb-0">{prediction.predicted_temperature}°C</h2>
                                                    <small className="text-white-50">Temperature</small>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h2 className="text-info mb-0">{prediction.predicted_rainfall} mm</h2>
                                                    <small className="text-white-50">Rainfall</small>
                                                </div>
                                            </div>
                                            {prediction.alerts && prediction.alerts.length > 0 && (
                                                <div className="alert alert-warning mt-2 small py-2 mb-0">
                                                    {prediction.alerts[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4 text-white-50">
                                        <div className="fs-1 mb-2">🤖</div>
                                        <p className="mb-0">Configure parameters on the left to generate a forecast.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card mb-4 border-0 bg-transparent">
                            <div className="card-header bg-info rounded-top">
                                <h5 className="mb-0 text-dark">
                                    <span className="me-2">📈</span>
                                    Trends Analysis
                                </h5>
                            </div>
                            <div className="card-body bg-dark bg-opacity-50 rounded-bottom">
                                <div className="chart-container" style={{ height: '300px' }}>
                                    <Bar data={chartData} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top', labels: { color: 'white' } },
                                            title: { display: true, text: 'Current vs Predicted Weather', color: 'white' }
                                        },
                                        scales: {
                                            y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                                            x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Ensemble Results */}
                        {ensemble && (
                            <div className="card mb-4 border-0 bg-transparent">
                                <div className="card-header bg-warning rounded-top">
                                    <h5 className="mb-0 text-dark">
                                        <span className="me-2">🎯</span>
                                        Ensemble Consensus
                                    </h5>
                                </div>
                                <div className="card-body bg-dark bg-opacity-50 rounded-bottom">
                                    <div className="row text-center">
                                        <div className="col-6">
                                            <div className="p-3 bg-dark bg-opacity-25 rounded">
                                                <h3 className="text-info mb-0">{ensemble.predicted_temperature}°C</h3>
                                                <small className="text-white-50">Temperature</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 bg-dark bg-opacity-25 rounded">
                                                <h3 className="text-info mb-0">{ensemble.predicted_rainfall} mm</h3>
                                                <small className="text-white-50">Rainfall</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Advisory Section */}
                        {prediction && (
                            <AIAdvisory
                                condition={prediction.classification || (prediction.predicted_rainfall > 0 ? 'Rainy' : 'Sunny')}
                                temperature={prediction.predicted_temperature}
                                wind_speed={inputs.wind_speed}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherDashboard;

