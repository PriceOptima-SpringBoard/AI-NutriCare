# AI/ML-Based Personalized Diet Plan Generator

##  Milestone 1: Data Collection & Preprocessing

This milestone focuses on **collecting, cleaning, and structuring ICU and clinical data** into a **24-hour multivariate time-series dataset** ready for AI/ML modeling.

---

###  Data Sources

* ICU vital signs (hourly)
* Laboratory test results
* Medications & prescriptions
* Fluid input/output events
* Patient demographics (age, gender)
* Outcome labels (mortality)

> All data aligned using ICU stay/subject identifiers.

---

###  Steps

* Aggregate and merge patient data from multiple sources
* Preprocess numeric/text data into **standardized 24-hour time-series**
* Encode medications by class and compute hourly fluid balance
* Merge features into `X` (tensor) and extract `y` (labels)
* Save processed datasets for downstream modeling

---

###  Key Processing

* **Time-series construction:** Convert irregular events to fixed 24-hour sequences
* **Vitals & Labs:** Normalize key measurements and handle missing values
* **Medications:** Encode as hourly binary indicators
* **Fluids:** Compute `Fluid Balance = Total Input − Output`
* **Demographics:** Replicate age/gender across time steps
* **Validation:** Ensure alignment and remove incomplete ICU stays

---

###  Dataset Composition

| Feature Group | Examples                                                                                |
| ------------- | --------------------------------------------------------------------------------------- |
| Vitals        | Heart Rate, Respiration Rate, MAP, SpO₂, Temp                                           |
| Labs          | Glucose, Creatinine, WBC, Lactate, Sodium, Potassium, Hemoglobin, Urea, pH, Cholesterol |
| Fluids        | Net fluid balance                                                                       |
| Medications   | Vasopressors, Sedatives, Antibiotics, Insulin                                           |
| Demographics  | Age, Gender                                                                             |

---

###  Output

* Feature tensor `X`
* Outcome labels `y`
* Feature mappings
* Saved datasets for reproducibility

---

###  Outcome

* Raw clinical data → **model-ready dataset**
* Temporal consistency and feature completeness ensured
* Ready for ML/DL model training

