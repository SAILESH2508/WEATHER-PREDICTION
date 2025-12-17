import pandas as pd
import numpy as np
import os
import joblib
import json
import math
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def create_sequences(data, seq_length):
    X = []
    y = []
    for i in range(len(data) - seq_length):
        X.append(data[i:(i + seq_length)])
        y.append(data[i + seq_length])
    return np.array(X), np.array(y)

def train_lstm():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'weather_data.csv')
    save_dir = os.path.join(base_dir, 'ml_models')
    os.makedirs(save_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print("Data file not found.")
        return

    df = pd.read_csv(data_path)
    
    # We will predict 'temperature' based on past [temperature, humidity, rainfall, wind_speed]
    features = ['temperature', 'humidity', 'rainfall', 'wind_speed']
    target = 'temperature' 
    
    data = df[features].values
    
    # Scaling is crucial for LSTM
    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)
    
    # Save scaler for inference
    joblib.dump(scaler, os.path.join(save_dir, 'scaler.pkl'))
    
    # Create sequences
    SEQ_LENGTH = 3 # Look back 3 days (since our mock data is small)
    X, y = create_sequences(data_scaled, SEQ_LENGTH)
    
    # y needs to be just the target column (temperature is index 0)
    y = y[:, 0]

    # Split
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    # Build LSTM Model
    model = Sequential([
        LSTM(50, activation='relu', input_shape=(SEQ_LENGTH, len(features)), return_sequences=True),
        Dropout(0.2),
        LSTM(50, activation='relu'),
        Dropout(0.2),
        Dense(1) # Predict temperature
    ])
    
    model.compile(optimizer='adam', loss='mse')
    
    print("Training LSTM...")
    history = model.fit(X_train, y_train, epochs=50, batch_size=4, validation_data=(X_test, y_test), verbose=1)
    
    # Evaluate
    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    print(f"LSTM Temperature R2 Score: {r2:.4f}")
    
    # Save Model
    model.save(os.path.join(save_dir, 'lstm_model.h5'))
    
    # Update metrics.json
    metrics_path = os.path.join(save_dir, 'metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
    else:
        metrics = {"model_performance": {}}
        
    # Handle NaN
    if math.isnan(r2):
        r2 = 0.0
        
    metrics['model_performance']['LSTM (Temp)'] = r2
    
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f)
        
    print("LSTM Model saved.")

if __name__ == '__main__':
    train_lstm()
