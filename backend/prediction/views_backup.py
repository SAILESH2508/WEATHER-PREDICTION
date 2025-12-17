from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pickle
import os
import json
import pickle
import os
import json
import numpy as np
import random
import joblib
import pandas as pd
from django.conf import settings
from keras.models import load_model 

# Load models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

# Global variables for models
model_temp = None
model_rain = None
model_lstm = None
model_classifier = None
scaler = None

# Ensemble Models
rf_temp = None
rf_rain = None
lr_temp = None
lr_rain = None

def load_models():
    global model_temp, model_rain, model_lstm, model_classifier, scaler
    global rf_temp, rf_rain, lr_temp, lr_rain
    try:
        # Load Best Models (Default)
        with open(os.path.join(MODEL_DIR, 'model_temp.pkl'), 'rb') as f:
            model_temp = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'model_rain.pkl'), 'rb') as f:
            model_rain = pickle.load(f)

        # Load Ensemble Components
        with open(os.path.join(MODEL_DIR, 'rf_model_temp.pkl'), 'rb') as f:
            rf_temp = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'rf_model_rain.pkl'), 'rb') as f:
            rf_rain = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'lr_model_temp.pkl'), 'rb') as f:
            lr_temp = pickle.load(f)
        with open(os.path.join(MODEL_DIR, 'lr_model_rain.pkl'), 'rb') as f:
            lr_rain = pickle.load(f)
            
        with open(os.path.join(MODEL_DIR, 'model_classifier.pkl'), 'rb') as f:
            model_classifier = pickle.load(f)
        
        # Load LSTM and Scaler
        lstm_path = os.path.join(MODEL_DIR, 'lstm_model.h5')
        scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
        # Load LSTM and Scaler
        lstm_path = os.path.join(MODEL_DIR, 'lstm_model.h5')
        scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
        
        print(f"Attempting to load LSTM model from: {lstm_path}")
        if os.path.exists(lstm_path):
            model_lstm = load_model(lstm_path)
            print("LSTM Model loaded successfully.")
        else:
            print("LSTM Model file not found.")

        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            print("Scaler loaded successfully.")
            
    except Exception as e:
        print(f"Error loading models: {e}")
        # Initialize to None if loading fails
        model_lstm = None

load_models()

