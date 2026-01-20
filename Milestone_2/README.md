##  Milestone 2 – ICU Time-Series Risk Prediction

---

##  Project Overview
This milestone focuses on developing deep learning models using 24-hour ICU time-series data to predict patient outcomes and clinical risk. By capturing temporal patterns in critical care data, the system generates interpretable risk predictions that serve as a foundation for personalized nutrition planning and clinical decision support.

---

##  Input Data

### 1. Time-Series Features
- **Input Tensor (`X`)**
  - Shape: `(Patients × 24 × Features)`
  - Contains vital signs, laboratory values, medications, fluid intake, and demographic information

### 2. Target Variables (`y`)
- Mortality (binary classification)
- Length of Stay (LOS) *(optional regression task)*
- Nutrition Risk Index (NRI) *(optional derived metric)*

### 3. Metadata
- Feature name mappings
- Demographic attributes:
  - Age
  - Gender

> All inputs are preprocessed, validated, and temporally aligned from **Milestone 1**.

---

## Methodology
- Loaded the processed ICU time-series dataset  
- Split data into training and validation sets  
- Designed deep learning architectures for clinical risk prediction  
- Trained both single-task and multi-task learning models  
- Evaluated model performance across temporal sequences  
- Generated patient-specific risk trajectories  
- Computed derived Nutrition Risk Index (NRI) values  
- Saved trained models and prediction artifacts for reuse  

---

##  Outputs

| Output | Description |
|------|-------------|
| Trained Models | Single-task and multi-task deep learning models |
| Risk Trajectories | Hour-wise mortality risk predictions |
| NRI Scores | Derived nutrition risk indices |
| Evaluation Metrics | Training loss and validation performance |
| Saved Artifacts | `.h5` and `.npy` files for downstream use |

---

## Outcomes
- Successfully trained deep learning models on ICU time-series data  
- Generated dynamic and interpretable patient risk predictions  
- Established a strong foundation for adaptive nutrition simulation  
- Enabled closed-loop clinical decision modeling for future milestones  

