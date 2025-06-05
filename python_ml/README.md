
# Kenyan Agriculture Machine Learning Models

This directory contains Python implementations of machine learning models for Kenyan agriculture, specifically designed for crop yield prediction and plant disease detection.

## Overview

The project includes two main components:

1. **Crop Yield Predictor** (`crop_yield_predictor.py`) - Supervised ML model for predicting crop yields
2. **Disease Detection** (`disease_detection.py`) - Computer vision model for plant disease identification

## Features

### Crop Yield Predictor
- **Supervised Learning**: Uses Random Forest and Linear Regression
- **Feature Engineering**: Incorporates weather, soil, and temporal features
- **Disease Risk Assessment**: Classifies disease risk levels
- **Kenyan Context**: Optimized for local crops (Maize, Coffee, Tea, Beans, etc.)

### Disease Detection
- **Deep Learning**: CNN with transfer learning (MobileNetV2)
- **Computer Vision**: Image-based disease identification
- **Treatment Recommendations**: Provides actionable treatment advice
- **Multiple Diseases**: Supports common plant diseases in Kenya

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. For GPU support (optional but recommended):
```bash
pip install tensorflow-gpu
```

## Usage

### Training Crop Yield Model

```python
from crop_yield_predictor import KenyanCropYieldPredictor, generate_sample_kenyan_data

# Generate or load training data
df = generate_sample_kenyan_data(1000)

# Initialize and train model
predictor = KenyanCropYieldPredictor()
predictor.train_yield_model(df)
predictor.train_disease_model(df)

# Save trained model
predictor.save_model('kenyan_crop_model.joblib')
```

### Making Predictions

```python
# Predict crop yield
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
```

### Training Disease Detection Model

```python
from disease_detection import PlantDiseaseDetector

# Initialize detector
detector = PlantDiseaseDetector(img_size=(224, 224))

# Create datasets from directory
train_ds, val_ds = detector.create_dataset_from_directory('path/to/dataset')

# Build and train model
model = detector.build_transfer_learning_model()
history = detector.train_model(train_ds, val_ds, epochs=50)

# Save model
detector.save_model('plant_disease_model.h5')
```

### Disease Detection

```python
# Detect disease from image
predictions = detector.predict_disease('path/to/plant_image.jpg')

# Generate treatment report
treatment_report = detector.generate_treatment_report('path/to/plant_image.jpg')
print(treatment_report)
```

## Data Structure

### For Crop Yield Prediction
- **Features**: Rainfall, temperature, soil pH, planting dates, etc.
- **Target**: Crop yield in tons/hectare
- **Format**: CSV or pandas DataFrame

### For Disease Detection
- **Directory Structure**:
```
plant_disease_dataset/
├── healthy/
│   ├── image_001.jpg
│   └── ...
├── early_blight/
│   ├── image_001.jpg
│   └── ...
└── late_blight/
    ├── image_001.jpg
    └── ...
```

## Model Performance

### Crop Yield Predictor
- **Algorithm**: Random Forest Regressor
- **Features**: 12 environmental and temporal features
- **Evaluation**: R² score, feature importance analysis

### Disease Detection
- **Architecture**: MobileNetV2 + Custom layers
- **Input**: 224x224 RGB images
- **Output**: Disease classification + confidence scores
- **Augmentation**: Rotation, flip, zoom for robustness

## Integration with Web Application

These Python models can be integrated with the TypeScript web application through:

1. **REST API**: Deploy models using Flask/FastAPI
2. **Model Conversion**: Convert to TensorFlow.js for browser execution
3. **Microservices**: Deploy as containerized services

## Kenyan Agriculture Context

The models are specifically designed for:
- **Local Crops**: Maize, coffee, tea, beans, potatoes, cassava
- **Climate Conditions**: Tropical and subtropical regions
- **Seasonal Patterns**: Two main growing seasons
- **Common Diseases**: Early blight, late blight, bacterial infections
- **Soil Types**: Various soil conditions across Kenya's regions

## Contributing

To improve the models:
1. Add more training data specific to Kenyan crops
2. Include additional environmental factors
3. Expand disease categories
4. Improve feature engineering
5. Optimize model hyperparameters

## License

This project is designed for educational and agricultural development purposes in Kenya.

## Contact

For questions about implementation or agricultural extension:
- Local agricultural extension officers
- Kenya Agricultural and Livestock Research Organization (KALRO)
- University of Nairobi - Department of Agriculture
