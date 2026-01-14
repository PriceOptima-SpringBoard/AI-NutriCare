# AINutricare – Milestone 2

## Overview
AINutricare is an intelligent clinical pipeline that automates **patient health assessment and personalized diet generation**.  
It integrates **machine learning–based clinical classification** with **physiological simulation** to generate medically safe, constraint-compliant nutrition plans from **raw PDF medical records**.

The system achieves **greater than 85% classification accuracy** in detecting critical health conditions and ensures diet safety through predictive metabolic validation.
## Key Features
### Clinical NLP
- Extracts structured biomarkers (e.g., Glucose, Creatinine, BUN) from unstructured PDF discharge summaries.
- Converts raw clinical text into machine-readable numeric features.
### ML Health Classification
- Trains and deploys machine learning models to classify patient conditions such as:
  - Sepsis
  - Renal Failure
  - Metabolic Abnormalities
- Uses numeric laboratory data as primary predictors.
### Threshold Alerts
- Implements rule-based clinical logic to detect abnormal lab values.
- Triggers immediate risk warnings for unsafe physiological ranges.

### Physiological Simulation
- Simulates metabolic responses (e.g., BUN elevation due to protein intake).
- Validates dietary safety before final approval.

### Fusion Diet Engine
- Combines ML-based risk predictions with physician notes.
- Generates nutrition plans that satisfy clinical and dietary constraints.
## Pipeline Workflow
### 1. Data Extraction
- Parse PDF medical reports into structured JSON.
- Script: `1_parse_pdf.py`
### 2. Model Training
- Train machine learning classifiers on laboratory datasets.
- Identify clinical risks and health anomalies.
- Script: `2_train_ml.py`
### 3. Risk Analysis
- Apply trained models to classify patient health status.
- Validate lab values against predefined safety thresholds.
### 4. Simulation Loop
- Predict physiological effects of proposed caloric and protein intake.
- Ensure metabolic safety prior to diet recommendation.
- Script: `3_simulate_diet.py`
### 5. Menu Generation
- Filter food databases using validated safety and nutritional constraints.
- Generate personalized diet plans.
- Script: `4_generate_menu.py`
### 6. Reporting
- Generate clinical summary reports and patient-specific menu cards in PDF format.
- Script: `5_create_pdfs.py`
## Technology Stack
### Core
- Python  
- Pandas  
- NumPy  
### Machine Learning
- Scikit-learn  
- TensorFlow (classification and risk prediction)
### Data Extraction
- pdfplumber  
- Regular Expressions (Regex)
### Reporting
- FPDF
