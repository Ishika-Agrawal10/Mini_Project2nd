# Training Data Folder

Place your downloaded datasets here for ML model training.

## Required Files (download and place here):

### 1. UCI Energy Efficiency Dataset
**Filename:** `energy_efficiency.xlsx` or `energy_efficiency.csv`
**Download from:** https://archive.ics.uci.edu/ml/datasets/Energy+efficiency
**What to download:** ENB2012_data.xlsx from the "Data Folder" link

### 2. NYC Building Energy Data (Optional but recommended)
**Filename:** `nyc_building_energy.csv`
**Download from:** https://data.cityofnewyork.us/Environment/Energy-and-Water-Data-Disclosure-for-Local-Law-84-/qb3v-bbre
**What to download:** Click "Export" → CSV (first 5000 rows recommended)

### 3. Sample Data Template
If you don't have real data yet, the system will use synthetic data automatically.

## File Structure:
```
data/
├── README.md (this file)
├── energy_efficiency.xlsx (place UCI dataset here)
├── energy_efficiency.csv (or CSV version)
├── nyc_building_energy.csv (place NYC data here)
└── custom_data.csv (any custom dataset you create)
```

## The system will automatically:
1. Check for real datasets in this folder
2. Load and preprocess them
3. Train ML models with real data
4. Fall back to synthetic data if no files found

## Custom Data Format:
If you create your own CSV, use this format:

```csv
area,budget,climate,priority,design_id,actual_cost,energy_efficiency,water_efficiency,carbon_level
1200,75,moderate,energy,0,180000,85,70,Low
1500,60,hot,water,2,220000,75,88,Medium
```

Columns needed:
- `area`: Building area (300-2000)
- `budget`: Budget level (0-100)
- `climate`: cold/moderate/hot
- `priority`: energy/water/materials
- `design_id`: 0=Eco-Efficient, 1=Carbon-Optimized, 2=Regenerative
- `actual_cost`: Total project cost
- `energy_efficiency`: Energy score (0-100)
- `water_efficiency`: Water score (0-100)
- `carbon_level`: Low/Medium/High
