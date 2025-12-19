export const getWeatherTheme = (conditionCode, isDay = true) => {
    // WMO Weather Codes (Open-Meteo)
    // 0: Clear sky
    // 1-3: Mainly clear, partly cloudy, overcast
    // 45, 48: Fog
    // 51-57: Drizzle
    // 61-67: Rain
    // 71-77: Snow
    // 80-82: Rain showers
    // 95-99: Thunderstorm

    const gradients = {
        // Theme Objects: { background, text, glass, border }
        // STRICT PALETTE: BLUE, GREY, GREEN ONLY. NO PURPLE/RED/ORANGE.

        clearDay: {
            background: 'linear-gradient(135deg, #2980B9 0%, #6DD5FA 100%)', // Classic Blue Sky
            text: '#1a1a1a',
            glass: 'rgba(255, 255, 255, 0.25)',
            border: 'rgba(255, 255, 255, 0.4)'
        },
        clearNight: {
            background: 'linear-gradient(135deg, #00416A 0%, #E4E5E6 0%, #00416A 100%)', // Deep Navy Blue (No Purple)
            background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)', // Royal Night Blue
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.35)',
            border: 'rgba(255, 255, 255, 0.15)'
        },

        cloudyDay: {
            background: 'linear-gradient(135deg, #5D4157 0%, #A8CABA 100%)', // Muted Grey/Green
            background: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)', // Cool Grey
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.2)',
            border: 'rgba(255, 255, 255, 0.2)'
        },
        cloudyNight: {
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', // Dark Grey/Charcoal
            text: '#e0e0e0',
            glass: 'rgba(0, 0, 0, 0.4)',
            border: 'rgba(255, 255, 255, 0.1)'
        },

        rain: {
            background: 'linear-gradient(135deg, #203A43 0%, #2C5364 100%)', // Deep Teal/Blue
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.4)',
            border: 'rgba(255, 255, 255, 0.1)'
        },
        snow: {
            background: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)', // Icy Blue
            text: '#1a1a1a', // Dark text on light ice
            glass: 'rgba(255, 255, 255, 0.3)',
            border: 'rgba(255, 255, 255, 0.4)'
        },

        thunder: {
            background: 'linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%)', // Stormy Grey/Blue (No Purple)
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.4)',
            border: 'rgba(255, 255, 255, 0.15)'
        },
        fog: {
            background: 'linear-gradient(135deg, #525252 0%, #3d72b4 100%)', // Grey to Blue
            text: '#ffffff',
            glass: 'rgba(0, 0, 0, 0.3)',
            border: 'rgba(255, 255, 255, 0.2)'
        },

        // Default
        default: {
            background: 'linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%)', // Light Blue default
            text: '#1a1a1a',
            glass: 'rgba(255, 255, 255, 0.25)',
            border: 'rgba(255, 255, 255, 0.4)'
        }
    };

    if (!conditionCode && conditionCode !== 0) return gradients.clearDay;

    // Mapping logic
    if (conditionCode === 0) return isDay ? gradients.clearDay : gradients.clearNight;
    if (conditionCode >= 1 && conditionCode <= 3) return isDay ? gradients.cloudyDay : gradients.cloudyNight;
    if (conditionCode >= 45 && conditionCode <= 48) return gradients.fog;
    if (conditionCode >= 51 && conditionCode <= 67) return gradients.rain;
    if (conditionCode >= 71 && conditionCode <= 77) return gradients.snow;
    if (conditionCode >= 80 && conditionCode <= 82) return gradients.rain;
    if (conditionCode >= 95) return gradients.thunder;

    return gradients.clearDay; // Default
};
