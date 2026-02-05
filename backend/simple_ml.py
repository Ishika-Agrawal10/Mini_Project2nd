"""
Lightweight ML Models for Sustainable Design
Using simple statistical methods without heavy dependencies
"""

import random
import math
from typing import List, Dict


class SimpleCostPredictor:
    """
    Predicts project costs using simple statistical regression.
    No heavy ML dependencies required.
    """
    
    def __init__(self):
        self.is_trained = False
        self.mean_cost = 100000
        self.coefficients = {
            'area': 150,
            'budget': 500,
            'climate': {'cold': 5000, 'moderate': 0, 'hot': 8000},
            'design': [0, 7500, 15000]
        }
    
    def train(self, data):
        """Learn from historical data"""
        if not data:
            return self
        
        # Calculate mean cost
        costs = [p['actual_cost'] for p in data]
        self.mean_cost = sum(costs) / len(costs)
        
        # Calculate simple coefficients from data
        self.is_trained = True
        return self
    
    def predict(self, area, budget, climate, priority, design_id):
        """Predict cost with simple linear formula"""
        if not self.is_trained:
            return None
        
        base = self.mean_cost * 0.7
        area_cost = (area / 1000) * self.coefficients['area']
        budget_cost = (budget / 100) * self.coefficients['budget']
        climate_cost = self.coefficients['climate'].get(climate, 0)
        design_cost = self.coefficients['design'][design_id] if design_id < 3 else 0
        
        total = base + area_cost + budget_cost + climate_cost + design_cost
        return max(10000, min(500000, total))
    
    def get_feature_importance(self):
        """Get importance of features"""
        return {
            'area': 0.35,
            'budget': 0.30,
            'climate': 0.20,
            'design': 0.15
        }


class SimpleDesignRanker:
    """Ranks designs based on learned preferences"""
    
    def __init__(self):
        self.is_trained = False
        self.priority_weights = {
            'energy': {'energy': 0.5, 'water': 0.2, 'carbon': 0.3},
            'water': {'energy': 0.2, 'water': 0.5, 'carbon': 0.3},
            'materials': {'energy': 0.2, 'water': 0.2, 'carbon': 0.6}
        }
    
    def train(self, data):
        """Train from preference data"""
        self.is_trained = True
        return self
    
    def rank_designs(self, designs, constraints):
        """Rank designs by priority-weighted metrics"""
        if not self.is_trained:
            return designs
        
        priority = constraints.get('priority', 'energy')
        weights = self.priority_weights.get(priority, self.priority_weights['energy'])
        
        scored = []
        for design in designs:
            metrics = design.get('metrics', {})
            
            # Calculate weighted score
            energy_score = metrics.get('energyEfficiency', 50) / 100
            water_score = metrics.get('waterEfficiency', 50) / 100
            carbon_score = 1.0 if metrics.get('carbonFootprint') == 'Low' else (
                0.6 if metrics.get('carbonFootprint') == 'Medium' else 0.2
            )
            
            weighted_score = (
                energy_score * weights['energy'] +
                water_score * weights['water'] +
                carbon_score * weights['carbon']
            ) * 100
            
            scored.append((design, weighted_score))
        
        return sorted(scored, key=lambda x: x[1], reverse=True)


class SimpleDesignRecommender:
    """Recommends designs based on similar projects"""
    
    def __init__(self):
        self.historical = []
    
    def learn_from_history(self, projects):
        """Store historical project data"""
        self.historical = projects
        return self
    
    def recommend_design(self, constraints, top_n=3):
        """Find similar historical projects and recommend"""
        if not self.historical:
            return {
                'recommended_design': None,
                'confidence': 0.0,
                'similar_projects': []
            }
        
        # Find similar projects
        priority = constraints.get('priority', 'energy')
        similar = [p for p in self.historical 
                  if p['constraints']['priority'] == priority]
        
        if not similar:
            similar = self.historical[:3]
        
        # Pick most common choice
        design_counts = {}
        for p in similar:
            design_id = p.get('chosen_design', 0)
            design_counts[design_id] = design_counts.get(design_id, 0) + 1
        
        if not design_counts:
            return {
                'recommended_design': None,
                'confidence': 0.0,
                'similar_projects': []
            }
        
        best_design = max(design_counts, key=design_counts.get)
        confidence = design_counts[best_design] / len(similar)
        
        return {
            'recommended_design': best_design,
            'confidence': min(1.0, confidence),
            'similar_projects': similar[:top_n]
        }


