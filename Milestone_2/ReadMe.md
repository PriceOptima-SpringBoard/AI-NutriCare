# 🧠 AI-NutriCare  
## AI/ML-Based Personalized Diet Plan Generator  

---

## 🎯 Milestone-2: ML-Based Health Analysis  

This milestone focuses on **training deep learning models** on **ICU time-series data** to predict **patient outcomes and clinical risk factors**.  
The objective is to **learn temporal patterns** from 24-hour ICU data and generate **interpretable risk predictions** that can guide **personalized nutrition and intervention planning**.

---

### 📂 Inputs Used  

This milestone utilizes the **processed outputs from Milestone-1 (EDA & Preprocessing)**, including:  

- **Time-Series Feature Tensor (X):**  
  - Shape: *(Patients × 24 hours × Features)*  
- **Outcome Labels (y):**  
  - *Mortality* (binary classification)  
  - *Length of Stay (LOS)* — regression (optional)  
  - *Nutrition Risk Index (NRI)* — derived metric  
- **Feature Mappings:**  
  - Demographic Features:  
    - Age  
    - Gender  

All inputs are **prevalidated**, **standardized**, and **temporally aligned** from Milestone 1 to ensure consistency.

---

### 📌 Steps Performed  

- [x] Load preprocessed ICU time-series dataset.  
- [x] Split data into training and validation subsets.  
- [x] Build **deep learning models** for risk prediction.  
- [x] Train both **single-task** and **multi-task learning** architectures.  
- [x] Evaluate model performance over temporal sequences.  
- [x] Generate **patient-level risk trajectories**.  
- [x] Compute derived **clinical risk indices (NRI)**.  
- [x] Save trained models and prediction artifacts for downstream simulation and diet plan generation.  

---


**📁 Folder:** `AI-NutriCare/Milestone_2/`  
**Main Notebook:** `ML_based_Health_Analysis.ipynb`  

---

