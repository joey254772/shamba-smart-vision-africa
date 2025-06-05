
"""
Plant Disease Detection using Computer Vision
Deep Learning Implementation for Kenyan Crops
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import cv2
import os
from PIL import Image
import json
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

class PlantDiseaseDetector:
    """
    Deep learning model for plant disease detection
    """
    
    def __init__(self, img_size=(224, 224), num_classes=None):
        self.img_size = img_size
        self.num_classes = num_classes
        self.model = None
        self.class_names = []
        self.is_trained = False
        
        # Disease information for Kenyan crops
        self.disease_info = {
            'healthy': {
                'description': 'Plant appears healthy with no visible disease symptoms',
                'treatment': ['Continue regular care', 'Monitor for changes', 'Maintain good agricultural practices'],
                'severity': 'None'
            },
            'early_blight': {
                'description': 'Fungal disease causing dark spots with concentric rings on leaves',
                'treatment': [
                    'Apply copper-based fungicide',
                    'Improve air circulation around plants',
                    'Remove affected leaves and dispose properly',
                    'Use drip irrigation to avoid leaf wetness'
                ],
                'severity': 'Moderate'
            },
            'late_blight': {
                'description': 'Serious fungal disease causing water-soaked lesions',
                'treatment': [
                    'Apply systemic fungicide immediately',
                    'Destroy infected plants if severely affected',
                    'Avoid overhead watering',
                    'Apply preventive copper sprays in high humidity'
                ],
                'severity': 'High'
            },
            'bacterial_spot': {
                'description': 'Bacterial infection causing small, dark spots on leaves and fruits',
                'treatment': [
                    'Apply copper-based bactericide',
                    'Remove infected plant debris',
                    'Improve drainage and air circulation',
                    'Use resistant varieties when possible'
                ],
                'severity': 'Moderate'
            },
            'mosaic_virus': {
                'description': 'Viral disease causing mottled, mosaic-like patterns on leaves',
                'treatment': [
                    'Remove and destroy infected plants',
                    'Control aphid vectors',
                    'Use virus-resistant varieties',
                    'Maintain good field hygiene'
                ],
                'severity': 'High'
            },
            'leaf_mold': {
                'description': 'Fungal disease causing yellow spots that turn brown',
                'treatment': [
                    'Improve ventilation in greenhouse',
                    'Apply fungicide spray',
                    'Reduce humidity levels',
                    'Space plants for better air circulation'
                ],
                'severity': 'Low'
            }
        }
    
    def build_model(self):
        """
        Build CNN model for disease detection
        """
        model = keras.Sequential([
            # Data augmentation layer
            layers.RandomFlip("horizontal_and_vertical"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(0.2),
            
            # Base CNN layers
            layers.Conv2D(32, 3, activation='relu', input_shape=self.img_size + (3,)),
            layers.MaxPooling2D(),
            layers.Conv2D(64, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(128, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(256, 3, activation='relu'),
            layers.MaxPooling2D(),
            
            # Global average pooling
            layers.GlobalAveragePooling2D(),
            
            # Dense layers
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def build_transfer_learning_model(self):
        """
        Build model using transfer learning with MobileNetV2
        """
        # Load pre-trained MobileNetV2
        base_model = keras.applications.MobileNetV2(
            input_shape=self.img_size + (3,),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model
        base_model.trainable = False
        
        # Add custom top layers
        model = keras.Sequential([
            layers.RandomFlip("horizontal_and_vertical"),
            layers.RandomRotation(0.2),
            layers.RandomZoom(0.2),
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def preprocess_image(self, image_path):
        """
        Preprocess image for model input
        """
        if isinstance(image_path, str):
            img = cv2.imread(image_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            img = np.array(image_path)
        
        # Resize image
        img = cv2.resize(img, self.img_size)
        
        # Normalize pixel values
        img = img.astype(np.float32) / 255.0
        
        return img
    
    def create_dataset_from_directory(self, data_dir, validation_split=0.2):
        """
        Create training and validation datasets from directory structure
        """
        # Get class names from directory structure
        self.class_names = sorted([d for d in os.listdir(data_dir) 
                                 if os.path.isdir(os.path.join(data_dir, d))])
        self.num_classes = len(self.class_names)
        
        # Create datasets
        train_ds = keras.utils.image_dataset_from_directory(
            data_dir,
            validation_split=validation_split,
            subset="training",
            seed=123,
            image_size=self.img_size,
            batch_size=32
        )
        
        val_ds = keras.utils.image_dataset_from_directory(
            data_dir,
            validation_split=validation_split,
            subset="validation",
            seed=123,
            image_size=self.img_size,
            batch_size=32
        )
        
        # Normalize pixel values
        normalization_layer = layers.Rescaling(1./255)
        train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
        val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))
        
        return train_ds, val_ds
    
    def train_model(self, train_dataset, val_dataset, epochs=50):
        """
        Train the disease detection model
        """
        if self.model is None:
            raise ValueError("Model must be built before training")
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=10,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=5,
                min_lr=1e-7
            ),
            keras.callbacks.ModelCheckpoint(
                'best_disease_model.h5',
                monitor='val_accuracy',
                save_best_only=True
            )
        ]
        
        # Train model
        history = self.model.fit(
            train_dataset,
            validation_data=val_dataset,
            epochs=epochs,
            callbacks=callbacks
        )
        
        self.is_trained = True
        return history
    
    def predict_disease(self, image_path, top_k=3):
        """
        Predict disease from image
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        # Preprocess image
        img = self.preprocess_image(image_path)
        img_array = np.expand_dims(img, axis=0)
        
        # Make prediction
        predictions = self.model.predict(img_array)[0]
        
        # Get top-k predictions
        top_indices = np.argsort(predictions)[::-1][:top_k]
        
        results = []
        for i, idx in enumerate(top_indices):
            disease_name = self.class_names[idx]
            confidence = predictions[idx]
            
            # Get disease information
            disease_info = self.disease_info.get(disease_name, {
                'description': 'Unknown disease',
                'treatment': ['Consult agricultural expert'],
                'severity': 'Unknown'
            })
            
            results.append({
                'rank': i + 1,
                'disease': disease_name,
                'confidence': float(confidence),
                'description': disease_info['description'],
                'treatment': disease_info['treatment'],
                'severity': disease_info['severity']
            })
        
        return results
    
    def evaluate_model(self, test_dataset):
        """
        Evaluate model performance
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")
        
        # Get predictions and true labels
        y_pred = []
        y_true = []
        
        for images, labels in test_dataset:
            predictions = self.model.predict(images)
            y_pred.extend(np.argmax(predictions, axis=1))
            y_true.extend(np.argmax(labels, axis=1))
        
        # Generate classification report
        report = classification_report(
            y_true, y_pred, 
            target_names=self.class_names,
            output_dict=True
        )
        
        # Generate confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        
        return {
            'classification_report': report,
            'confusion_matrix': cm,
            'accuracy': report['accuracy']
        }
    
    def save_model(self, filepath):
        """
        Save trained model
        """
        if self.model is None:
            raise ValueError("No model to save")
        
        # Save model
        self.model.save(filepath)
        
        # Save class names and metadata
        metadata = {
            'class_names': self.class_names,
            'img_size': self.img_size,
            'num_classes': self.num_classes,
            'disease_info': self.disease_info
        }
        
        with open(filepath.replace('.h5', '_metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """
        Load trained model
        """
        # Load model
        self.model = keras.models.load_model(filepath)
        
        # Load metadata
        metadata_path = filepath.replace('.h5', '_metadata.json')
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            self.class_names = metadata['class_names']
            self.img_size = tuple(metadata['img_size'])
            self.num_classes = metadata['num_classes']
            self.disease_info = metadata['disease_info']
        
        self.is_trained = True
        print(f"Model loaded from {filepath}")
    
    def generate_treatment_report(self, image_path):
        """
        Generate comprehensive treatment report for detected disease
        """
        predictions = self.predict_disease(image_path, top_k=1)
        
        if not predictions:
            return None
        
        primary_prediction = predictions[0]
        
        report = {
            'image_analysis': {
                'detected_disease': primary_prediction['disease'],
                'confidence': primary_prediction['confidence'],
                'severity': primary_prediction['severity']
            },
            'disease_description': primary_prediction['description'],
            'immediate_actions': primary_prediction['treatment'],
            'prevention_measures': [
                'Maintain proper plant spacing for air circulation',
                'Use drip irrigation instead of overhead watering',
                'Remove plant debris regularly',
                'Monitor plants weekly for early detection',
                'Apply preventive fungicides during high-risk periods'
            ],
            'follow_up': [
                'Monitor treated plants for 1-2 weeks',
                'Reapply treatment if symptoms persist',
                'Consult local agricultural extension if no improvement',
                'Consider resistant varieties for next planting'
            ],
            'risk_assessment': {
                'spread_risk': 'High' if primary_prediction['confidence'] > 0.8 else 'Medium',
                'crop_loss_potential': primary_prediction['severity'],
                'optimal_treatment_window': '24-48 hours for best results'
            }
        }
        
        return report

def create_sample_training_data():
    """
    Create sample directory structure for training data
    """
    diseases = ['healthy', 'early_blight', 'late_blight', 'bacterial_spot', 'mosaic_virus', 'leaf_mold']
    
    print("Sample directory structure for training data:")
    print("plant_disease_dataset/")
    for disease in diseases:
        print(f"  ├── {disease}/")
        print(f"  │   ├── image_001.jpg")
        print(f"  │   ├── image_002.jpg")
        print(f"  │   └── ...")
    
    print("\nTo use this model:")
    print("1. Organize your images in the above directory structure")
    print("2. Each folder should contain images of that specific disease/condition")
    print("3. Ensure images are clear and focused on affected plant parts")
    print("4. Include diverse examples (different lighting, angles, severity levels)")

def main():
    """
    Main function to demonstrate the disease detection pipeline
    """
    print("Plant Disease Detection System for Kenyan Agriculture")
    print("=" * 55)
    
    # Initialize detector
    detector = PlantDiseaseDetector(img_size=(224, 224))
    
    # Show sample directory structure
    create_sample_training_data()
    
    print("\n" + "=" * 55)
    print("MODEL ARCHITECTURE")
    print("=" * 55)
    
    # Build model (example with 6 classes)
    detector.num_classes = 6
    detector.class_names = ['healthy', 'early_blight', 'late_blight', 'bacterial_spot', 'mosaic_virus', 'leaf_mold']
    
    model = detector.build_transfer_learning_model()
    model.summary()
    
    print("\n" + "=" * 55)
    print("TRAINING INSTRUCTIONS")
    print("=" * 55)
    
    print("""
To train this model:

1. Prepare your dataset:
   - Collect images of healthy and diseased plants
   - Organize in folders by disease type
   - Ensure balanced dataset (similar number of images per class)

2. Train the model:
   train_ds, val_ds = detector.create_dataset_from_directory('path/to/dataset')
   history = detector.train_model(train_ds, val_ds, epochs=50)

3. Save the trained model:
   detector.save_model('plant_disease_model.h5')

4. Use for prediction:
   predictions = detector.predict_disease('path/to/test_image.jpg')
   treatment_report = detector.generate_treatment_report('path/to/test_image.jpg')
""")

if __name__ == "__main__":
    main()
