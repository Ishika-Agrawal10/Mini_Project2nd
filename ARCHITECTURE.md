# Architecture & Design Document

## Sustainable Design and Planning Using Generative AI
### Academic Project - System Architecture

---

## Executive Summary

This document outlines the complete system architecture for the Sustainable Design Studio, a decision-support system that demonstrates how Generative AI can accelerate sustainable design exploration while maintaining explainability suitable for academic evaluation.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│                        (React)                               │
├─────────────────────────────────────────────────────────────┤
│  InputPanel │ Dashboard │ DesignCard │ ComparisonChart      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                      (Flask API)                             │
├─────────────────────────────────────────────────────────────┤
│  Routing │ Validation │ Orchestration                        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│                    (Python Modules)                          │
├─────────────────────────────────────────────────────────────┤
│  Constraints │ Generator │ Evaluator                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components

#### 1. InputPanel Component
**Purpose**: Collect and validate user constraints

**Responsibilities**:
- Area slider input (300-2000 sq ft)
- Budget level slider (0-100%)
- Climate type selection
- Priority focus selection
- Generate trigger

**Props**:
```javascript
{
  constraints: Object,
  onConstraintChange: Function,
  onGenerate: Function,
  isLoading: Boolean
}
```

**State Management**: Lifted to Dashboard

#### 2. Loader Component
**Purpose**: Provide visual feedback during generation

**Responsibilities**:
- Display step-based progress
- Animate "thinking" icon
- Show progress indicators
- Manage animation timeline

**Features**:
- Three sequential steps
- Smooth transitions
- Pulsing animation
- Estimated timeouts

#### 3. DesignCard Component
**Purpose**: Display individual design alternatives

**Responsibilities**:
- Render design information
- Display metrics
- Show materials list
- List key features
- Highlight best design

**Special Features**:
- Best-match badge
- Hover animations
- Color gradients
- Interactive elements

#### 4. ComparisonChart Component
**Purpose**: Visualize comparative analysis

**Responsibilities**:
- Performance bar chart
- Multi-dimensional radar chart
- Cost comparison
- Summary statistics

**Chart Types**:
- Bar Chart (Recharts)
- Radar Chart (Recharts)
- Custom stats display

#### 5. Dashboard Component
**Purpose**: Orchestrate entire application flow

**Responsibilities**:
- Manage global state
- Handle generation workflow
- Coordinate animations
- Control visibility

**State**:
```javascript
{
  constraints: Object,
  designs: Array,
  loading: Boolean,
  loadingStatus: String (applying|generating|evaluating)
}
```

---

### Backend Modules

#### 1. Constraint Engine (`constraints.py`)

**Class**: `ConstraintEngine`

**Methods**:
- `validate(constraints)` → (bool, list)
  - Validates input bounds
  - Returns validation result and errors

- `process(constraints)` → dict
  - Applies logic rules
  - Derives secondary values
  - Categorizes inputs

- `calculate_feasibility(constraints)` → int (0-100)
  - Assesses design feasibility
  - Returns feasibility score

**Validation Rules**:
- Area: 300-2000 sq ft
- Budget: 0-100%
- Climate: {cold, moderate, hot}
- Priority: {energy, water, materials}

**Processing Logic**:
- Category assignment (small/medium/large)
- Strategy mapping
- Weight calculation

#### 2. Design Generator (`generator.py`)

**Class**: `DesignGenerator`

**Methods**:
- `generate(constraints)` → List[Design]
  - Generates three alternatives
  - Customizes to constraints
  - Returns complete designs

**Generation Methods**:
- `_generate_eco_efficient()` - Energy-focused
- `_generate_carbon_optimized()` - Materials-focused
- `_generate_regenerative()` - Holistic approach

**Material Selection**:
- Budget-aware
- Climate-appropriate
- Sustainability-aligned

**Feature Generation**:
- Climate-specific strategies
- Budget-constrained options
- Priority-weighted features

#### 3. Sustainability Evaluator (`evaluator.py`)

