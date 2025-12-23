import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import DownloadReportButton from './DownloadReportButton';
import AstroWidget from './AstroWidget';
import { getWeatherTheme } from '../utils/weatherTheme';

const WeatherDashboard = ({ locationName }) => {
    const location = useLocation();


    // State
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyData, setHourlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [networkError, setNetworkError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Default Location: Coimbatore
    const DEFAULT_LAT = 11.0168;
    const DEFAULT_LON = 76.9558;
    const DEFAULT_CITY = 'Coimbatore, Tamil Nadu, India';

    // Prediction Inputs
    const [inputs, setInputs] = useState({
        temperature: 25,
        humidity: 60,
        rainfall: 0,
        wind_speed: 10
    });

    const [prediction, setPrediction] = useState(null);

    const handlePredictManual = useCallback(async (t, h, r, w) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/predict_lstm/`, {
                temperature: t,
                humidity: h,
                rainfall: r,
                wind_speed: w
            }, {
                timeout: 15000 // 15 second timeout for ML predictions
            });
            setPrediction(res.data);
        } catch (err) {
            console.error("Prediction Error:", err.message);
            
            // Provide fallback prediction when API is unavailable
            const fallbackPrediction = {
                prediction: "API Offline - Demo Mode",
                confidence: "N/A",
                temperature_tomorrow: Math.round(t + (Math.random() * 4 - 2)), // ±2°C variation
                rainfall_tomorrow: Math.max(0, r + (Math.random() * 10 - 5)), // ±5mm variation
                condition_tomorrow: "Partly Cloudy",
                message: "Backend API is currently unavailable. Showing demo data."
            };
            
            setPrediction(fallbackPrediction);
        }
    }, []);

    // Initial Fetch
    useEffect(() => {
        const fetchWeather = async () => {
            const queryParams = new URLSearchParams(location.search);
            try {
                let lat = queryParams.get('lat');
                let lon = queryParams.get('lon');
                let cityParam = queryParams.get('city');

                // Default to Coimbatore if no params
                if (!lat || !lon) {
                    lat = DEFAULT_LAT;
                    lon = DEFAULT_LON;
                    cityParam = DEFAULT_CITY;
                }

                let url = `${API_BASE_URL}/api/current/`;
                url += `?lat=${lat}&lon=${lon}`;
                if (cityParam) url += `&city=${encodeURIComponent(cityParam)}`;

                const res = await axios.get(url);
                let weatherData = res.data;
                let targetDate = queryParams.get('date');
                let isHistory = false;

                // Handle Date Selection
                if (targetDate) {
                    const dailyTimes = weatherData.daily.time;
                    const dateIndex = dailyTimes.indexOf(targetDate);

                    if (dateIndex !== -1) {
                        isHistory = true;

                        // Create a specific weather object for that day
                        const dayMaxTemp = weatherData.daily.temperature_2m_max[dateIndex];
                        const dayMinTemp = weatherData.daily.temperature_2m_min[dateIndex];
                        const dayRain = weatherData.daily.rain_sum ? weatherData.daily.rain_sum[dateIndex] : (weatherData.daily.precipitation_sum ? weatherData.daily.precipitation_sum[dateIndex] : 0);
                        const dayWind = weatherData.daily.windspeed_10m_max ? weatherData.daily.windspeed_10m_max[dateIndex] : 10;
                        const dayCode = weatherData.daily.weather_code[dateIndex];

                        // Construct "Current" view for that Date
                        weatherData.current_weather = {
                            temperature: (dayMaxTemp + dayMinTemp) / 2, // Avg temp
                            windspeed: dayWind,
                            winddirection: 0,
                            weathercode: dayCode,
                            is_day: 1, // Assume day for viewing
                            time: targetDate
                        };

                        // Override top-level properties for display
                        weatherData.temperature = (dayMaxTemp + dayMinTemp) / 2;
                        weatherData.rainfall = dayRain;
                        weatherData.wind_speed = dayWind;
                        weatherData.description = `Forecast for ${new Date(targetDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
                        weatherData.code = dayCode;

                        // Filter Hourly to just that day
                        const hourlyTimes = weatherData.hourly.time;
                        const startIndex = hourlyTimes.findIndex(t => t.startsWith(targetDate));
                        if (startIndex !== -1) {
                            // Get 24 hours
                            const slicedHourly = {};
                            Object.keys(weatherData.hourly).forEach(key => {
                                slicedHourly[key] = weatherData.hourly[key].slice(startIndex, startIndex + 24);
                            });
                            weatherData.hourly = slicedHourly;
                        }

                        // Adjust Daily for AstroWidget (slice so index 0 is the target day)
                        const slicedDaily = {};
                        Object.keys(weatherData.daily).forEach(key => {
                            slicedDaily[key] = weatherData.daily[key].slice(dateIndex);
                        });
                        weatherData.daily = slicedDaily;

                    } else {
                        console.warn("Selected date out of range for forecast");
                        // Could handle showing error state here
                    }
                }

                setCurrentWeather(weatherData);
                setHourlyData(weatherData.hourly);
                // Better approach: Don't mutate res.data daily for the 'dailyData' state used by 7-day list.
                if (targetDate && isHistory) {
                    setDailyData(weatherData.daily);
                } else {
                    setDailyData(weatherData.daily);
                }

                // Pre-fill prediction inputs
                setInputs({
                    temperature: weatherData.temperature,
                    humidity: weatherData.humidity,
                    rainfall: weatherData.rainfall || 0,
                    wind_speed: weatherData.wind_speed || 10
                });

                // Auto-predict
                handlePredictManual(weatherData.temperature, weatherData.humidity, weatherData.rainfall || 0, weatherData.wind_speed || 10);

            } catch (err) {
                console.error("Dashboard Fetch Error:", err.message || err);

                const status = err.response?.status;
                const isRetryable = status === 503 || status === 504 || !err.response;

                if (isRetryable && retryCount < 5) {
                    console.log(`Retrying fetch... (${retryCount + 1}/5)`);
                    setNetworkError(true); // Show connecting status
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 5000);
                } else if (!err.response) {
                    setNetworkError(true);
                }
            }
        };

        fetchWeather();
    }, [location.search, handlePredictManual, retryCount]);

    // Theme Effect
    useEffect(() => {
        if (currentWeather) {
            const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
            const theme = getWeatherTheme(currentWeather.code, isDay);

            document.documentElement.style.setProperty('--bg-gradient-main', theme.background);
            document.documentElement.style.setProperty('--text-main', theme.text);
            document.documentElement.style.setProperty('--glass-bg', theme.glass);
            document.documentElement.style.setProperty('--glass-border', theme.border);
        }
    }, [currentWeather]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
    };



    const handlePredict = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        await handlePredictManual(inputs.temperature, inputs.humidity, inputs.rainfall, inputs.wind_speed);
        setLoading(false);
    };

    // Old download function removed in favor of PDF report


    return (
        <div className="container-fluid mt-5 pt-3">
            {/* Header / Network Status */}
            {networkError && (
                <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning mb-4 fade show">
                    ⚠️ Connecting to Weather Service...
                </div>
            )}

            {/* Main Content Grid */}
            <div className="row g-4">

                {/* Left Column: AI Prediction (TOP) & Hourly Chart (BOTTOM) */}
                <div className="col-lg-8">

                    {/* AI Prediction Studio - MOVED TO TOP */}
                    <div className="section-container p-4 animate-fade-in mb-4" style={{ background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)', border: '1px solid rgba(98, 0, 234, 0.4)' }}>
                        <div className="d-flex align-items-center mb-4">
                            <span className="fs-2 me-2">🤖</span>
                            <div>
                                <h3 className="mb-0 text-white">AI Weather Simulator</h3>
                                {(currentWeather?.city || locationName) && <small className="text-white-50">Simulating for: {currentWeather?.city || locationName}</small>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-5 mb-4 mb-md-0">
                                <form onSubmit={handlePredict}>
                                    {/* Temp - Red/Orange */}
                                    <div className="mb-3">
                                        <label className="small text-uppercase fw-bold text-white">Temperature (°C) <span className="text-danger">●</span></label>
                                        <div className="d-flex gap-2">
                                            <input type="range" className="form-range accent-red" name="temperature" min="-10" max="60" step="0.1" value={inputs.temperature} onChange={handleChange} style={{ accentColor: 'var(--red)' }} />
                                            <input type="number" className="form-control form-control-sm w-25 bg-danger bg-opacity-10 text-white border-danger border-opacity-25" step="0.1" name="temperature" value={inputs.temperature} onChange={handleChange} />
                                        </div>
                                    </div>
                                    {/* Humidity - Blue */}
                                    <div className="mb-3">
                                        <label className="small text-uppercase fw-bold text-white">Humidity (%) <span className="text-primary">●</span></label>
                                        <div className="d-flex gap-2">
                                            <input type="range" className="form-range" name="humidity" min="0" max="100" step="1" value={inputs.humidity} onChange={handleChange} style={{ accentColor: 'var(--blue)' }} />
                                            <input type="number" className="form-control form-control-sm w-25 bg-primary bg-opacity-10 text-white border-primary border-opacity-25" step="1" name="humidity" value={inputs.humidity} onChange={handleChange} />
                                        </div>
                                    </div>
                                    {/* Rain - Cyan/Info */}
                                    <div className="mb-3">
                                        <label className="small text-uppercase fw-bold text-white">Rainfall (mm) <span className="text-info">●</span></label>
                                        <div className="d-flex gap-2">
                                            <input type="range" className="form-range" name="rainfall" min="0" max="200" step="0.5" value={inputs.rainfall} onChange={handleChange} style={{ accentColor: 'var(--cyan)' }} />
                                            <input type="number" className="form-control form-control-sm w-25 bg-info bg-opacity-10 text-white border-info border-opacity-25" step="0.5" name="rainfall" value={inputs.rainfall} onChange={handleChange} />
                                        </div>
                                    </div>
                                    {/* Wind - Green */}
                                    <div className="mb-4">
                                        <label className="small text-uppercase fw-bold text-white">Wind Speed (km/h) <span className="text-success">●</span></label>
                                        <div className="d-flex gap-2">
                                            <input type="range" className="form-range" name="wind_speed" min="0" max="150" step="1" value={inputs.wind_speed} onChange={handleChange} style={{ accentColor: 'var(--green)' }} />
                                            <input type="number" className="form-control form-control-sm w-25 bg-success bg-opacity-10 text-white border-success border-opacity-25" step="1" name="wind_speed" value={inputs.wind_speed} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
                                        {loading ? 'Analyzing...' : 'RUN SIMULATION'}
                                    </button>
                                </form>
                            </div>

                            <div className="col-md-7">
                                <div className="h-100 p-4 rounded-3 d-flex flex-column justify-content-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    {prediction ? (
                                        <>
                                            <h4 className="mb-3 text-center text-white">
                                                Condition: <span className="badge bg-warning text-dark fs-6">{prediction.classification || (prediction.predicted_rainfall > 0 ? 'Rainy' : 'Sunny')}</span>
                                            </h4>

                                            {/* RESTORED SPLIT CARD DESIGN */}
                                            <div className="row w-100 gx-3 mb-3">
                                                <div className="col-6">
                                                    <div className="p-3 border border-white border-opacity-25 rounded text-center shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                                        <h5 className="mb-2 text-warning small text-uppercase fw-bold">Predicted Temp</h5>
                                                        <h2 className="text-white mb-0 fw-bold">{prediction.predicted_temperature}°C</h2>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 border border-white border-opacity-25 rounded text-center shadow-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                                        <h5 className="mb-2 text-info small text-uppercase fw-bold">Predicted Rain</h5>
                                                        <h2 className="text-white mb-0 fw-bold">{prediction.predicted_rainfall} mm</h2>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Simulator Visualization Chart (New) */}
                                            <div style={{ height: '150px', width: '100%', marginBottom: '1rem' }}>
                                                <Chart
                                                    type='bar'
                                                    data={{
                                                        labels: ['Temp (°C)', 'Rain (mm)'],
                                                        datasets: [{
                                                            label: 'Predicted Values',
                                                            data: [prediction.predicted_temperature, prediction.predicted_rainfall],
                                                            backgroundColor: ['rgba(255, 206, 86, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                                                            borderColor: ['rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)'],
                                                            borderWidth: 1
                                                        }]
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        indexAxis: 'y', // Horizontal bars
                                                        plugins: { legend: { display: false } },
                                                        scales: {
                                                            x: {
                                                                grid: { color: 'rgba(255,255,255,0.1)' },
                                                                ticks: { color: 'white' }
                                                            },
                                                            y: {
                                                                grid: { display: false },
                                                                ticks: { color: 'white' }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {prediction.alerts && prediction.alerts.length > 0 && (
                                                <div className="alert alert-danger w-100 small mb-3 border-danger border-opacity-50 text-white bg-danger bg-opacity-25">
                                                    <strong>⚠️ Advisory:</strong> {prediction.alerts.join(', ')}
                                                </div>
                                            )}

                                            <div className="alert alert-info w-100 small mb-3 border-info border-opacity-50 text-white bg-info bg-opacity-25">
                                                <strong>💡 Suggestion:</strong> {(() => {
                                                    const t = prediction.predicted_temperature;
                                                    const r = prediction.predicted_rainfall;
                                                    if (r > 50) return "Heavy rain expected. Avoid travel if possible.";
                                                    if (r > 10) return "Take an umbrella and drive carefully.";
                                                    if (r > 0) return "Light rain likely. Keep a raincoat handy.";
                                                    if (t > 35) return "Extreme heat. Stay hydrated and avoid sun.";
                                                    if (t > 30) return "It's hot outside. Wear light clothing.";
                                                    if (t < 10) return "Cold weather. Dress warmly.";
                                                    if (t < 5) return "Freezing conditions. Protect sensitive plants.";
                                                    return "Conditions are mild. Enjoy your day!";
                                                })()}
                                            </div>

                                            <DownloadReportButton
                                                weatherData={currentWeather}
                                                predictionData={prediction}
                                                hourlyData={hourlyData}
                                                locationName={currentWeather?.city || locationName}
                                            />
                                        </>
                                    ) : (
                                        <div className="text-center text-white-50">
                                            <div className="fs-1 mb-2">🤖</div>
                                            <p className="mb-0">Adjust parameters to simulate.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hourly Chart Section - MOVED TO BOTTOM */}
                    <div className="section-container p-4 animate-fade-in delay-100 mb-4" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)', border: '1px solid rgba(0, 200, 83, 0.4)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-0 text-white">
                                    {currentWeather ? currentWeather.city : 'Loading...'}
                                </h2>
                                <p className="lead mb-0 text-white-50">
                                    {currentWeather?.description} • {currentWeather?.temperature}°C
                                </p>
                            </div>
                            {currentWeather && !currentWeather.city?.includes('Location') && (
                                <div className="badge bg-white bg-opacity-10 px-3 py-2 rounded-pill">
                                    📍 Live Location
                                </div>
                            )}
                        </div>

                        {/* Chart Component */}
                        <HourlyForecast data={hourlyData} />
                    </div>

                </div>

                {/* Right Column: 7-Day Forecast & Astro Details */}
                <div className="col-lg-4">
                    <div className="section-container p-4 animate-fade-in delay-200 mb-4" style={{ background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)', border: '1px solid rgba(255, 145, 0, 0.4)' }}>
                        {/* Daily Forecast Component */}
                        <DailyForecast data={dailyData} locationName={currentWeather?.city || locationName} />
                    </div>

                    {/* New Astro & UV Widget */}
                    <AstroWidget data={currentWeather} />
                </div>

            </div>
        </div>
    );
};

export default WeatherDashboard;
