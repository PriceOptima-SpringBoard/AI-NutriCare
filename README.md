# AI-NutriCare 
## AI/ML-Based Personalized Diet Plan Generator
AI-NutriCare is an AI/ML-driven platform that analyzes patient medical reports—including numeric measurements and textual doctor notes/prescriptions—and generates personalized diet plans.
Unlike generic diet suggestions, this system considers individual health conditions, allergies, and dietary preferences to provide actionable nutrition guidance.

The platform leverages time-series patient data, lab results, vitals, and medications, applying advanced AI/ML and NLP models to extract meaningful patterns and optimize diet recommendations.

### Problem
Patients often struggle to interpret their medical reports and adjust their diet accordingly. Generic diet recommendations do not account for individual health conditions, leading to ineffective or potentially harmful guidance.
AI-NutriCare bridges this gap by providing a personalized, data-driven diet plan that adapts to the patient’s medical context.

### DataSet Used
Link - https://www.kaggle.com/datasets/montassarba/mimic-iv-clinical-database-demo-2-2

### Repository Structure
- AI-NutriCare/
  - `Dataset`
  - `Milestone_1/`
    - `Milestone-1: Data Collection and Preprocessing.ipynb`
    - `ReadMe.md`
  - `Milestone_2/`
    - `Milestone-2: ML Based Health Analysis.ipynb`
    - `ReadMe.md`
  - `Milestone_3/`
  - `Milestone_4/`
  - `README.md`

### MILESTONES

#### Milestone-1: Data Collection & Time-Series Preprocessing
- **Objective:**
> Ingest, clean, and harmonize multi-source ICU and patient data into fixed-length (24-hour) multivariate time-series suitable for ML/DL modeling.

#### Milestone-2: Machine Learning–Based Health Analysis
- **Objective:**
> Train deep learning models on ICU time-series data to learn temporal patterns and predict patient outcomes and clinical risk for downstream nutrition and
> intervention planning.
