# AI-ML Based Personalized Diet Plan Generator

## 🎯 Milestone-1: Data Collection and Preprocessing

### 📌 Overview
Milestone-1 focuses on **data collection, preprocessing, and dynamic time-series construction** from heterogeneous medical and ICU data.  
The outcome is a **structured, model-ready 24-hour multivariate time-series dataset** suitable for AI/ML and Deep Learning models.
The first 24 hours of ICU admission were selected as they are clinically significant for early risk assessment and intervention planning.

---

## 📂 Data Sources Used
The exploratory data analysis (EDA) integrates multiple clinical sources aligned using `subject_id` and `stay_id`:

- ICU Vital Signs (hourly measurements)
- Laboratory Test Results
- Medication & Prescription Records
- Fluid Input & Output Events
- Patient Demographics (Age, Gender)
- Outcome Labels (Mortality)

---

## 📌 Steps Performed
- Collected and merged patient data from multiple clinical sources
- Preprocessed numeric and textual data into a standardized **24-hour time-series**
- Created medication class indicators
- Computed hourly fluid balance (input − output)
- Merged all features into a unified dataset (**X**)
- Extracted outcome labels (**y**) for mortality prediction
- Saved processed datasets for downstream modeling

---

## 🔧 Key Processing Steps

### 1️⃣ Data Collection & Filtering
- Selected ICU stays with sufficient data coverage
- Filtered relevant vitals, labs, fluids, and medications
- Ensured identifier consistency across datasets

### 2️⃣ Time-Series Construction (24-Hour Window)
- Converted irregular clinical events into fixed hourly intervals
- Aggregated multiple measurements per hour using statistical summaries
- Ensured temporal alignment across all feature groups

### 3️⃣ ICU Vital Sign Processing
Extracted and normalized:
- Heart Rate  
- Respiratory Rate  
- Mean Arterial Pressure (MAP)  
- SpO₂  
- Body Temperature  

Missing values handled using forward-fill and statistical imputation.

### 4️⃣ Laboratory Feature Engineering
Processed core lab parameters:
- Glucose, Creatinine, WBC, Lactate  
- Sodium, Potassium, Hemoglobin  
- Urea, pH, Cholesterol  

All lab values aligned to the same 24-hour timeline.

### 5️⃣ Medication Feature Encoding
Mapped prescriptions into medication classes:
- Vasopressors
- Sedatives
- Antibiotics
- Insulin

Encoded as **binary indicators per hour**.

### 6️⃣ Fluid Balance Computation
- Extracted fluid input (IV fluids, medications)
- Extracted fluid output (urine output)
- Computed hourly net fluid balance:
Fluid Balance = Total Input − Total Output



  
### 7️⃣ Demographic Feature Integration
- Added static features: Age, Gender
- Replicated across all 24 time steps for time-series compatibility

### 8️⃣ Dataset Assembly
Merged all feature groups into a single multivariate tensor:

- **X** → Time-series feature tensor  
- **y** → Outcome labels (mortality)

**Final Shape:**
(Patients × 24 Hours × Features)

---

## ☑️ Outcome of Milestone-1
- Successfully transformed raw clinical data into a **clean, validated, model-ready dataset**
- Ensured temporal consistency, feature completeness, and label alignment
- Established a solid foundation for **ML/DL model training in subsequent milestones**

---


