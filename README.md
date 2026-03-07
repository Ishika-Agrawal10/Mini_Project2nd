# Sustainable Design and Planning Using Generative AI

A comprehensive academic project demonstrating how Generative AI can support sustainable design and planning through constraint-aware generation, sustainability evaluation, and interactive decision-support.

## Overview

This is a **decision-support system** that generates and optimizes sustainable design alternatives based on user-defined constraints and sustainability metrics, while respecting real-world feasibility and planning constraints.

### Problem Statement
Sustainable urban and product design requires balancing environmental, economic, and social constraints. Traditional manual design processes struggle to explore complex solution spaces efficiently. Designers face difficulty in evaluating multiple sustainable alternatives, integrating real-world constraints such as regulations, climate, and budget, and scaling design efforts for large projects.

### Proposed Solution
A Generative AI–based decision-support system that:
- Generates design alternatives based on constraints
- Evaluates sustainability impact using rule-based metrics
- Provides interactive comparison and visualization
- Supports informed decision-making with explainability

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Python 3.9+**
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin support
- **Rule-based constraint engine**
- **Mock AI generation** (integration-ready for LLMs)

---

## Project Structure

```
sustainable-ai-design/
├── frontend/                    # React Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputPanel.jsx   # User constraint input
│   │   │   ├── Loader.jsx       # AI generation animation
│   │   │   ├── DesignCard.jsx   # Design alternative display
│   │   │   └── ComparisonChart.jsx  # Visualization
│   │   ├── pages/
│   │   │   └── Dashboard.jsx    # Main orchestration
│   │   ├── data/
│   │   │   └── mockDesigns.js   # Design logic & evaluation
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── backend/                     # Flask API server
│   ├── app.py                   # Main Flask application
│   ├── constraints.py           # Constraint validation & processing
│   ├── generator.py             # Design generation logic
│   ├── evaluator.py             # Sustainability evaluation
│   └── requirements.txt          # Python dependencies
│
└── README.md                    # This file
```

---

## Core Features

### 1. Interactive User Interface
- Modern dark-themed dashboard with sustainability-inspired color accents
- Responsive layout (desktop + mobile)
- Clean typography and visual hierarchy
- Smooth animations and transitions

### 2. User Input & Constraint Modeling
- **Area** slider (300–2000 sq ft)
- **Budget Level** slider (0–100%)
- **Climate Type** selector (cold / moderate / hot)
- **Sustainability Priority** selector (energy / water / materials)

Constraints are validated and processed through a rule-based logic engine.

### 3. Generative AI Design Module (Simulated)
Generates 3 design alternatives:
- **Eco-Efficient Design** 🌱 - Energy-focused passive systems
- **Carbon-Optimized Design** ♻️ - Material lifecycle optimization
- **Regenerative Design** 🌿 - Holistic positive impact

Each design includes:
- Detailed description
- Suggested materials
- Key features
- Sustainability strategies

### 4. Sustainability Impact Evaluation
Each design is evaluated using:
- **Energy Efficiency Score** (0–100%)
  - Based on passive design, thermal performance, renewable readiness
- **Carbon Footprint** (Low / Medium / High)
  - Combined assessment of embodied and operational carbon
- **Water Efficiency Score** (0–100%)
  - Based on water management strategies and climate adaptation

Additional metrics:
- Estimated project cost
- Payback period for sustainable features
- Lifecycle carbon analysis

### 5. Interactive Comparison & Visualization
- Card-based display of all alternatives
- Automatic highlighting of best-performing design
- Multiple visualization types:
  - Bar charts for performance metrics
  - Radar charts for multi-dimensional analysis
  - Cost comparison visualizations
- Summary statistics and rankings

### 6. AI Generation Experience
- "AI thinking" animation with rotating icon
- Step-based generation messages:
  - "Applying constraints..."
  - "Generating design alternatives..."
  - "Evaluating sustainability impact..."
- Progress indicators for transparency

---

## System Architecture

```
┌─────────────────────────────────────────┐
│   User Input Panel (React)              │
│  (Area, Budget, Climate, Priority)      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Constraint Modeling Engine (Python)   │
│  (Validation, Processing, Feasibility)  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Design Generation Module (Simulated)  │
│  (3 design alternatives)                │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Sustainability Evaluation Module      │
│  (Energy, Water, Carbon scores)         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Visualization & Comparison (React)    │
│  (Dashboard, Charts, Rankings)          │
└─────────────────────────────────────────┘
```

---

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend API runs on `http://localhost:5000`

---

## Usage Guide

### Basic Workflow

1. **Set Constraints**
   - Adjust area using the slider (300–2000 sq ft)
   - Set budget level (0–100%)
   - Select climate type
   - Choose sustainability priority

2. **Generate Designs**
   - Click "🚀 Generate AI Designs"
   - Watch the AI thinking animation

3. **View Results**
   - See three design alternatives
   - Review metrics for each design
   - Check the best-match recommendation

4. **Compare Alternatives**
   - View performance metrics in bar chart
   - Analyze multi-dimensional comparison (radar)
   - Compare estimated costs
   - Review summary statistics

5. **Make Decisions**
   - Use the recommended design as starting point
   - Adjust constraints and regenerate
   - Export or document chosen design

---

## API Endpoints

### Health Check
```
GET /api/health
```
Returns system status and metadata.

