// Mock sustainability evaluation logic
export const evaluateDesign = (design, constraints) => {
  const { area, budget, climate, priority } = constraints;

  let energyScore = 50;
  let waterScore = 50;
  let materialsScore = 50;

  // Design-specific adjustments
  if (design.id === 'design-a') {
    // Eco-Efficient - energy focused
    energyScore += 20;
    if (budget >= 75) energyScore += 15;
    if (priority === 'energy') energyScore += 10;
    if (climate === 'cold') energyScore += 5;
    waterScore += 5;
  } else if (design.id === 'design-b') {
    // Carbon-Optimized - materials focused
    materialsScore += 25;
    if (priority === 'materials') materialsScore += 15;
    if (budget >= 70) materialsScore += 10;
    energyScore += 8;
    waterScore += 8;
  } else if (design.id === 'design-c') {
    // Regenerative - holistic, water focused
    waterScore += 25;
    if (priority === 'water') waterScore += 15;
    if (climate === 'hot') waterScore += 15;
    energyScore += 15;
    materialsScore += 15;
  }

  // General adjustments based on constraints
  if (priority === 'energy') energyScore += 5;
  if (priority === 'water') waterScore += 5;
  if (priority === 'materials') materialsScore += 5;

  if (budget >= 80) {
    energyScore += 8;
    waterScore += 8;
    materialsScore += 8;
  } else if (budget < 40) {
    energyScore -= 5;
    waterScore -= 5;
    materialsScore -= 5;
  }

  if (climate === 'hot') waterScore += 10;
  if (climate === 'cold') energyScore += 5;

  if (area < 600) energyScore += 8;
  if (area > 1800) materialsScore += 8;

  // Normalize scores
  energyScore = Math.min(100, Math.max(0, energyScore));
  waterScore = Math.min(100, Math.max(0, waterScore));
  materialsScore = Math.min(100, Math.max(0, materialsScore));

  // Carbon footprint calculation
  let carbonLevel = 'High';
  if (energyScore > 70 && materialsScore > 60) carbonLevel = 'Low';
  else if (energyScore > 55 || materialsScore > 65) carbonLevel = 'Medium';

  // Cost estimate
  const baseCost = area * 150;
  const costMultiplier = budget / 50;
  const estimatedCost = Math.round(baseCost * costMultiplier);

  // Calculate sustainability index based on priority
  let sustainabilityIndex;
  if (priority === 'energy') {
    sustainabilityIndex = Math.round((energyScore * 0.5) + (waterScore * 0.3) + (materialsScore * 0.2));
  } else if (priority === 'water') {
    sustainabilityIndex = Math.round((waterScore * 0.5) + (energyScore * 0.3) + (materialsScore * 0.2));
  } else {
    sustainabilityIndex = Math.round((materialsScore * 0.5) + (energyScore * 0.25) + (waterScore * 0.25));
  }

  return {
    energyEfficiency: energyScore,
    carbonFootprint: carbonLevel,
    waterEfficiency: waterScore,
    estimatedCost: estimatedCost,
    sustainabilityIndex: sustainabilityIndex,
  };
};

// Get design recommendation based on constraints
export const getDesignRecommendation = (constraints) => {
  const { area, budget, climate, priority } = constraints;

  let climateStrategy = 'moderate-passive';
  if (climate === 'hot') climateStrategy = 'passive-cooling-thermal-mass';
  else if (climate === 'cold') climateStrategy = 'thermal-insulation-heat-recovery';

  let materialsRecommendation = ['recycled-materials', 'locally-sourced'];
  if (budget >= 80) materialsRecommendation.push('premium-sustainable');
  if (priority === 'materials') materialsRecommendation.push('zero-waste-capable');

  let strategies = [
    'daylighting-optimization',
    'energy-efficient-systems'
  ];
  if (priority === 'energy') strategies.push('high-efficiency-hvac', 'renewable-ready');
  if (priority === 'water') strategies.push('rainwater-harvesting', 'greywater-recycling');
  if (priority === 'materials') strategies.push('circular-economy', 'lifecycle-optimization');

  return {
    climate: climateStrategy,
    materials: materialsRecommendation,
    strategies: strategies,
  };
};

// Generate design alternatives (simulated)
export const generateDesignAlternatives = (constraints) => {
  const { area, budget, climate, priority } = constraints;

  const recommendation = getDesignRecommendation(constraints);

  const designs = [
    {
      id: 'design-a',
      name: 'Eco-Efficient Design',
      description: `A ${area} sq ft sustainable design optimized for energy efficiency. Features passive solar design, high-performance insulation, and integrated renewable energy infrastructure. Ideal for ${climate} climates with focus on long-term operational sustainability.`,
      materials: ['Cross-laminated timber', 'Recycled steel', 'Cork insulation', 'Bamboo flooring'],
      keyFeatures: [
        'Triple-glazed windows for thermal performance',
        'Heat recovery ventilation system',
        'High thermal mass for temperature stability',
        'Native landscaping for water conservation'
      ],
      strategies: recommendation.strategies,
      color: 'from-green-600 to-green-400',
      icon: '🌱'
    },
    {
      id: 'design-b',
      name: 'Carbon-Optimized Design',
      description: `A climate-responsive design emphasizing ${priority === 'materials' ? 'material selection' : 'lifecycle carbon reduction'}. Leverages local materials, modular construction, and adaptive systems to minimize embodied and operational carbon. Suitable for projects with environmental impact as primary metric.`,
      materials: ['Local stone', 'FSC-certified wood', 'Low-carbon concrete', 'Reclaimed materials'],
      keyFeatures: [
        'Modular construction for flexibility',
        'Material passport tracking',
        'Carbon-neutral production goal',
        'Adaptive thermal mass design'
      ],
      strategies: [
        'embodied-carbon-reduction',
        'material-transparency',
        'modular-design',
        ...recommendation.strategies
      ],
      color: 'from-blue-600 to-blue-400',
      icon: '♻️'
    },
    {
      id: 'design-c',
      name: 'Regenerative Design',
      description: `A holistic design that goes beyond sustainability to create positive environmental impact. Integrates water management, biodiversity support, and community resilience. Combines traditional ecological wisdom with modern sustainable principles.`,
      materials: ['Living materials', 'Mycelium composites', 'Hempcrete', 'Salvaged materials'],
      keyFeatures: [
        'Integrated habitat zones',
        'Managed aquifer recharge systems',
        'Urban agriculture opportunities',
        'Natural ventilation and daylighting'
      ],
      strategies: [
        'regenerative-systems',
        'biodiversity-integration',
        'water-positive-design',
        'community-resilience',
        ...recommendation.strategies
      ],
      color: 'from-emerald-600 to-teal-400',
      icon: '🌿'
    }
  ];

  // Evaluate each design
  return designs.map(design => ({
    ...design,
    metrics: evaluateDesign(design, constraints)
  }));
};
