"""
ML Cost Prediction Model
Uses Random Forest to predict project costs based on constraints and design
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os


class CostPredictor:
    """
    Predicts project costs using machine learning.
    Learns from historical project data and adapts to new constraints.
    """
    
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            'area', 'budget', 'climate_encoded', 
            'priority_encoded', 'design_id'
        ]
    
    def _encode_climate(self, climate):
        """Encode climate as numeric value"""
        climate_map = {'cold': 0, 'moderate': 1, 'hot': 2}
        return climate_map.get(climate, 1)
    
    def _encode_priority(self, priority):
        """Encode priority as numeric value"""
        priority_map = {'energy': 0, 'water': 1, 'materials': 2}
        return priority_map.get(priority, 1)
    
    def _vectorize_project(self, area, budget, climate, priority, design_id):
        """Convert project parameters to feature vector"""
        return [
            area / 2000.0,  # Normalize area
            budget / 100.0,  # Normalize budget
            self._encode_climate(climate),
            self._encode_priority(priority),
            design_id
        ]
    
    def train(self, historical_data):
        """
        Train the cost prediction model.
        
        Args:
            historical_data: List of dicts with keys:
                - area, budget, climate, priority, design_id
                - actual_cost (target)
        
        Returns:
            self for chaining
        """
        if not historical_data or len(historical_data) == 0:
            return self
        
        X = []
        y = []
        
        for project in historical_data:
            features = self._vectorize_project(
                project['area'],
                project['budget'],
                project['climate'],
                project['priority'],
                project.get('design_id', 0)
            )
            X.append(features)
            y.append(project['actual_cost'])
        
        X = np.array(X)
        y = np.array(y)
        
        # Train model
        self.model.fit(X, y)
        self.is_trained = True
        
        return self
    
    def predict(self, area, budget, climate, priority, design_id):
        """
        Predict cost for given project parameters.
        
        Args:
            area: Project area in sq ft
            budget: Budget level (0-100)
            climate: Climate type (cold, moderate, hot)
            priority: Sustainability priority (energy, water, materials)
            design_id: Design index (0, 1, or 2)
        
        Returns:
            Predicted cost as float, or None if not trained
        """
        if not self.is_trained:
            return None
        
        features = np.array([self._vectorize_project(
            area, budget, climate, priority, design_id
        )])
        
        try:
            prediction = self.model.predict(features)[0]
            # Ensure prediction is reasonable (1000 - 500000)
            return max(10000, min(500000, prediction))
        except Exception as e:
            print(f"Prediction error: {e}")
            return None
    
    def get_feature_importance(self):
        """Get importance of each feature in cost prediction"""
        if not self.is_trained:
            return {}
        
        importance = dict(zip(
            self.feature_names,
            self.model.feature_importances_
        ))
        
        # Sort by importance
        return dict(sorted(
            importance.items(),
            key=lambda x: x[1],
            reverse=True
        ))
    
    def save(self, filepath):
        """Save trained model to disk"""
        if self.is_trained:
            joblib.dump(self.model, filepath)
    
    def load(self, filepath):
        """Load trained model from disk"""
        if os.path.exists(filepath):
            self.model = joblib.load(filepath)
            self.is_trained = True
            return True
        return False
