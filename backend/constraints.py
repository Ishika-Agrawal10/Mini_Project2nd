"""
Constraint Modeling Engine
Processes and validates user constraints, applies feasibility rules
"""


class ConstraintEngine:
    """
    Manages constraint validation and logical processing.
    Enforces real-world feasibility rules for sustainable design.
    """
    
    def __init__(self):
        self.AREA_MIN = 300
        self.AREA_MAX = 2000
        self.BUDGET_MIN = 0
        self.BUDGET_MAX = 100
        self.VALID_CLIMATES = ['cold', 'moderate', 'hot']
        self.VALID_PRIORITIES = ['energy', 'water', 'materials']
    
    def validate(self, constraints):
        """
        Validate constraint values against bounds
        
        Returns:
            (is_valid: bool, errors: list)
        """
        errors = []
        
        # Validate area
        if 'area' not in constraints:
            errors.append('Area is required')
        elif not isinstance(constraints['area'], int):
            errors.append('Area must be an integer')
        elif constraints['area'] < self.AREA_MIN or constraints['area'] > self.AREA_MAX:
            errors.append(f'Area must be between {self.AREA_MIN} and {self.AREA_MAX} sq ft')
        
        # Validate budget
        if 'budget' not in constraints:
            errors.append('Budget is required')
        elif not isinstance(constraints['budget'], (int, float)):
            errors.append('Budget must be a number')
        elif constraints['budget'] < self.BUDGET_MIN or constraints['budget'] > self.BUDGET_MAX:
            errors.append(f'Budget must be between {self.BUDGET_MIN} and {self.BUDGET_MAX}%')
        
        # Validate climate
        if 'climate' not in constraints:
            errors.append('Climate is required')
        elif constraints['climate'] not in self.VALID_CLIMATES:
            errors.append(f'Climate must be one of: {", ".join(self.VALID_CLIMATES)}')
        
        # Validate priority
        if 'priority' not in constraints:
            errors.append('Priority is required')
        elif constraints['priority'] not in self.VALID_PRIORITIES:
            errors.append(f'Priority must be one of: {", ".join(self.VALID_PRIORITIES)}')
        
        return len(errors) == 0, errors
    
    def process(self, constraints):
        """
        Apply logic rules to constraints
        Returns processed constraints with additional derived values
        """
        processed = dict(constraints)
        
        # Derive feasibility modifiers based on constraints
        processed['area_category'] = self._categorize_area(constraints['area'])
        processed['budget_category'] = self._categorize_budget(constraints['budget'])
        processed['climate_strategies'] = self._get_climate_strategies(constraints['climate'])
        processed['priority_weight'] = self._get_priority_weight(constraints['priority'])
        
        return processed
    
    def _categorize_area(self, area):
        """Categorize area into small/medium/large"""
        if area < 700:
            return 'small'
        elif area < 1300:
            return 'medium'
        else:
            return 'large'
    
    def _categorize_budget(self, budget):
        """Categorize budget into low/medium/high"""
        if budget < 33:
            return 'low'
        elif budget < 67:
            return 'medium'
        else:
            return 'high'
    
    def _get_climate_strategies(self, climate):
        """Get design strategies for climate type"""
        strategies = {
            'cold': ['thermal-insulation', 'passive-solar-gain', 'heat-recovery'],
            'moderate': ['natural-ventilation', 'passive-cooling', 'thermal-mass'],
            'hot': ['thermal-mass', 'passive-cooling', 'shading', 'evaporative-cooling']
        }
        return strategies.get(climate, [])
    
    def _get_priority_weight(self, priority):
        """Get weight multiplier for priority"""
        weights = {
            'energy': 1.3,
            'water': 1.3,
            'materials': 1.2
        }
        return weights.get(priority, 1.0)
    
    def calculate_feasibility(self, processed_constraints):
        """
        Calculate feasibility score based on constraints
        Returns score 0-100
        """
        score = 100
        
        # Budget constraints affect feasibility
        budget = processed_constraints['budget']
        if budget < 30:
            score -= 20  # Low budget reduces feasibility
        
        # Area size affects feasibility
        area = processed_constraints['area']
        if area < 500 or area > 1800:
            score -= 10  # Very small or very large reduces feasibility
        
        return max(0, min(100, score))
