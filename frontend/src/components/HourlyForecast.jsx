import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HourlyForecast = ({ data }) => {
    if (!data || !data.time || !data.temperature_2m) return null;

    // Filter next 24 hours only
    const next24Hours = data.time.slice(0, 24).map(t => new Date(t).getHours() + ':00');
    const temps = data.temperature_2m.slice(0, 24);
    const rain = data.rain ? data.rain.slice(0, 24) : new Array(24).fill(0);

    const chartData = {
        labels: next24Hours,
        datasets: [
            {
                type: 'line',
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointRadius: 3,
                yAxisID: 'y',
            },
            {
                type: 'bar',
                label: 'Rainfall (mm)',
                data: rain,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y1',
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { color: 'white' }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                title: { display: true, text: 'Temp (°C)', color: 'white' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                ticks: { color: 'rgba(54, 162, 235, 0.8)' },
                title: { display: true, text: 'Rain (mm)', color: '#36A2EB' },
                min: 0,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="glass-card h-100 d-flex flex-column">
            <h5 className="mb-2 text-white">
                <span className="me-2">📉</span> 24-Hour Trend
            </h5>
            <div className="flex-grow-1 w-100" style={{ minHeight: '200px' }}>
                <Chart type='bar' data={chartData} options={options} />
            </div>
        </div>
    );
};

export default HourlyForecast;
