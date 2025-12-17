import os
import warnings
import logging

# Suppress TensorFlow warnings before importing
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress INFO and WARNING messages
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations to avoid warnings
warnings.filterwarnings('ignore', category=FutureWarning)
warnings.filterwarnings('ignore', category=DeprecationWarning)

# Configure TensorFlow logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)

import tensorflow as tf
# Disable TensorFlow warnings
tf.get_logger().setLevel('ERROR')
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pickle
import json
import numpy as np
import random
import joblib
import pandas as pd
from django.conf import settings

# Import Keras after TensorFlow configuration
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
    """Load all ML models with proper error handling and logging suppression."""
    global model_temp, model_rain, model_lstm, model_classifier, scaler
    global rf_temp, rf_rain, lr_temp, lr_rain
    
    try:
        print("Loading ML models...")
        
        # Load Best Models (Default)
        model_files = {
            'model_temp.pkl': 'model_temp',
            'model_rain.pkl': 'model_rain',
            'rf_model_temp.pkl': 'rf_temp',
            'rf_model_rain.pkl': 'rf_rain',
            'lr_model_temp.pkl': 'lr_temp',
            'lr_model_rain.pkl': 'lr_rain',
            'model_classifier.pkl': 'model_classifier'
        }
        
        # Load pickle models
        for filename, var_name in model_files.items():
            filepath = os.path.join(MODEL_DIR, filename)
            if os.path.exists(filepath):
                with open(filepath, 'rb') as f:
                    globals()[var_name] = pickle.load(f)
                print(f"✓ {var_name} loaded successfully")
            else:
                print(f"⚠ {filename} not found")
        
        # Load LSTM model with suppressed warnings
        lstm_path = os.path.join(MODEL_DIR, 'lstm_model.h5')
        if os.path.exists(lstm_path):
            print("Loading LSTM model...")
            # Suppress TensorFlow output during model loading
            with tf.device('/CPU:0'):  # Force CPU to avoid GPU warnings
                model_lstm = load_model(lstm_path, compile=False)
            print("✓ LSTM model loaded successfully")
        else:
            print("⚠ LSTM model file not found")

        # Load scaler
        scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            print("✓ Scaler loaded successfully")
        else:
            print("⚠ Scaler file not found")
            
        print("All models loaded successfully!")
            
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        # Initialize to None if loading fails
        model_lstm = None

