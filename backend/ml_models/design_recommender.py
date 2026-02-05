"""
Design Recommendation Engine
Uses similarity matching to find and recommend designs from similar past projects
"""

import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler


class DesignRecommender:
    """
    Recommends designs based on similar historical projects.
    Uses K-Nearest Neighbors to find projects with similar constraints.
    """
    
    def __init__(self, n_neighbors=5):
        self.knn = NearestNeighbors(n_neighbors=n_neighbors, metric='euclidean')
        self.scaler = StandardScaler()
        self.is_trained = False
        self.historical_projects = []
    
    def _encode_climate(self, climate):
        climate_map = {'cold': 0, 'moderate': 1, 'hot': 2}
        return climate_map.get(climate, 1)
    
    def _encode_priority(self, priority):
        priority_map = {'energy': 0, 'water': 1, 'materials': 2}
        return priority_map.get(priority, 1)
    
    def _vectorize_constraints(self, constraints):
        """Convert constraints to feature vector"""
        return np.array([
            [
                constraints.get('area', 1000) / 2000.0,
                constraints.get('budget', 50) / 100.0,
                self._encode_climate(constraints.get('climate', 'moderate')) / 2.0,
                self._encode_priority(constraints.get('priority', 'energy')) / 2.0,
            ]
        ])
    
    def learn_from_history(self, historical_projects):
        """
        Learn from past projects.
        
        Args:
            historical_projects: List of dicts with:
                - constraints: {'area', 'budget', 'climate', 'priority'}
                - chosen_design: design index (0, 1, or 2)
                - satisfaction: 0-1 satisfaction score
        """
        if not historical_projects or len(historical_projects) == 0:
            return self
        
        self.historical_projects = historical_projects
        
        # Vectorize all historical projects
        X = np.array([self._vectorize_constraints(p['constraints'])[0] 
                      for p in historical_projects])
        
        # Train KNN
        self.knn.fit(X)
        self.is_trained = True
        
        return self
    
    def recommend_design(self, constraints, top_n=3):
        """
        Recommend best design based on similar historical projects.
        
        Returns:
            Dict with:
                - recommended_design: design index (0, 1, 2)
                - confidence: confidence score (0-1)
                - similar_projects: list of similar project info
        """
        if not self.is_trained or len(self.historical_projects) == 0:
            return {
                'recommended_design': None,
                'confidence': 0.0,
                'similar_projects': []
            }
        
        # Find similar projects
        query = self._vectorize_constraints(constraints)
        distances, indices = self.knn.kneighbors(query)
        
        # Aggregate recommendations from similar projects
        design_scores = {}
        similar_projects = []
        
        for idx, distance in zip(indices[0], distances[0]):
            project = self.historical_projects[idx]
            design_id = project.get('chosen_design', 0)
            satisfaction = project.get('satisfaction', 0.7)
            
            # Weight by similarity (inverse distance) and satisfaction
            weight = satisfaction / (1.0 + distance)
            design_scores[design_id] = design_scores.get(design_id, 0) + weight
            
            similar_projects.append({
                'constraints': project['constraints'],
                'chosen_design': design_id,
                'satisfaction': satisfaction,
                'similarity': 1.0 / (1.0 + distance)
            })
        
        if not design_scores:
            return {
                'recommended_design': None,
                'confidence': 0.0,
                'similar_projects': []
            }
        
        # Get best recommendation
        best_design = max(design_scores, key=design_scores.get)
        total_score = sum(design_scores.values())
        confidence = design_scores[best_design] / total_score
        
        return {
            'recommended_design': best_design,
            'confidence': min(1.0, confidence),
            'similar_projects': similar_projects[:top_n]
        }
    
    def get_design_statistics(self):
        """Get statistics about which designs were chosen in history"""
        if not self.historical_projects:
            return {}
        
        stats = {0: 0, 1: 0, 2: 0}
        avg_satisfaction = {0: [], 1: [], 2: []}
        
        for project in self.historical_projects:
            design_id = project.get('chosen_design', 0)
            satisfaction = project.get('satisfaction', 0.7)
            
            stats[design_id] = stats.get(design_id, 0) + 1
            avg_satisfaction[design_id].append(satisfaction)
        
        # Calculate averages
        for design_id in stats:
            if avg_satisfaction[design_id]:
                avg_satisfaction[design_id] = np.mean(avg_satisfaction[design_id])
            else:
                avg_satisfaction[design_id] = 0.0
        
        return {
            'counts': stats,
            'average_satisfaction': avg_satisfaction
        }
