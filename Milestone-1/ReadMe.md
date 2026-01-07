# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-1
This milestone focuses on data collection, preprocessing, and dynamic time-series dataset creation from medical and ICU data. The output is a structured dataset ready for AI/ML modeling.

### 📂Data Sources used:
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

### 🔧 Key Processing Steps Done:
1️⃣ Data Collection & Filtering
- Selected ICU stays with sufficient data coverage.
- Filtered relevant vitals, labs, fluids, and medications.
- Ensured consistent identifiers (subject_id, stay_id) across datasets.

2️⃣ Time-Series Construction (24-Hour Window)
- Converted irregular clinical events into a fixed 24-hour hourly time-series.
- Aggregated multiple measurements per hour using statistical summaries.
- Ensured uniform temporal alignment across all feature groups.

3️⃣ ICU Vital Sign Processing
- Extracted and normalized key vitals including:
  - Heart Rate
  - Respiratory Rate
  - Mean Arterial Pressure(MAP)
  - SpO₂
  - Body Temperature
- Missing values were handled using forward fill / statistical imputation strategies.

4️⃣ Laboratory Feature Engineering
- Processed core lab parameters such as:
  - Glucose
  - Creatinine
  - WBC
  - Lactate
  - Sodium
  - Potassium
  - Hemoglobin
  - Urea
  - pH
  - Cholesterol
- Lab values were aligned to the same 24-hour timeline as ICU vitals.

5️⃣ Medication Feature Encoding
- Mapped prescribed drugs into clinically meaningful medication classes:
  - Vasopressors
  - Sedatives
  - Antibiotics
  - Insulin
- Encoded medication usage as binary indicators per hour.

6️⃣ Fluid Balance Computation
- Extracted fluid input (IV fluids, medications).
- Extracted fluid output (urine output).
- Computed net fluid balance per hour:
  
             Fluid Balance = Total Input − Total Output

7️⃣ Demographic Feature Integration
- Added static patient features:
  - Age
  - Gender
- These features were replicated across all 24 time steps to maintain time-series compatibility.

8️⃣ Dataset Assembly
- Merged all feature groups into a single multivariate tensor:
  - **Shape: (Patients × 24 hours × Features)**
- Created:

`X`: `Time-series feature tensor`

`y`: `Outcome labels (mortality)`

9️⃣ Data Validation & Consistency Checks
- Verified feature-to-column alignment.
- Ensured consistent sequence length (24 hours).
- Removed ICU stays with incomplete or incompatible data.

Final dataset reflects fully aligned and validated ICU stays.

### 📈Dataset Composition
Each patient/ICU stay is represented as a 24-hour multivariate time-series:
| Feature Group | Examples |
|---------------|----------|
| Vitals | Heart Rate,Respiration Rate, MAP, SpO2, Temperature |
| Labs | Glucose, Creatinine, WBC, Lactate, Sodium, Potassium, Hemoglobin, Urea, pH, Cholesterol |
| Fluids | Fluid Balance [Input(IVs/Medication) - Output(Urine)] |
| Medications | Vasopressors, Sedatives, Antibiotics, Insulin |
| Demographic | Age, Gender |

### 💾Output Artifacts
- Processed feature tensor (X)
- Outcome labels (y)
- Feature name mappings
- Saved intermediate and final datasets for reproducibility

### ☑️Outcome of Milestone-1
- Successfully transformed raw clinical data into a model-ready dataset
- Ensured temporal consistency, feature completeness, and label alignment
- Established a solid foundation for ML/DL model training in subsequent phases














