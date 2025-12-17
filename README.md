# 🌍 AI-Powered Weather Prediction System

![React](https://img.shields.io/badge/Frontend-React-blue) ![Django](https://img.shields.io/badge/Backend-Django-green) ![ML](https://img.shields.io/badge/AI-Machine%20Learning-orange)

An advanced meteorological forecasting application that leverages machine learning algorithms to predict weather interactively. Built with a modern **Dark Glass** UI for a premium user experience.

## ✨ Features

- **🤖 AI Forecast Studio**: Real-time prediction of Temperature and Rainfall using Custom Algorithms.
- **🔮 Ensemble Learning**: Combines Random Forest, Linear Regression, and LSTM Deep Learning models for consensus-based accuracy.
- **🧪 AI Simulator**: "What-If" scenario testing—adjust humidity, wind, and pressure to see how the model reacts.
- **📊 Advanced Analytics**: Interactive dashboards showing Feature Importance, Correlation Matrices, and Model accuracy.
- **🎨 Modern UI**: Fully responsive, "Dark Glass" glassmorphism design with smooth animations.
- **🌍 Global Coverage**: Integrated with Open-Meteo for real-time live weather data worldwide.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Fast, component-based architecture.
- **Bootstrap 5**: Responsive layout and styling.
- **Chart.js**: Dynamic data visualization.
- **Axios**: API communication.

### Backend
- **Django REST Framework**: Robust API for serving ML predictions.
- **Python**: Core logic and data processing.

### Machine Learning
- **Scikit-Learn**: Random Forest & Linear Regression.
- **TensorFlow/Keras**: LSTM (Long Short-Term Memory) networks.
- **Pandas & NumPy**: Data manipulation.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Model Training (Optional)
The pre-trained models are included, but to retrain:
```bash
python ml_models/train_model.py
```

## 📄 License
This project is for educational and portfolio purposes.

---
© 2024 AI Weather System. Built with ❤️ and ☕.
