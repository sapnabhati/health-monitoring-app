import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

def train_dummy_model():
    """
    Since actual Kaggle datasets need to be downloaded manually, we generate
    some synthetic dummy data to train an initial model so the endpoints work.
    """
    print("Training synthetic model for mental health risk prediction...")
    
    # Synthetic dataset mimicking vitals
    # Features: Heart Rate, Sleep Quality (1-10), Activity Level (steps), Work Hours
    # Target: Stress Risk Label (Low, Moderate, High)
    data = {
        'heart_rate': [65, 85, 95, 70, 60, 100, 88, 72, 68, 92],
        'sleep_quality': [8, 4, 3, 7, 9, 2, 5, 8, 9, 4],
        'activity_level': [8000, 2000, 1500, 7500, 10000, 1000, 3000, 8500, 9000, 2500],
        'work_hours': [8, 12, 14, 8, 7, 15, 11, 8, 7, 12],
        'stress_risk': ['Low', 'High', 'High', 'Low', 'Low', 'High', 'Moderate', 'Low', 'Low', 'Moderate']
    }
    
    df = pd.DataFrame(data)
    
    # Features & Target
    X = df.drop('stress_risk', axis=1)
    y = df['stress_risk']
    
    # Train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save
    model_path = os.path.join(MODELS_DIR, "stress_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
def get_model():
    model_path = os.path.join(MODELS_DIR, "stress_model.pkl")
    if not os.path.exists(model_path):
        train_dummy_model()
    return joblib.load(model_path)

if __name__ == "__main__":
    train_dummy_model()
    print("WARNING: Place your downloaded Kaggle CSVs into the 'backend/data' folder to train custom models.")
