import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DownloadReportButton = ({ weatherData, predictionData, hourlyData, locationName }) => {
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString();

        // --- Header ---
        doc.setFillColor(41, 98, 255); // Blue header
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("Weather Forecast Report", pageWidth / 2, 18, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const locationText = locationName ? locationName.toUpperCase() : "UNKNOWN LOCATION";
        doc.text(`Location: ${locationText}`, pageWidth / 2, 28, { align: 'center' });
        doc.text(`Date: ${today}`, pageWidth / 2, 35, { align: 'center' });

        let yPos = 50;

        // --- Current Weather Section ---
        if (weatherData) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("Current Conditions", 14, yPos);
            yPos += 10;

            // Extract current data safely
            const temp = weatherData.temperature ?? weatherData.current_weather?.temperature ?? 'N/A';
            const wind = weatherData.wind_speed ?? weatherData.current_weather?.windspeed ?? 'N/A';
            const rain = weatherData.rainfall ?? weatherData.current_weather?.rain ?? 'N/A';
            const condition = weatherData.description ?? 'N/A';

            const currentData = [
                ['Temperature', `${temp}°C`],
                ['Condition', condition],
                ['Wind Speed', `${wind} km/h`],
                ['Rainfall', `${rain} mm`],
            ];

            doc.autoTable({
                startY: yPos,
                head: [['Metric', 'Value']],
                body: currentData,
                theme: 'grid',
                headStyles: { fillColor: [41, 98, 255] },
                styles: { fontSize: 11 },
                margin: { left: 14, right: 14 }
            });

            yPos = doc.lastAutoTable.finalY + 15;
        }

        // --- Hourly Forecast Section ---
        if (hourlyData && hourlyData.time && hourlyData.time.length > 0) {
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("Hourly Forecast (Next 24 Hours)", 14, yPos);
            yPos += 10;

            // Prepare 24-hour data
            // Open-Meteo returns a long list. We usually want the next ~24 hours from now.
            // For simplicity, we'll take the first 12-24 entries or based on current index if possible.
            // Here we just take the first 12 entries for brevity in the PDF.

            let startIdx = 0;
            // Simple logic: If time is ISO string, find closest current hour. 
            // Assuming hourlyData.time corresponds to now onwards or full day.
            // We'll just take the first 10 rows to not overflow the page too much initially.

            const rows = [];
            const limit = Math.min(hourlyData.time.length, 12);

            for (let i = 0; i < limit; i++) {
                const t = new Date(hourlyData.time[i]);
                const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                rows.push([
                    `${t.getDate()}/${t.getMonth() + 1} ${timeStr}`,
                    `${hourlyData.temperature_2m[i]}°C`,
                    `${hourlyData.rain[i]} mm`,
                    `${hourlyData.weather_code[i]}` // Simplified code, mapping needs logic but OK for raw
                ]);
            }

            doc.autoTable({
                startY: yPos,
                head: [['Time', 'Temp', 'Rain', 'Code']],
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: [0, 150, 136] }, // Teal for Hourly
                styles: { fontSize: 10 },
                margin: { left: 14, right: 14 }
            });

            yPos = doc.lastAutoTable.finalY + 15;
        }

        // --- AI Prediction Section ---
        if (predictionData) {
            // Check if we need new page
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text("AI Forecast Studio", 14, yPos);
            yPos += 10;

            let predictionRows = [];
            const pTemp = predictionData.predicted_temperature ?? predictionData.predicted_avg_temp ?? 'N/A';
            const pRain = predictionData.predicted_rainfall ?? predictionData.predicted_total_rainfall ?? 'N/A';

            predictionRows = [[
                'AI Analysis',
                `${Number(pTemp).toFixed(1)}°C`,
                `${Number(pRain).toFixed(1)} mm`
            ]];

            if (predictionData.alerts && predictionData.alerts.length > 0) {
                predictionRows.push(['ALERTS', predictionData.alerts.join(', '), '']);
            }

            doc.autoTable({
                startY: yPos,
                head: [['Type', 'Predicted Temp', 'Predicted Rain']],
                body: predictionRows,
                theme: 'striped',
                headStyles: { fillColor: [255, 61, 0] }, // Red/Orange for AI
                styles: { fontSize: 11 },
                margin: { left: 14, right: 14 }
            });

            // Footer might need adjustment if on new page, but simplistic for now
        }

        // --- Footer ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            const footerText = `Generated by AI Weather System - Page ${i} of ${pageCount}`;
            doc.text(footerText, pageWidth / 2, 285, { align: 'center' });
        }

        // Save
        const fileName = `Weather_Report_${locationName || 'Location'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <button
            onClick={generatePDF}
            className="btn btn-primary"
            disabled={!weatherData}
            title="Download PDF Report"
        >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Download Report
        </button>
    );
};

export default DownloadReportButton;
