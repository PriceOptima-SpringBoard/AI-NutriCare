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

---

### Repository Structure
- AI-NutriCare/
  - `Dataset`
  - `Milestone_1/`
    - `Milestone-1: Data Collection and Preprocessing.ipynb`
    - `Milestone_1_Outputs`
    - `ReadMe.md`
  - `Milestone_2/`
    - `Milestone-2: ML Based Health Analysis.ipynb`
    - `Milestone_2_Outputs`
    - `ReadMe.md`
  - `Milestone_3/`
    - `Milestone-3: NLP/AI Text Interpretation.ipynb`
    - `Milestone_3_Outputs`
    - `diet_kb_datasets`
    - `ReadMe.md`
  - `Milestone_4/`
  - `README.md`
---

###  MILESTONES

#### 🎯 Milestone-1: Data Collection & Time-Series Preprocessing
- **Objective:**
> Ingest, clean, and harmonize multi-source ICU and patient data into fixed-length (24-hour) multivariate time-series suitable for ML/DL modeling.

#### 🎯 Milestone-2: Machine Learning–Based Health Analysis
- **Objective:**
> Train deep learning models on ICU time-series data to learn temporal patterns and predict patient outcomes and clinical risk for downstream nutrition and
> intervention planning.

#### 🧠 Milestone-3: AI/NLP Text Interpretation
- **Objective:**
> Transform model-predicted clinical risks and structured patient data into medically safe, personalized diet plans using AI/NLP, clinical rule enforcement, and a nutrition knowledge base, generating explainable daily and weekly dietary recommendations for downstream frontend delivery.

---

### Tech Stack
| Category                  | Technologies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Programming Language**  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="32"/> **Python**                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Data Processing & EDA** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" width="28"/> Pandas   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" width="28"/> NumPy   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg" width="28"/> SciPy   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" width="28"/> Matplotlib   <img src="https://seaborn.pydata.org/_images/logo-mark-lightbg.svg" width="28"/> Seaborn |
| **Machine Learning**      | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" width="28"/> Scikit-learn   <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/XGBoost_logo.png" width="45"/> XGBoost   <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/LightGBM_logo_black_text.svg" width="45"/> LightGBM                                                                                                                                                                                        |
| **Deep Learning**         | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" width="28"/> TensorFlow   <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg" width="28"/> Keras (LSTM, Attention)                                                                                                                                                                                                                                                                                                  |
| **AI / NLP**              | <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" width="40"/> Gemini-Flash 2.5   <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" width="28"/> BERT                                                                                                                                                                                                                                                                                                                           |
| **OCR & Report Parsing**  | <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Tesseract_OCR_logo.png" width="40"/> Tesseract OCR   <img src="https://raw.githubusercontent.com/JaidedAI/EasyOCR/master/easyocr.png" width="40"/> EasyOCR                                                                                                                                                                                                                                                                                                                       |
| **Frontend / UI**         | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="28"/> React (Dashboard & Visualization)                                                                                                                                                                                                                                                                                                                                                                                                          |