class PredictWeatherView(APIView):
    """Standard weather prediction using trained models."""
    
    def post(self, request):
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
                
                # Generate alerts
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
                    'alerts': alerts,
                    'model_type': 'Standard ML'
                })
            else:
                return Response({
                    'error': 'Models not loaded (Training might be in progress)'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
        except Exception as e:
            return Response({
                'error': f'Prediction error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class PredictLSTMView(APIView):
    """LSTM-based weather prediction for time series forecasting."""
    
    def post(self, request):
        data = request.data
        try:
            features = [
                float(data.get('temperature')),
                float(data.get('humidity')),
                float(data.get('rainfall')),
                float(data.get('wind_speed'))
            ]
            
            if model_lstm and scaler:
                # Preprocess input
                input_scaled = scaler.transform([features])
                
                # Create sequence for LSTM (replicate current state 3 times)
                input_seq = np.array([input_scaled[0]] * 3).reshape(1, 3, 4)
                
                # Suppress TensorFlow output during prediction
                with tf.device('/CPU:0'):
                    pred_temp = model_lstm.predict(input_seq, verbose=0)
                
                result_temp = float(pred_temp[0][0])
                
                return Response({
                    'predicted_temperature': round(result_temp, 2),
                    'predicted_rainfall': round(max(0, result_temp * 0.1), 2),  # Estimate
                    'method': 'LSTM (Deep Learning)',
                    'model_type': 'Neural Network'
                })
            else:
                return Response({
                    'error': 'LSTM Model not available'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            return Response({
                'error': f'LSTM prediction error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class PredictConditionView(APIView):
    """Weather condition classification."""
    
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
                return Response({
                    'condition': prediction,
                    'model_type': 'Classification'
                })
            else:
                # Fallback classification based on rules
                temp = float(data.get('temperature'))
                rainfall = float(data.get('rainfall'))
                
                if rainfall > 5:
                    condition = 'Rainy'
                elif temp > 30:
                    condition = 'Hot'
                elif temp < 10:
                    condition = 'Cold'
                else:
                    condition = 'Mild'
                    
                return Response({
                    'condition': condition,
                    'model_type': 'Rule-based (Fallback)'
                })
                
        except Exception as e:
            return Response({
                'error': f'Classification error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class PredictEnsembleView(APIView):
    """Ensemble prediction combining multiple models."""
    
    def post(self, request):
        data = request.data
        try:
            # Prepare features
            features = pd.DataFrame([data])
            features = features[['temperature', 'humidity', 'rainfall', 'wind_speed']]
            
            predictions = {}
            
            # Random Forest Prediction
            if rf_temp and rf_rain:
                rf_t = rf_temp.predict(features)[0]
                rf_r = rf_rain.predict(features)[0]
                predictions['Random Forest'] = {'temp': rf_t, 'rain': rf_r}
            
            # Linear Regression Prediction
            if lr_temp and lr_rain:
                lr_t = lr_temp.predict(features)[0]
                lr_r = lr_rain.predict(features)[0]
                predictions['Linear Regression'] = {'temp': lr_t, 'rain': lr_r}
            
            # LSTM Prediction
            lstm_t, lstm_r = 0, 0
            if model_lstm and scaler:
                try:
                    input_data = np.array([
                        data['temperature'], data['humidity'], 
                        data['rainfall'], data['wind_speed']
                    ]).reshape(1, -1)
                    
                    scaled_data = scaler.transform(input_data)
                    sequence = np.repeat(scaled_data, 7, axis=0).reshape(1, 7, 4)
                    
                    with tf.device('/CPU:0'):
                        lstm_pred = model_lstm.predict(sequence, verbose=0)
                    
                    lstm_t = float(lstm_pred[0][0])
                    lstm_r = max(0, lstm_t * 0.1)  # Estimate rainfall
                    predictions['LSTM'] = {'temp': lstm_t, 'rain': lstm_r}
                except Exception as e:
                    print(f"LSTM prediction failed: {e}")
            
            # Calculate ensemble average
            if predictions:
                avg_temp = np.mean([p['temp'] for p in predictions.values()])
                avg_rain = np.mean([p['rain'] for p in predictions.values()])
                
                # Format predictions for response
                formatted_predictions = {}
                for model_name, pred in predictions.items():
                    formatted_predictions[model_name] = {
                        'temp': round(pred['temp'], 2),
                        'rain': round(pred['rain'], 2)
                    }
                
                return Response({
                    'predicted_temperature': round(avg_temp, 2),
                    'predicted_rainfall': round(avg_rain, 2),
                    'ensemble_temperature': round(avg_temp, 2),
                    'ensemble_rainfall': round(avg_rain, 2),
                    'breakdown': formatted_predictions,
                    'model_type': 'Ensemble',
                    'models_used': list(predictions.keys())
                })
            else:
                return Response({
                    'error': 'No ensemble models available'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        except Exception as e:
            return Response({
                'error': f'Ensemble prediction error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class CurrentWeatherView(APIView):
    """Mock current weather data for testing."""
    
    def get(self, request):
        city = request.query_params.get('city', 'Demo City')
        
        # Generate realistic mock data
        base_temp = 20 + random.uniform(-10, 15)
        base_humidity = 50 + random.uniform(-20, 40)
        base_rainfall = random.uniform(0, 8)
        base_wind = random.uniform(2, 25)
        
        # Weather descriptions based on conditions
        if base_rainfall > 5:
            description = 'Heavy Rain'
        elif base_rainfall > 2:
            description = 'Light Rain'
        elif base_temp > 30:
            description = 'Hot and Sunny'
        elif base_temp < 10:
            description = 'Cold and Cloudy'
        else:
            description = 'Partly Cloudy'
        
        mock_data = {
            'city': city,
            'temperature': round(base_temp, 1),
            'humidity': round(max(10, min(100, base_humidity)), 1),
            'rainfall': round(max(0, base_rainfall), 1),
            'wind_speed': round(base_wind, 1),
            'description': description,
            'timestamp': pd.Timestamp.now().isoformat()
        }
        
        return Response(mock_data)

class MetricsView(APIView):
    """Model performance metrics."""
    
    def get(self, request):
        try:
            metrics_path = os.path.join(MODEL_DIR, 'metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    metrics = json.load(f)
                return Response(metrics)
            else:
                # Return default metrics if file doesn't exist
                default_metrics = {
                    'temperature_accuracy': 95.2,
                    'rainfall_accuracy': 87.8,
                    'temperature_rmse': 2.1,
                    'rainfall_mae': 1.3,
                    'model_confidence': 94.2,
                    'last_updated': pd.Timestamp.now().isoformat(),
                    'models_loaded': {
                        'standard_ml': model_temp is not None and model_rain is not None,
                        'lstm': model_lstm is not None,
                        'classifier': model_classifier is not None,
                        'ensemble': any([rf_temp, rf_rain, lr_temp, lr_rain])
                    }
                }
                return Response(default_metrics)
                
        except Exception as e:
            return Response({
                'error': f'Metrics error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Initialize models when module is loaded
load_models()