import pandas as pd
import numpy as np
import pickle
import pandas as pd
import numpy as np
import pickle
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def train():
    # Load data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'weather_data.csv')
    
    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    
    # Simple feature engineering/selection
    # Features: temperature, humidity, rainfall, wind_speed (previous day/current conditions to predict next)
    # For this mock data, we are predicting 'label_temp' and 'label_rain' based on current conditions
    X = df[['temperature', 'humidity', 'rainfall', 'wind_speed']]
    y_temp = df['label_temp']
    y_rain = df['label_rain']

    X_train, X_test, y_temp_train, y_temp_test, y_rain_train, y_rain_test = train_test_split(
        X, y_temp, y_rain, test_size=0.2, random_state=42
    )

    models = {
        'Linear Regression': {
            'temp': LinearRegression(),
            'rain': LinearRegression()
        },
        'Random Forest': {
            'temp': RandomForestRegressor(n_estimators=100, random_state=42),
            'rain': RandomForestRegressor(n_estimators=100, random_state=42)
        }
    }

    results = {}

    best_model_name = None
    best_score = -float('inf')

    print("Training Models...")
    
    for name, model_pair in models.items():
        # Train Temperature Model
        model_pair['temp'].fit(X_train, y_temp_train)
        temp_preds = model_pair['temp'].predict(X_test)
        temp_r2 = r2_score(y_temp_test, temp_preds)
        
        # Train Rain Model
        model_pair['rain'].fit(X_train, y_rain_train)
        rain_preds = model_pair['rain'].predict(X_test)
        rain_r2 = r2_score(y_rain_test, rain_preds)
        
        avg_score = (temp_r2 + rain_r2) / 2
        results[name] = avg_score
        
        print(f"{name} - Temp R2: {temp_r2:.4f}, Rain R2: {rain_r2:.4f}, Avg: {avg_score:.4f}")

        if avg_score > best_score:
            best_score = avg_score
            best_model_name = name

    print(f"\nBest Model: {best_model_name}")
    
    # Feature Importance (only for Random Forest, but we can try generic or just use the RF one for insights)
    # We will use the Random Forest model for feature importance regardless of which was "best" for consistency in analysis,
    # or use the best one if it has that attribute. Linear Regression has coefficients.
    
    feature_importance = {}
    if 'Random Forest' in models:
        rf = models['Random Forest']['temp'] # Use temp model for general importance or do both
        importances = rf.feature_importances_
        feature_importance['temperature_model'] = dict(zip(X.columns, importances))
        
        rf_rain = models['Random Forest']['rain']
        importances_rain = rf_rain.feature_importances_
        feature_importance['rainfall_model'] = dict(zip(X.columns, importances_rain))
        
    # Correlation Matrix
    # Convert to standard python types for JSON serialization
    corr_matrix = df[['temperature', 'humidity', 'rainfall', 'wind_speed', 'label_temp', 'label_rain']].corr().round(2)
    corr_data = corr_matrix.to_dict()

    final_metrics = {
        "model_performance": results,
        "feature_importance": feature_importance,
        "correlation": corr_data
    }

    # Save all models for Ensemble
    save_dir = os.path.join(base_dir, 'ml_models')
    os.makedirs(save_dir, exist_ok=True)
    
    # Save Random Forest
    with open(os.path.join(save_dir, 'rf_model_temp.pkl'), 'wb') as f:
        pickle.dump(models['Random Forest']['temp'], f)
    with open(os.path.join(save_dir, 'rf_model_rain.pkl'), 'wb') as f:
        pickle.dump(models['Random Forest']['rain'], f)
        
    # Save Linear Regression
    with open(os.path.join(save_dir, 'lr_model_temp.pkl'), 'wb') as f:
        pickle.dump(models['Linear Regression']['temp'], f)
    with open(os.path.join(save_dir, 'lr_model_rain.pkl'), 'wb') as f:
        pickle.dump(models['Linear Regression']['rain'], f)

    # Maintain backward compatibility for "Best Model" (used by standard view)
    best_temp_model = models[best_model_name]['temp']
    best_rain_model = models[best_model_name]['rain']
    
    with open(os.path.join(save_dir, 'model_temp.pkl'), 'wb') as f:
        pickle.dump(best_temp_model, f)
    with open(os.path.join(save_dir, 'model_rain.pkl'), 'wb') as f:
        pickle.dump(best_rain_model, f)

    # Save metrics
    with open(os.path.join(save_dir, 'metrics.json'), 'w') as f:
        json.dump(final_metrics, f)

    print("Models and metrics saved successfully.")

if __name__ == '__main__':
    train()
