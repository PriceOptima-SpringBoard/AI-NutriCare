# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-1
This milestone focuses on data collection, preprocessing, and dynamic time-series dataset creation from medical and ICU data. The output is a structured dataset ready for AI/ML modeling.

### Data Sources used:
The EDA integrates multiple clinical data sources:
- ICU Vital Signs (hourly measurements)
- Laboratory Test Results
- Medication & Prescription Records
- Fluid Input & Output Events
- Patient Demographics (age, gender)
- Outcome Labels (mortality)

All data is aligned using ICU stay / subject identifiers to ensure consistency.

### 📌Steps Performed:
- [x] Collect and merge patient medical data from multiple sources (ICU vitals, lab results, fluid balance, prescriptions).
- [x] Preprocess numeric and textual data into a standardized 24-hour time-series format.
- [x] Create medication class indicators for key drug classes.
- [x] Compute fluid balance (input - output).
- [x] Merge all features into a combined dataset (X) for ML.
- [x] Extract patient outcome labels (y) for mortality prediction.
- [x] Save the processed dataset for downstream modeling.

### 📈Dataset Composition
Each patient/ICU stay is represented as a 24-hour multivariate time-series:
| Feature Group | Examples |
|---------------|----------|
| Vitals | Heart Rate,Respiration Rate, Systolic BP, Diastolic BP, SpO2, Temperature |
| Labs | Glucose, Creatinine, WBC, Lactate, Sodium, Potassium, Hemoglobin, Urea |
| Fluids | Input (IVs/Medication), Output (Urine), Fluid Balance (Input - Output) |
| Medications | Vasopressors, Sedatives, Antibiotics, Insulin |






