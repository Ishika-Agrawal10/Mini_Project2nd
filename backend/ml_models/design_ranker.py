"""
ML Design Ranking Model
Uses machine learning to rank designs based on learned preferences
"""

import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os


class DesignRanker:
    """
    Learns to rank designs based on user preferences and project success.
    Uses Gradient Boosting to predict design suitability scores.
    """
    
    def __init__(self):
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def _encode_climate(self, climate):
        climate_map = {'cold': 0, 'moderate': 1, 'hot': 2}
        return climate_map.get(climate, 1)
    
    def _encode_priority(self, priority):
        priority_map = {'energy': 0, 'water': 1, 'materials': 2}
        return priority_map.get(priority, 1)
    
    def _vectorize_design(self, design, constraints):
        """
        Convert design + constraints to feature vector for ranking
        """
        metrics = design.get('metrics', {})
        
        return [
            constraints.get('area', 1000) / 2000.0,
            constraints.get('budget', 50) / 100.0,
            self._encode_climate(constraints.get('climate', 'moderate')),
            self._encode_priority(constraints.get('priority', 'energy')),
            metrics.get('energyEfficiency', 50) / 100.0,
            metrics.get('waterEfficiency', 50) / 100.0,
            1.0 if metrics.get('carbonFootprint') == 'Low' else (
                0.5 if metrics.get('carbonFootprint') == 'Medium' else 0.0
            ),
            metrics.get('estimatedCost', 100000) / 200000.0,
        ]
    
    def train(self, training_data):
        """
        Train ranking model.
        
        Args:
            training_data: List of dicts with:
                - designs: List of design dicts with metrics
                - constraints: Dict of constraints
                - ranking: List of design indices in preference order
                - satisfaction: Overall satisfaction score (0-1)
        """
        if not training_data or len(training_data) == 0:
            return self
        
        X = []
        y = []
        
        for example in training_data:
            designs = example['designs']
            constraints = example['constraints']
            satisfaction = example.get('satisfaction', 0.7)
            
            for design in designs:
                features = self._vectorize_design(design, constraints)
                X.append(features)
                # Score based on satisfaction
                y.append(satisfaction)
        
        X = np.array(X)
        y = np.array(y)
        
        if len(X) > 0:
            self.model.fit(X, y)
            self.is_trained = True
        
        return self
    
    def rank_designs(self, designs, constraints):
        """
        Rank designs by predicted suitability.
        
        Returns:
            List of tuples: (design, score)
        """
        if not self.is_trained:
            # Fallback: return by sustainability index
            return sorted(
                designs,
                key=lambda d: d.get('metrics', {}).get('sustainabilityIndex', 50),
                reverse=True
            )
        
        scored_designs = []
        
        for design in designs:
            try:
                features = np.array([self._vectorize_design(design, constraints)])
                score = self.model.predict(features)[0]
                # Normalize score to 0-100
                score = max(0, min(100, score * 100))
                scored_designs.append((design, score))
            except Exception as e:
                print(f"Ranking error for design {design.get('id')}: {e}")
                scored_designs.append((design, 50))
        
        # Sort by score descending
        return sorted(scored_designs, key=lambda x: x[1], reverse=True)
    
    def save(self, filepath):
        """Save model to disk"""
        if self.is_trained:
            joblib.dump(self.model, filepath)
    
    def load(self, filepath):
        """Load model from disk"""
        if os.path.exists(filepath):
            self.model = joblib.load(filepath)
            self.is_trained = True
            return True
        return False