class PredictWeatherView(APIView):
    def post(self, request):
        # Expecting recent weather data to predict next day
        # data: { temperature, humidity, rainfall, wind_speed }
        data = request.data
        try:
            temp = float(data.get('temperature'))
            humidity = float(data.get('humidity'))
            rainfall = float(data.get('rainfall'))
            wind_speed = float(data.get('wind_speed'))
            
            input_data = np.array([[temp, humidity, rainfall, wind_speed]])
            
            if model_temp and model_rain:
                pred_temp = model_temp.predict(input_data)[0]
                pred_rain = model_rain.predict(input_data)[0]
                
                # Alerts
                alerts = []
                if pred_temp > 35:
                    alerts.append("High Temperature Warning")
                if pred_rain > 10:
                    alerts.append("Heavy Rainfall Warning")
                elif pred_rain > 5:
                    alerts.append("Moderate Rainfall Warning")

                return Response({
                    'predicted_temperature': round(pred_temp, 2),
                    'predicted_rainfall': round(pred_rain, 2),
                    'alerts': alerts
                })
            else:
                return Response({'error': 'Models not loaded (Training might be in progress)'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PredictLSTMView(APIView):
    def post(self, request):
        data = request.data
        try:
            # Inputs
            features = [
                float(data.get('temperature')),
                float(data.get('humidity')),
                float(data.get('rainfall')),
                float(data.get('wind_speed'))
            ]
            
            if model_lstm and scaler:
                # Preprocess
                # Scale the input
                input_scaled = scaler.transform([features]) # Shape (1, 4)
                
                # Reshape for LSTM (We need 3 time steps). 
                # For demo, we replicate current state 3 times.
                # Shape required: (1, 3, 4)
                input_seq = np.array([input_scaled[0]] * 3).reshape(1, 3, 4)
                
                pred_temp = model_lstm.predict(input_seq)
                res_val = float(pred_temp[0][0])
                
                return Response({
                    'predicted_temperature': round(res_val, 2),
                    'method': 'LSTM (Deep Learning)'
                })
            else:
                 return Response({'error': 'LSTM Model not loaded'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PredictConditionView(APIView):
    def post(self, request):
        data = request.data
        try:
            features = [[
                float(data.get('temperature')),
                float(data.get('humidity')),
                float(data.get('rainfall')),
                float(data.get('wind_speed'))
            ]]
            
            if model_classifier:
                prediction = model_classifier.predict(features)[0]
                return Response({'condition': prediction})
            else:
                return Response({'error': 'Classifier Model not loaded'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PredictEnsembleView(APIView):
    def post(self, request):
        data = request.data
        try:
            # Prepare features
            features = pd.DataFrame([data])
            # RF/LR expect particular column order from training
            features = features[['temperature', 'humidity', 'rainfall', 'wind_speed']]
            
            # 1. Random Forest Prediction
            rf_t = rf_temp.predict(features)[0]
            rf_r = rf_rain.predict(features)[0]
            
            # 2. Linear Regression Prediction
            lr_t = lr_temp.predict(features)[0]
            lr_r = lr_rain.predict(features)[0]
            
            # 3. LSTM Prediction
            lstm_t, lstm_r = (0, 0)
            if model_lstm and scaler:
                # LSTM needs scaling and sequence (using current as mock sequence)
                # Mock sequence: repeat current 7 times
                input_data = np.array([
                    data['temperature'], data['humidity'], 
                    data['rainfall'], data['wind_speed']
                ]).reshape(1, -1)
                
                scaled_data = scaler.transform(input_data)
                sequence = np.repeat(scaled_data, 7, axis=0).reshape(1, 7, 4)
                
                lstm_pred = model_lstm.predict(sequence)
                lstm_t = float(lstm_pred[0][0])
                # LSTM only predicts Temp in current train_lstm.py, so use RF/LR avg for rain
                lstm_r = (rf_r + lr_r) / 2 
            else:
                # Fallback if LSTM not loaded
                lstm_t = (rf_t + lr_t) / 2
                lstm_r = (rf_r + lr_r) / 2

            # Weighted Average (Ensemble Logic)
            # Weights: LSTM 40%, RF 30%, LR 30%
            ensemble_temp = (0.4 * lstm_t) + (0.3 * rf_t) + (0.3 * lr_t)
            ensemble_rain = (0.3 * rf_r) + (0.3 * lr_r) + (0.4 * lstm_r) # LSTM rain is heuristic here
            
            response = {
                'ensemble_temperature': round(ensemble_temp, 2),
                'ensemble_rainfall': round(ensemble_rain, 2),
                'breakdown': {
                    'Random Forest': {'temp': round(rf_t, 2), 'rain': round(rf_r, 2)},
                    'Linear Regression': {'temp': round(lr_t, 2), 'rain': round(lr_r, 2)},
                    'Deep Learning (LSTM)': {'temp': round(lstm_t, 2), 'rain': round(lstm_r, 2)}
                }
            }
            return Response(response)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CurrentWeatherView(APIView):
    def get(self, request):
        # Mock OpenWeatherMap Response
        # In real app, requests.get(OPENWEATHER_API_URL, params=...)
        city = request.query_params.get('city', 'Unknown')
        
        # Random mock data
        mock_data = {
            'city': city,
            'temperature': round(random.uniform(10, 35), 1),
            'humidity': round(random.uniform(30, 90), 1),
            'rainfall': round(random.uniform(0, 5), 1),
            'wind_speed': round(random.uniform(0, 20), 1),
            'description': 'Partly Cloudy'
        }
        return Response(mock_data)

class MetricsView(APIView):
    def get(self, request):
        try:
            with open(os.path.join(MODEL_DIR, 'metrics.json'), 'r') as f:
                metrics = json.load(f)
            return Response(metrics)
        except Exception as e:
            return Response({'error': 'Metrics not found'}, status=status.HTTP_404_NOT_FOUND)