### Validate Constraints
```
POST /api/constraints/validate
Content-Type: application/json

{
  "area": 1000,
  "budget": 60,
  "climate": "moderate",
  "priority": "energy"
}
```

### Generate Designs
```
POST /api/designs/generate
Content-Type: application/json

{
  "area": 1000,
  "budget": 60,
  "climate": "moderate",
  "priority": "energy"
}
```
Returns 3 design alternatives with metrics.

### Evaluate Design
```
POST /api/designs/{design_id}/evaluate
Content-Type: application/json

{
  "design": {...},
  "constraints": {...}
}
```

### Get Rankings
```
POST /api/comparison/rankings
Content-Type: application/json

{
  "designs": [...]
}
```

### System Metadata
```
GET /api/metadata
```

---

## Key Design Decisions

### 1. Text-Based Designs
- Designs are metric-driven and descriptive, not visual CAD outputs
- Focus on concepts, strategies, and performance
- Academic integrity: estimation > pretended accuracy

### 2. Rule-Based Evaluation
- Sustainability scores derived from logical rules
- Fully explainable: no black boxes
- Can be validated in academic viva

### 3. Modular Architecture
- Clean separation: constraints → generation → evaluation
- Easy to swap mock generation with real LLM API
- Backend-ready for production integration

### 4. Responsive Design
- Works on desktop and mobile
- Touch-friendly controls
- Progressive enhancement

---

## Sustainability Methodology

### Energy Efficiency Scoring
```
Base Score (50) +
  Budget Boost (0-20 points) +
  Priority Weight (0-15 points) +
  Climate Adjustment (-5 to +5) +
  Area Efficiency (0-8 points)
= Energy Score (0-100)
```

### Water Efficiency Scoring
```
Base Score (50) +
  Priority Weight (0-25 points) +
  Budget Boost (0-15 points) +
  Climate Adjustment (0-20 points) +
  Area Efficiency (0-8 points)
= Water Score (0-100)
```

### Carbon Footprint Assessment
- Combines energy efficiency and embodied carbon estimates
- Categorical: Low (< 18 kg CO2e/sqft) / Medium / High

### Sustainability Index
Weighted average of energy and water scores:
- Energy-priority: 60% energy + 40% water
- Water-priority: 40% energy + 60% water
- Materials-priority: 50% energy + 50% water

---

## Future Extensions (Post-Academic)

1. **Real LLM Integration**
   - OpenAI GPT-4 / Anthropic Claude API
   - Stable Diffusion for visual mockups

2. **Advanced Evaluation**
   - Machine learning model for cost prediction
   - Real-time climate and material data

3. **Collaboration Features**
   - Multi-user projects
   - Design history and versioning
   - Team annotations

4. **Export Capabilities**
   - PDF design documents
   - BIM model generation ready
   - Regulatory compliance checklist

5. **Optimization Loop**
   - Evolutionary algorithms for design space exploration
   - Multi-objective optimization
   - Pareto frontier analysis

---

## Key Files & Components

### Frontend Components

**InputPanel.jsx**
- User constraint inputs
- Validation and state management
- Disable states during generation

**Loader.jsx**
- Step-based progress animation
- Visual "thinking" experience
- Builds anticipation

**DesignCard.jsx**
- Design information display
- Metric highlights
- Materials and features list
- Best-match badge

**ComparisonChart.jsx**
- Bar chart (performance metrics)
- Radar chart (multi-dimensional)
- Cost visualization
- Summary statistics

**Dashboard.jsx**
- Main orchestration
- State management
- API communication (ready)
- Workflow control

**mockDesigns.js**
- Design generation logic
- Evaluation functions
- Recommendation scoring

### Backend Modules

**app.py**
- Flask application setup
- Route definitions
- Error handling
- CORS configuration

**constraints.py**
- Validation logic
- Constraint processing
- Feasibility calculation
- Strategy mapping

**generator.py**
- Design template system
- Material selection
- Strategy assignment
- Feature generation

**evaluator.py**
- Energy efficiency calculation
- Water efficiency calculation
- Carbon assessment
- Cost estimation
- Ranking algorithms

---

## Performance & Scalability

- **Frontend**: Optimized bundle size (~180KB gzipped)
- **Backend**: Stateless API design
- **Database**: None (mock data in this version)
- **Rendering**: Lazy-loaded charts
- **Caching**: Client-side design cache ready

---

## Testing Recommendations

### Frontend
- Component snapshot tests
- Input validation tests
- Animation behavior verification

### Backend
- Constraint validation tests
- Evaluation metric tests
- API endpoint tests

### Integration
- E2E workflow tests
- API contract tests

---

## Troubleshooting

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Backend port already in use
```bash
# Change port in app.py or kill process
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### CORS errors
- Check backend is running on :5000
- Verify Flask-CORS is installed

### Charts not rendering
- Ensure Recharts is installed
- Check browser console for errors

---

## Citation & Attribution

**Project**: Sustainable Design and Planning Using Generative AI
**Type**: Full-Stack Academic Project
**Year**: 2026
**Frameworks**: React, Flask, Tailwind CSS, Framer Motion, Recharts

---

## Contact & Support

For questions about this project:
- Review component comments for implementation details
- Check API documentation at `/api/metadata`
- Examine mock data generation logic for sustainability scoring

---

The mock AI generation is intentionally simplified to focus on the decision-support framework. Real LLM integration would follow the same API patterns.

---

### Deployed on Render
https://sus-ds.onrender.com