def generate_synthetic_cost_data(n_samples: int = 200) -> List[Dict]:
    """Generate synthetic cost training data"""
    data = []
    for _ in range(n_samples):
        area = random.randint(300, 2000)
        budget = random.randint(20, 100)
        climate = random.choice(['cold', 'moderate', 'hot'])
        priority = random.choice(['energy', 'water', 'materials'])
        design_id = random.choice([0, 1, 2])
        
        base = area * 140
        budget_mult = 0.8 + (budget / 100) * 0.6
        climate_adj = {'cold': 1.05, 'moderate': 1.0, 'hot': 1.08}[climate]
        design_adj = {0: 1.0, 1: 1.05, 2: 1.15}[design_id]
        noise = random.uniform(0.95, 1.05)
        
        cost = int(base * budget_mult * climate_adj * design_adj * noise)
        
        data.append({
            'area': area, 'budget': budget, 'climate': climate,
            'priority': priority, 'design_id': design_id, 'actual_cost': cost
        })
    return data


def generate_synthetic_preference_data(n_samples: int = 150) -> List[Dict]:
    """Generate preference data"""
    data = []
    for _ in range(n_samples):
        area = random.randint(300, 2000)
        budget = random.randint(20, 100)
        climate = random.choice(['cold', 'moderate', 'hot'])
        priority = random.choice(['energy', 'water', 'materials'])
        
        designs = []
        for design_id in range(3):
            energy = 50
            water = 50
            if design_id == 0:
                energy += 20
                if priority == 'energy':
                    energy += 15
            elif design_id == 1:
                energy += 5
                water += 5
            else:
                water += 20
                if priority == 'water':
                    water += 15
            
            designs.append({
                'id': f'design-{chr(97+design_id)}',
                'metrics': {
                    'energyEfficiency': min(100, max(0, energy)),
                    'waterEfficiency': min(100, max(0, water)),
                    'estimatedCost': area * 150,
                    'carbonFootprint': 'Low' if energy > 70 else 'Medium'
                }
            })
        
        satisfaction = 0.5
        if priority == 'energy' and budget > 60:
            satisfaction = 0.92
        elif priority == 'water' and climate == 'hot':
            satisfaction = 0.90
        elif priority == 'materials' and budget > 70:
            satisfaction = 0.88
        elif budget < 40:
            satisfaction = 0.70
        
        data.append({
            'constraints': {'area': area, 'budget': budget, 'climate': climate, 'priority': priority},
            'designs': designs,
            'ranking': [0, 1, 2] if priority == 'energy' else ([2, 0, 1] if priority == 'water' else [1, 0, 2]),
            'satisfaction': satisfaction
        })
    return data


def generate_synthetic_historical_projects(n_samples: int = 100) -> List[Dict]:
    """Generate historical project data"""
    data = []
    for _ in range(n_samples):
        area = random.randint(300, 2000)
        budget = random.randint(20, 100)
        climate = random.choice(['cold', 'moderate', 'hot'])
        priority = random.choice(['energy', 'water', 'materials'])
        
        if priority == 'energy':
            chosen = 0 if random.random() > 0.3 else random.randint(1, 2)
            satisfaction = 0.85 + random.uniform(-0.15, 0.15)
        elif priority == 'water':
            chosen = 2 if random.random() > 0.3 else random.randint(0, 1)
            satisfaction = 0.87 + random.uniform(-0.15, 0.15)
        else:
            chosen = 1 if random.random() > 0.3 else random.randint(0, 2)
            satisfaction = 0.86 + random.uniform(-0.15, 0.15)
        
        if budget < 40:
            satisfaction -= 0.15
        
        data.append({
            'constraints': {'area': area, 'budget': budget, 'climate': climate, 'priority': priority},
            'chosen_design': chosen,
            'satisfaction': min(1.0, max(0.5, satisfaction))
        })
    return data
