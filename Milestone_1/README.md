# AI-NutriCare: Smitha-AI-Nutricare  
## AI-Powered Clinical Decision Support System (CDSS) for ICU Nutrition  

**Author:** Smitha  
**Status:** Completed (Milestone 1 & 2)  
**Model Accuracy:** ~89.29% (Test Set)  
## Project Overview

AI-NutriCare is an **end-to-end AI-powered Clinical Decision Support System (CDSS)** designed to predict **patient mortality risk in the Intensive Care Unit (ICU)** using the **MIMIC-III dataset**.

The system analyzes the **first 24 hours of ICU patient data** to:
- Classify mortality risk
- Suggest **personalized nutritional interventions** using a **rule-based engine**
## Milestone 1: Data Engineering & Feature Selection

### Goal
Transform raw ICU clinical tables into a **clean, time-series tensor format** suitable for **deep learning models**.
## The 18 Critical Features
We extracted **18 clinically significant signals** known to influence ICU mortality, covering **hemodynamics, infection, and organ failure**.
### Vitals
- Heart Rate  
- Mean Arterial Pressure (MAP)  
- Respiratory Rate  
- Temperature (°F)  
- SpO₂ (Oxygen Saturation)

### Laboratory Measurements
- Lactate  
- White Blood Cell Count (WBC)  
- Creatinine  
- Blood Urea Nitrogen (BUN)  
- Sodium  
- Potassium  
- Glucose  
- Hemoglobin  

### Fluids & Medications
- Total Input  
- Total Output  
- Vasopressors  
- Sedatives  
- Insulin  
## Data Pipeline Steps

### 1️ Ingestion
- Parsed clinical data from:
  - `chartevents`
  - `labevents`
  - `inputevents`
- Source: **MIMIC-III Dataset**

### 2️ Cleaning
- Removed physiological outliers  
  - Example: Heart Rate > 300 bpm
- Standardized measurement units

### 3️ Imputation
- Applied **Forward Fill (ffill)** strategy  
- Simulates real-time clinical data availability in ICU settings

### 4️ Transformation
- Reshaped processed data into **3D tensors**:
(Patients, 24 Hours, 18 Features)
