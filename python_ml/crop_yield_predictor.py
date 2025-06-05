
"""
Crop Yield Prediction Model for Kenyan Agriculture
Supervised Machine Learning Implementation using scikit-learn
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, accuracy_score, r2_score
import joblib
import datetime

class KenyanCropYieldPredictor:
    """
    Supervised ML model for predicting crop yields in Kenya
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.yield_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.disease_model = DecisionTreeClassifier(random_state=42)
        self.is_fitted = False
        
    def prepare_features(self, data):
        """
        Prepare features for ML model
        """
        features = []
        for _, row in data.iterrows():
            planting_date = pd.to_datetime(row['planting_date'])
            harvest_date = pd.to_datetime(row['harvest_date'])
            
            # Extract temporal features
            planting_month = planting_date.month
            planting_day_of_year = planting_date.dayofyear
            growth_period = (harvest_date - planting_date).days
            
            # Weather and soil features
            feature_vector = [
                row['rainfall'],
                row['temperature'],
                row['soil_ph'],
                row['humidity'],
                row['soil_nitrogen'],
                row['soil_phosphorus'],
                row['soil_potassium'],
                planting_month,
                planting_day_of_year,
                growth_period,
                len(row.get('pesticides', [])),
                len(row.get('diseases', []))
            ]
            
            features.append(feature_vector)
            
        return np.array(features)
    
    def train_yield_model(self, training_data):
        """
        Train the crop yield prediction model
        """
        print("Training crop yield prediction model...")
        
        # Prepare features and targets
        X = self.prepare_features(training_data)
        y = training_data['yield'].values
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.yield_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_predictions = self.yield_model.predict(X_train_scaled)
        test_predictions = self.yield_model.predict(X_test_scaled)
        
        train_r2 = r2_score(y_train, train_predictions)
        test_r2 = r2_score(y_test, test_predictions)
        
        print(f"Training R² Score: {train_r2:.4f}")
        print(f"Testing R² Score: {test_r2:.4f}")
        
        # Feature importance
        feature_names = [
            'rainfall', 'temperature', 'soil_ph', 'humidity',
            'soil_nitrogen', 'soil_phosphorus', 'soil_potassium',
            'planting_month', 'planting_day_of_year', 'growth_period',
            'pesticide_count', 'disease_count'
        ]
        
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': self.yield_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nFeature Importance:")
        print(importance_df)
        
        return {
            'train_r2': train_r2,
            'test_r2': test_r2,
            'feature_importance': importance_df
        }
    
    def train_disease_model(self, training_data):
        """
        Train the disease risk classification model
        """
        print("\nTraining disease risk classification model...")
        
        # Prepare disease risk features
        disease_features = []
        disease_labels = []
        
        for _, row in training_data.iterrows():
            # Environmental features for disease prediction
            feature_vector = [
                row['humidity'],
                row['temperature'],
                row['rainfall'],
                row['soil_ph'],
                row.get('soil_moisture', 50)  # Default if not available
            ]
            
            # Classify disease risk based on disease count
            disease_count = len(row.get('diseases', []))
            if disease_count >= 2:
                risk_level = "High Risk"
            elif disease_count == 1:
                risk_level = "Medium Risk"
            else:
                risk_level = "Low Risk"
            
            disease_features.append(feature_vector)
            disease_labels.append(risk_level)
        
        X = np.array(disease_features)
        y = np.array(disease_labels)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model
        self.disease_model.fit(X_train, y_train)
        
        # Evaluate
        train_accuracy = accuracy_score(y_train, self.disease_model.predict(X_train))
        test_accuracy = accuracy_score(y_test, self.disease_model.predict(X_test))
        
        print(f"Disease Model Training Accuracy: {train_accuracy:.4f}")
        print(f"Disease Model Testing Accuracy: {test_accuracy:.4f}")
        
        self.is_fitted = True
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy
        }
    
    def predict_yield(self, crop_data):
        """
        Predict crop yield for given conditions
        """
        if not self.is_fitted:
            raise ValueError("Model must be trained before prediction")
        
        features = self.prepare_features(pd.DataFrame([crop_data]))
        features_scaled = self.scaler.transform(features)
        
        prediction = self.yield_model.predict(features_scaled)[0]
        
        # Get prediction confidence (based on forest variance)
        if hasattr(self.yield_model, 'estimators_'):
            predictions = [tree.predict(features_scaled)[0] for tree in self.yield_model.estimators_]
            confidence = 1.0 / (1.0 + np.std(predictions))
        else:
            confidence = 0.8  # Default confidence
        
        return {
            'predicted_yield': prediction,
            'confidence': min(confidence, 0.99)
        }
    
    def predict_disease_risk(self, environmental_data):
        """
        Predict disease risk based on environmental conditions
        """
        if not self.is_fitted:
            raise ValueError("Model must be trained before prediction")
        
        features = np.array([[
            environmental_data['humidity'],
            environmental_data['temperature'],
            environmental_data['rainfall'],
            environmental_data['soil_ph'],
            environmental_data.get('soil_moisture', 50)
        ]])
        
        risk_prediction = self.disease_model.predict(features)[0]
        risk_probabilities = self.disease_model.predict_proba(features)[0]
        
        # Get class names
        classes = self.disease_model.classes_
        prob_dict = {classes[i]: prob for i, prob in enumerate(risk_probabilities)}
        
        return {
            'risk_level': risk_prediction,
            'probabilities': prob_dict,
            'confidence': max(risk_probabilities)
        }
    
    def save_model(self, filepath):
        """
        Save trained model to disk
        """
        model_data = {
            'scaler': self.scaler,
            'yield_model': self.yield_model,
            'disease_model': self.disease_model,
            'is_fitted': self.is_fitted
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """
        Load trained model from disk
        """
        model_data = joblib.load(filepath)
        self.scaler = model_data['scaler']
        self.yield_model = model_data['yield_model']
        self.disease_model = model_data['disease_model']
        self.is_fitted = model_data['is_fitted']
        print(f"Model loaded from {filepath}")

def generate_sample_kenyan_data(n_samples=1000):
    """
    Generate sample crop data for Kenyan agriculture
    """
    np.random.seed(42)
    
    crops = ['Maize', 'Coffee', 'Tea', 'Beans', 'Potatoes', 'Tomatoes', 'Cassava']
    regions = ['Central', 'Eastern', 'Western', 'Rift Valley', 'Coast', 'Northern', 'Nyanza']
    
    data = []
    
    for i in range(n_samples):
        crop = np.random.choice(crops)
        region = np.random.choice(regions)
        
        # Simulate realistic Kenyan agricultural conditions
        if crop == 'Coffee':
            base_yield = 15
            rainfall = np.random.normal(1200, 200)
            temperature = np.random.normal(20, 3)
        elif crop == 'Maize':
            base_yield = 40
            rainfall = np.random.normal(800, 150)
            temperature = np.random.normal(25, 4)
        elif crop == 'Tea':
            base_yield = 25
            rainfall = np.random.normal(1500, 300)
            temperature = np.random.normal(18, 2)
        else:
            base_yield = 20
            rainfall = np.random.normal(700, 200)
            temperature = np.random.normal(24, 3)
        
        # Environmental factors
        humidity = np.random.normal(70, 15)
        soil_ph = np.random.normal(6.2, 0.8)
        soil_nitrogen = np.random.normal(25, 10)
        soil_phosphorus = np.random.normal(20, 8)
        soil_potassium = np.random.normal(150, 50)
        
        # Generate planting and harvest dates
        planting_month = np.random.randint(1, 13)
        growth_period = np.random.randint(90, 240)
        
        planting_date = datetime.date(2024, planting_month, np.random.randint(1, 28))
        harvest_date = planting_date + datetime.timedelta(days=growth_period)
        
        # Simulate yield based on conditions
        yield_factor = 1.0
        if rainfall < 500: yield_factor *= 0.7
        elif rainfall > 1500: yield_factor *= 0.8
        
        if temperature < 15 or temperature > 35: yield_factor *= 0.6
        
        if soil_ph < 5.5 or soil_ph > 7.5: yield_factor *= 0.8
        
        actual_yield = base_yield * yield_factor * np.random.normal(1.0, 0.2)
        actual_yield = max(actual_yield, 0)  # Ensure non-negative yield
        
        # Simulate diseases based on environmental conditions
        diseases = []
        if humidity > 80 and temperature > 20:
            if np.random.random() < 0.3:
                diseases.append('Fungal infections')
        if rainfall > 1000 and np.random.random() < 0.2:
            diseases.append('Root rot')
        
        pesticides = []
        if len(diseases) > 0:
            pesticides = ['Fungicide', 'Organic spray']
        
        data.append({
            'crop_id': f'crop_{i}',
            'crop_name': crop,
            'region': region,
            'planting_date': planting_date,
            'harvest_date': harvest_date,
            'yield': actual_yield,
            'rainfall': max(rainfall, 0),
            'temperature': temperature,
            'humidity': max(min(humidity, 100), 0),
            'soil_ph': max(min(soil_ph, 9), 4),
            'soil_nitrogen': max(soil_nitrogen, 0),
            'soil_phosphorus': max(soil_phosphorus, 0),
            'soil_potassium': max(soil_potassium, 0),
            'diseases': diseases,
            'pesticides': pesticides
        })
    
    return pd.DataFrame(data)

def main():
    """
    Main function to demonstrate the ML pipeline
    """
    print("Kenyan Agriculture ML Pipeline")
    print("=" * 40)
    
    # Generate sample data
    print("Generating sample Kenyan crop data...")
    df = generate_sample_kenyan_data(1000)
    
    print(f"Generated {len(df)} crop records")
    print(f"Crops: {df['crop_name'].unique()}")
    print(f"Regions: {df['region'].unique()}")
    
    # Initialize and train model
    predictor = KenyanCropYieldPredictor()
    
    # Train models
    yield_results = predictor.train_yield_model(df)
    disease_results = predictor.train_disease_model(df)
    
    # Save model
    predictor.save_model('kenyan_crop_model.joblib')
    
    # Example predictions
    print("\n" + "=" * 40)
    print("EXAMPLE PREDICTIONS")
    print("=" * 40)
    
    # Example yield prediction
    example_crop = {
        'rainfall': 800,
        'temperature': 25,
        'soil_ph': 6.2,
        'humidity': 75,
        'soil_nitrogen': 25,
        'soil_phosphorus': 20,
        'soil_potassium': 150,
        'planting_date': '2024-03-15',
        'harvest_date': '2024-08-15',
        'pesticides': ['Neem oil'],
        'diseases': []
    }
    
    yield_prediction = predictor.predict_yield(example_crop)
    print(f"Predicted Yield: {yield_prediction['predicted_yield']:.2f} tons/hectare")
    print(f"Prediction Confidence: {yield_prediction['confidence']:.2f}")
    
    # Example disease risk prediction
    environmental_conditions = {
        'humidity': 85,
        'temperature': 28,
        'rainfall': 120,
        'soil_ph': 6.0,
        'soil_moisture': 80
    }
    
    disease_prediction = predictor.predict_disease_risk(environmental_conditions)
    print(f"\nDisease Risk Level: {disease_prediction['risk_level']}")
    print(f"Risk Confidence: {disease_prediction['confidence']:.2f}")
    print("Risk Probabilities:")
    for risk_level, prob in disease_prediction['probabilities'].items():
        print(f"  {risk_level}: {prob:.2f}")

if __name__ == "__main__":
    main()
