# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-1
This milestone focuses on data collection, preprocessing, and dynamic time-series dataset creation from medical and ICU data. The output is a structured dataset ready for AI/ML modeling.

### 📂 Data Sources Used
- ICU Vitals (hourly)
- Laboratory Results
- Medications & Prescriptions
- Fluid Input / Output
- Patient Demographics (Age, Gender)
- Outcome Labels (Mortality)

_All sources aligned using `subject_id` and `stay_id`._

---

### 📌Steps Performed:
- [x] Collect and merge patient medical data from multiple sources (ICU vitals, lab results, fluid balance, prescriptions).
- [x] Preprocess numeric and textual data into a standardized 24-hour time-series format.
- [x] Create medication class indicators for key drug classes.
- [x] Compute fluid balance (input - output).
- [x] Merge all features into a combined dataset (X) for ML.
- [x] Extract patient outcome labels (y) for mortality prediction.
- [x] Save the processed dataset for downstream modeling.

---
## 🔧 Key Processing Steps Done

| Step | Processing Stage | Description | Output |
|------|------------------|-------------|--------|
| 1 | Data Selection & Filtering | Selected ICU stays with sufficient data coverage; ensured consistent subject and stay identifiers | Clean ICU cohort |
| 2 | Time-Series Alignment | Converted irregular clinical events into fixed 24-hour hourly time bins | Uniform time index |
| 3 | Vital Sign Processing | Normalized HR, RR, MAP, SpO₂, and Temperature; handled missing values via imputation | Vitals time-series |
| 4 | Laboratory Feature Engineering | Aligned core lab parameters (Glucose, Creatinine, WBC, Lactate, Electrolytes) to 24-hour window | Lab time-series |
| 5 | Medication Encoding | Mapped prescribed drugs to clinical classes; encoded hourly binary indicators | Medication features |
| 6 | Fluid Balance Computation | Computed hourly net fluid balance (Total Input − Total Output) | Fluid features |
| 7 | Demographic Integration | Added age and gender; replicated across all time steps | Static features |
| 8 | Dataset Assembly | Merged all feature groups into multivariate tensor `(Patients × 24 × Features)` | Feature tensor (X) |
| 9 | Validation & Quality Checks | Verified sequence length, feature alignment, and data completeness | Model-ready dataset |

---

### 📈Dataset Composition
Each patient/ICU stay is represented as a 24-hour multivariate time-series:
| Feature Group | Examples |
|---------------|----------|
| Vitals | Heart Rate,Respiration Rate, MAP, SpO2, Temperature |
| Labs | Glucose, Creatinine, WBC, Lactate, Sodium, Potassium, Hemoglobin, Urea, pH, Cholesterol |
| Fluids | Fluid Balance [Input(IVs/Medication) - Output(Urine)] |
| Medications | Vasopressors, Sedatives, Antibiotics, Insulin |
| Demographic | Age, Gender |

### 💾 Output
- Feature tensor (`X`)
- Outcome labels (`y`)
- Feature mappings
- Reproducible saved datasets

### ☑️ Outcome of Milestone-1
- Raw ICU data → model-ready time-series dataset  
- Temporal consistency and label alignment ensured  
- Ready for ML/DL training in Milestone-2





















