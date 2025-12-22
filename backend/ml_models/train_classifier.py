import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_classifier():
    # Load Data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'weather_data.csv')
    
    if not os.path.exists(data_path):
        print("Data file not found.")
        return

    df = pd.read_csv(data_path)
    
    # Feature Engineering: Create 'Condition' label
    # Rules:
    # Rain > 0 -> Rainy
    # Cloud > 50 (we stick to humidity as proxy if cloud not avail) -> Cloudy
    # Else -> Sunny
    
    def derive_condition(row):
        if row['rainfall'] > 0:
            return 'Rainy'
        elif row['humidity'] > 70:
            return 'Cloudy'
        else:
            return 'Sunny'
            
    df['condition'] = df.apply(derive_condition, axis=1)
    
    X = df[['temperature', 'humidity', 'rainfall', 'wind_speed']]
    y = df['condition']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Classifier Accuracy: {acc:.4f}")
    
    # Save
    save_dir = os.path.join(base_dir, 'ml_models')
    os.makedirs(save_dir, exist_ok=True)
    
    with open(os.path.join(save_dir, 'model_classifier.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    print("Classifier Model saved.")

if __name__ == '__main__':
    train_classifier()
