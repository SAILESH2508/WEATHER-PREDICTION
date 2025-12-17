import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const AnalysisDashboard = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/metrics/');
                setMetrics(response.data);
            } catch (err) {
                console.error("Failed to fetch metrics", err);
            }
        };
        fetchMetrics();
    }, []);

    if (!metrics) return <div className="text-center mt-5">Loading Analytics...</div>;

    // Feature Importance Chart Data (Temperature Model)
    const featureLabels = metrics.feature_importance ? Object.keys(metrics.feature_importance.temperature_model) : [];
    const featureValues = metrics.feature_importance ? Object.values(metrics.feature_importance.temperature_model) : [];

    const featureImportanceData = {
        labels: featureLabels,
        datasets: [
            {
                label: 'Feature Importance (Temp Model)',
                data: featureValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-dark text-white">Feature Importance</div>
                    <div className="card-body">
                        {featureLabels.length > 0 ? (
                            <Bar data={featureImportanceData} options={{
                                indexAxis: 'y',
                                responsive: true,
                                scales: {
                                    x: {
                                        ticks: { color: 'white' },
                                        grid: { color: 'rgba(255,255,255,0.1)' }
                                    },
                                    y: {
                                        ticks: { color: 'white' },
                                        grid: { color: 'rgba(255,255,255,0.1)' }
                                    }
                                },
                                plugins: {
                                    legend: { labels: { color: 'white' } }
                                }
                            }} />
                        ) : (
                            <p>Feature importance data not available (requires Random Forest).</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">Correlation Matrix</div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        {Object.keys(metrics.correlation).map(key => <th key={key}>{key}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(metrics.correlation).map(([rowKey, rowData]) => (
                                        <tr key={rowKey}>
                                            <th>{rowKey}</th>
                                            {Object.values(rowData).map((val, idx) => (
                                                <td key={idx} style={{ backgroundColor: `rgba(0, 123, 255, ${Math.abs(val)})`, color: Math.abs(val) > 0.5 ? 'white' : 'black' }}>
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDashboard;