**Class**: `SustainabilityEvaluator`

**Methods**:
- `evaluate(design, constraints)` → dict
  - Comprehensive evaluation
  - Returns all metrics
  - Calculates scores

- `_evaluate_energy()` → int (0-100)
  - Energy efficiency score
  - Based on design + constraints

- `_evaluate_water()` → int (0-100)
  - Water efficiency score
  - Climate + priority weighted

- `_evaluate_carbon()` → str
  - Carbon footprint level
  - Combined assessment

- `rank_designs(designs)` → List[Design]
  - Ranks by sustainability
  - Adds ranking metadata

**Evaluation Logic**:
```
Energy = Base(50) + Budget + Priority + Climate + Area
Water = Base(50) + Priority + Budget + Climate + Area
Carbon = f(Energy, Budget, Materials)
Index = Weighted(Energy, Water, Priority)
Cost = Area × Rate + Contingency
```

#### 4. Flask Application (`app.py`)

**Routes**:
- `GET /api/health` → System status
- `POST /api/constraints/validate` → Validation result
- `POST /api/designs/generate` → Design alternatives
- `POST /api/designs/{id}/evaluate` → Design metrics
- `POST /api/comparison/rankings` → Rankings
- `GET /api/metadata` → System metadata

**Error Handling**:
- 400: Invalid constraints
- 404: Endpoint not found
- 500: Internal error

---

## Data Models

### Constraint Object
```python
{
    "area": int (300-2000),
    "budget": int (0-100),
    "climate": str (cold|moderate|hot),
    "priority": str (energy|water|materials)
}
```

### Design Object
```python
{
    "id": str,
    "name": str,
    "description": str,
    "materials": List[str],
    "keyFeatures": List[str],
    "strategies": List[str],
    "color": str (gradient),
    "icon": str (emoji),
    "design_approach": str,
    "estimated_embodied_carbon": float,
    "renewable_ready": bool,
    "modular_design": bool,
    "biodiversity_positive": bool,
    "metrics": {
        "energyEfficiency": int (0-100),
        "waterEfficiency": int (0-100),
        "carbonFootprint": str (Low|Medium|High),
        "sustainabilityIndex": int (0-100),
        "estimatedCost": int,
        "payback_period_years": int,
        "lifecycle_analysis": {...}
    }
}
```

### Metric Object
```python
{
    "energyEfficiency": int (0-100),
    "waterEfficiency": int (0-100),
    "carbonFootprint": str,
    "sustainabilityIndex": int (0-100),
    "estimatedCost": int,
    "payback_period_years": int,
    "lifecycle_analysis": {
        "embodied": float,
        "operational": float
    }
}
```

---

## Data Flow Diagrams

### Generation Workflow
```
User Input
    ↓
[Constraint Validation]
    ↓
[Design Generation x3]
    ↓
[Design Evaluation]
    ↓
[Sort by Sustainability]
    ↓
[Render Dashboard]
    ↓
[Display Results]
```

### Scoring Workflow
```
Design + Constraints
    ↓
[Energy Score Calculation]
    ↓
[Water Score Calculation]
    ↓
[Carbon Assessment]
    ↓
[Cost Estimation]
    ↓
[Index Calculation]
    ↓
[Return Metrics]
```

---

## Sustainability Scoring Methodology

### Energy Efficiency Calculation

**Formula**:
```
Energy = 50 (base)
       + Budget_Boost (0-20)
       + Priority_Weight (0-15)
       + Climate_Adjust (-5 to +5)
       + Area_Efficiency (0-8)
       = 0-100
```

**Weights**:
- Budget: 25% influence
- Climate: 30% influence
- Materials: 25% influence
- Area: 20% influence

### Water Efficiency Calculation

**Formula**:
```
Water = 50 (base)
      + Priority_Weight (0-25)
      + Budget_Boost (0-15)
      + Climate_Adjust (0-20)
      + Area_Efficiency (0-8)
      = 0-100
```

