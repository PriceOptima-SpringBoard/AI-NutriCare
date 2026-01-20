# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-2
#### Focus
> This milestone focuses on training deep learning models on 24-hour ICU time-series data to predict patient outcomes and clinical risk. The goal is to capture
> temporal patterns in critical care data and produce interpretable risk predictions that support downstream nutrition planning and clinical interventions.

---

### 📂 Inputs Used

**1. Model Features**
- Time-series feature tensor (`X`)
  - Shape: `(Patients × 24 × Features)`
  - Contains vitals, labs, medications, fluids, and demographics

**2. Target Variables (`y`)**
- Mortality (binary classification)
- Length of Stay (LOS) — regression *(optional)*
- Nutrition Risk Index (NRI) — derived metric *(optional)*

**3. Feature Metadata**
- Feature name mappings
- Demographic attributes:
  - Age
  - Gender

All inputs are prevalidated and temporally aligned from Milestone 1.

---

### 📌Steps Performed
- [x] Load processed ICU time-series dataset.
- [x] Split data into training and validation sets.
- [x] Build deep learning models for risk prediction.
- [x] Train both single-task and multi-task learning architectures.
- [x] Evaluate model performance over time.
- [x] Generate patient-level risk trajectories.
- [x] Compute derived clinical risk indices (NRI).
- [x] Save trained models and prediction artifacts for downstream simulation.

---
### 📈Outputs Generated
| Output             | Description                                   |
| ------------------ | --------------------------------------------- |
| Trained Models     | Single-task & multi-task deep learning models |
| Risk Trajectories  | Hour-wise mortality risk per patient          |
| NRI Values         | Derived nutrition risk scores                 |
| Evaluation Metrics | Loss trends and validation performance        |
| Saved Artifacts    | `.h5` and `.npy` files for reuse              |

