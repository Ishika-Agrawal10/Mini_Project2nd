"""
Sustainability Evaluation Module
Calculates sustainability metrics and impact scores
"""


class SustainabilityEvaluator:
    """
    Evaluates design alternatives using sustainability metrics.
    Calculates energy efficiency, water efficiency, and carbon footprint.
    Provides ranking and comparative analysis.
    """
    
    def __init__(self):
        self.energy_weights = {
            'budget': 0.25,
            'area': 0.20,
            'climate': 0.30,
            'materials': 0.25
        }
    
    def evaluate(self, design, constraints):
        """
        Comprehensive evaluation of design sustainability
        
        Args:
            design: Design object from generator
            constraints: User constraints
        
        Returns:
            Dict with energy, water, and carbon metrics
        """
        area = constraints['area']
        budget = constraints['budget']
        climate = constraints['climate']
        priority = constraints['priority']
        
        # Calculate individual metrics
        energy_score = self._evaluate_energy(design, constraints)
        water_score = self._evaluate_water(design, constraints)
        materials_score = self._evaluate_materials(design, constraints)
        carbon_level = self._evaluate_carbon(design, constraints)
        
        # Calculate sustainability index
        sustainability_index = self._calculate_sustainability_index(
            energy_score, water_score, materials_score, priority
        )
        
        # Estimate cost
        estimated_cost = self._estimate_cost(area, budget)
        
        return {
            'energyEfficiency': energy_score,
            'waterEfficiency': water_score,
            'materialsEfficiency': materials_score,
            'carbonFootprint': carbon_level,
            'sustainabilityIndex': sustainability_index,
            'estimatedCost': estimated_cost,
            'payback_period_years': self._estimate_payback(energy_score, budget),
            'lifecycle_analysis': {
                'embodied': design.get('estimated_embodied_carbon', 0),
                'operational': self._estimate_operational_carbon(area, energy_score)
            }
        }
    
    def _evaluate_energy(self, design, constraints):
        """
        Calculate energy efficiency score (0-100)
        Based on design characteristics and constraints
        """
        area = constraints['area']
        budget = constraints['budget']
        climate = constraints['climate']
        priority = constraints['priority']
        
        # Base score
        score = 50
        
        # Budget influence
        if budget >= 75:
            score += 20
        elif budget >= 50:
            score += 10
        
        # Priority influence - STRONG for energy focus
        if priority == 'energy':
            score += 25
        
        # Climate adjustments
        if climate == 'cold':
            score += 5
        elif climate == 'hot':
            score -= 5
        
        # Area efficiency (smaller or medium sized better)
        if area < 800:
            score += 8
        elif area > 1600:
            score -= 5
        
        # Design-specific factors
        if design.get('id') == 'design-a':
            score += 15
        elif design.get('id') == 'design-c':
            score += 8
        elif design.get('id') == 'design-b':
            score += 6

        if 'renewable_ready' in design and design['renewable_ready']:
            score += 4
        
        # Ensure score is within bounds
        return max(0, min(100, score))
    
    def _evaluate_water(self, design, constraints):
        """
        Calculate water efficiency score (0-100)
        Based on water management strategies
        """
        area = constraints['area']
        budget = constraints['budget']
        climate = constraints['climate']
        priority = constraints['priority']
        
        # Base score
        score = 50
        
        # Priority influence - STRONG for water focus
        if priority == 'water':
            score += 30
        
        # Budget influence
        if budget >= 60:
            score += 15
        elif budget < 30:
            score -= 10
        
        # Climate influence (hot climates need more water efficiency)
        if climate == 'hot':
            score += 20
        elif climate == 'moderate':
            score += 10
        
        # Area influence (larger areas benefit from systems)
        if area > 1200:
            score += 8

        # Design-specific boosts (make water-focused design stand out)
        if design.get('id') == 'design-c':
            score += 22
        elif design.get('id') == 'design-a':
            score += 5
        elif design.get('id') == 'design-b':
            score += 8
        
        # Ensure score is within bounds
        return max(0, min(100, score))
    
    def _evaluate_carbon(self, design, constraints):
        """
        Calculate carbon footprint level (Low/Medium/High)
        Simplified categorical assessment
        """
        energy_efficiency = self._evaluate_energy(design, constraints)
        budget = constraints['budget']
        
        embodied_carbon = design.get('estimated_embodied_carbon', 25)
        
        # Combined assessment
        if energy_efficiency > 75 and budget > 60 and embodied_carbon < 18:
            return 'Low'
        elif energy_efficiency > 55 or budget > 50:
            return 'Medium'
        else:
            return 'High'
    
    def _calculate_sustainability_index(self, energy, water, materials, priority):
        """
        Calculate overall sustainability index (0-100)
        Weighted heavily by priority to ensure clear differentiation
        """
        if priority == 'energy':
            # Energy-focused: HEAVY weight on energy (60%), others less
            index = (energy * 0.60) + (water * 0.25) + (materials * 0.15)
        elif priority == 'water':
            # Water-focused: HEAVY weight on water (60%), others less
            index = (water * 0.60) + (energy * 0.25) + (materials * 0.15)
        elif priority == 'materials':
            # Materials-focused: HEAVY weight on materials (60%), others less
            index = (materials * 0.60) + (energy * 0.25) + (water * 0.15)
        else:
            # Default to energy
            index = (energy * 0.60) + (water * 0.25) + (materials * 0.15)
        
        return round(index)

    def _evaluate_materials(self, design, constraints):
        """
        Calculate materials sustainability score (0-100)
        Based on design type, budget, and priority
        """
        budget = constraints['budget']
        priority = constraints['priority']

        # Base score
        score = 50

        # Design-specific boosts - STRONG for carbon-optimized
        if design.get('id') == 'design-b':
            # Carbon-optimized is materials-forward
            score += 25
        elif design.get('id') == 'design-c':
            # Regenerative uses advanced materials
            score += 15
        elif design.get('id') == 'design-a':
            # Eco-efficient uses high-performance envelope
            score += 10

        # Priority influence - STRONG for materials focus
        if priority == 'materials':
            score += 28

        # Budget influence
        if budget >= 70:
            score += 10
        elif budget < 30:
            score -= 8

        return max(0, min(100, score))
    
    def _estimate_cost(self, area, budget):
        """
        Estimate project cost based on area and budget level
        Returns estimated cost in dollars
        """
        # Base cost per square foot (varies with budget level)
        base_costs = {
            'low': 100,      # Low budget design
            'medium': 180,   # Medium budget design
            'high': 280      # High budget design
        }
        
        # Categorize budget
        if budget < 33:
            cost_per_sqft = base_costs['low']
        elif budget < 67:
            cost_per_sqft = base_costs['medium']
        else:
            cost_per_sqft = base_costs['high']
        
        # Calculate total cost
        total_cost = area * cost_per_sqft
        
        # Add contingency (10-20%)
        contingency = total_cost * (0.15 if budget < 50 else 0.10)
        
        return int(total_cost + contingency)
    
    def _estimate_payback(self, energy_score, budget):
        """
        Estimate simple payback period for sustainable features (years)
        """
        if energy_score < 50:
            payback = 12
        elif energy_score < 70:
            payback = 8
        elif energy_score < 85:
            payback = 5
        else:
            payback = 3
        
        # Budget affects payback (higher budget investment)
        if budget < 30:
            payback = payback * 1.5
        
        return round(payback)
    
    def _estimate_operational_carbon(self, area, energy_efficiency):
        """
        Estimate annual operational carbon (kg CO2e)
        Based on area and energy efficiency
        """
        # Base annual carbon per sq ft (kg CO2e/year)
        base_annual = 3.5
        
        # Efficiency reduction factor
        efficiency_factor = (100 - energy_efficiency) / 100
        
        # Calculate total
        annual_carbon = area * base_annual * efficiency_factor
        
        return round(annual_carbon, 1)
    
    def rank_designs(self, designs):
        """
        Rank designs by sustainability index
        
        Args:
            designs: List of design objects with metrics
        
        Returns:
            List of ranked designs with ranking information
        """
        # Sort by sustainability index (descending)
        ranked = sorted(
            designs,
            key=lambda d: d.get('metrics', {}).get('sustainabilityIndex', 0),
            reverse=True
        )
        
        # Add ranking metadata
        for rank, design in enumerate(ranked, 1):
            design['ranking'] = {
                'position': rank,
                'sustainability_score': design.get('metrics', {}).get('sustainabilityIndex', 0),
                'energy_efficiency': design.get('metrics', {}).get('energyEfficiency', 0),
                'water_efficiency': design.get('metrics', {}).get('waterEfficiency', 0),
                'carbon_level': design.get('metrics', {}).get('carbonFootprint', 'Unknown')
            }
        
        return ranked
    
    def compare_designs(self, design_ids, designs):
        """
        Provide detailed comparison between specific designs
        """
        selected_designs = [d for d in designs if d.get('id') in design_ids]
        
        comparison = {
            'designs_compared': len(selected_designs),
            'comparison_data': {}
        }
        
        for design in selected_designs:
            comparison['comparison_data'][design['id']] = {
                'name': design.get('name', 'Unknown'),
                'metrics': design.get('metrics', {}),
                'characteristics': {
                    'approach': design.get('design_approach', ''),
                    'modular': design.get('modular_design', False),
                    'renewable_ready': design.get('renewable_ready', False),
                    'biodiversity_positive': design.get('biodiversity_positive', False)
                }
            }
        
        return comparison