**Climate Modifiers**:
- Hot: +20 (more water mgmt)
- Moderate: +10
- Cold: 0 (baseline)

### Sustainability Index

**Priority-Based Weighting**:
- Energy-focused: 60% energy + 40% water
- Water-focused: 40% energy + 60% water
- Materials-focused: 50% energy + 50% water

---

## UI/UX Design

### Color Scheme
```
Primary: Dark background (#0f172a)
Surface: Slate (#1e293b)
Accent Green: #10b981 (energy/sustainability)
Accent Blue: #3b82f6 (water/features)
Accent Orange: #f97316 (carbon/metrics)
```

### Component Layout

**Desktop (3-column)**:
```
┌─────────────────────────────────────────┐
│              Header                     │
├─────────────────────────────────────────┤
│  InputPanel │         │      Results    │
│  (sticky)   │  Loader │  (animated)    │
│             │         │                 │
└─────────────────────────────────────────┘
```

**Mobile (1-column)**:
```
┌──────────────────┐
│     Header       │
├──────────────────┤
│   InputPanel     │
├──────────────────┤
│     Loader       │
├──────────────────┤
│    Results       │
├──────────────────┤
│   Charts         │
└──────────────────┘
```

### Animation Strategy
- **Entrance**: Motion from -20 to 0, opacity 0→1
- **Hover**: Scale 1→1.02, shadow increase
- **Loading**: Rotating icon, pulsing text
- **Transitions**: 300ms default duration

---

## Extensibility Points

### 1. LLM Integration
Replace mock generation with:
```python
# In generator.py
from openai import OpenAI

def generate_with_llm(constraints):
    prompt = format_design_prompt(constraints)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return parse_designs(response.content)
```

### 2. Database Integration
```python
# In app.py
from sqlalchemy import create_engine
db.session.add(Design(...))
db.session.commit()
```

### 3. Advanced Metrics
- ML-based cost prediction
- Real-time climate data
- Material price APIs
- Regulatory compliance checks

### 4. Collaboration Features
- User accounts
- Project sharing
- Design history
- Team comments

---

## Performance Considerations

### Frontend
- Lazy-load charts using React.lazy()
- Memoize expensive components
- Debounce slider changes
- Bundle size: ~180KB gzipped

### Backend
- Stateless design (horizontal scaling)
- No database queries (mock data)
- Response time: <500ms
- Ready for caching with Redis

---

## Security Considerations

### Input Validation
- All constraints validated on backend
- Type checking for all inputs
- Bounds enforcement

### CORS
- Configured for localhost development
- Update for production URLs

### Error Handling
- No sensitive data in error messages
- Proper HTTP status codes
- Exception logging

---

## Testing Strategy

### Frontend Tests
```javascript
// Component tests
test('InputPanel renders with default values', ...)
test('Design generation triggered on button click', ...)

// Integration tests
test('Full workflow from input to charts', ...)
```

### Backend Tests
```python
# Unit tests
test_constraint_validation()
test_energy_scoring()
test_design_generation()

# Integration tests
test_generate_designs_endpoint()
test_design_evaluation_endpoint()
```

---

## Deployment Architecture

### Development
- Frontend: `npm run dev` (localhost:3000)
- Backend: `python app.py` (localhost:5000)

### Production
- Frontend: Built with `npm run build` → S3 + CloudFront
- Backend: Docker container → ECS/Kubernetes
- API: API Gateway with rate limiting
- Database: (Optional) PostgreSQL
- Cache: Redis for design caching

---

## Academic Advantages

1. **Explainability**: Every metric derivable by hand
2. **Simplicity**: No hidden complexity
3. **Modularity**: Each component independently auditable
4. **Scalability**: Ready for production enhancement
5. **Transparency**: Clear algorithmic logic

---

## Conclusion

This architecture balances academic requirements with modern software engineering practices. It's production-ready for educational purposes and easily extensible for real-world applications.

**Key Principles**:
- Separation of Concerns
- Explainability First
- Modular Design
- Scalable Architecture
- Academic Integrity
