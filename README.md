# AI-NutriCare 
## AI/ML-Based Personalized Diet Plan Generator
AI-NutriCare is an AI/ML-driven platform that analyzes patient medical reports—including numeric measurements and textual doctor notes/prescriptions—and generates personalized diet plans.
Unlike generic diet suggestions, this system considers individual health conditions, allergies, and dietary preferences to provide actionable nutrition guidance.

The platform leverages time-series patient data, lab results, vitals, and medications, applying advanced AI/ML and NLP models to extract meaningful patterns and optimize diet recommendations.

### Problem
Patients often struggle to interpret their medical reports and adjust their diet accordingly. Generic diet recommendations do not account for individual health conditions, leading to ineffective or potentially harmful guidance.
AI-NutriCare bridges this gap by providing a personalized, data-driven diet plan that adapts to the patient’s medical context.

### DataSet Used
> Link - <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg" width="28"/> 
https://www.kaggle.com/datasets/montassarba/mimic-iv-clinical-database-demo-2-2

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
    - `ainutricare-ui`
    - `ReadMe.md`
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

#### 🚀 Milestone-4: Diet Plan Generation & UI Integration
- **objective:**
> Integrate the AI/NLP-generated personalized diet plans into a fully functional user interface. Enable users to view, interact with, and manage daily and weekly dietary recommendations. Connect frontend UI components with backend APIs for real-time data retrieval, diet plan customization, and seamless presentation of nutrition insights.

---

### Tech Stack
| Category                  | Technologies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Programming Language**  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="32"/>                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Data Processing & EDA** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" width="28"/>        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" width="28"/>        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg" width="28"/>        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg" width="28"/>        <img src="https://seaborn.pydata.org/_images/logo-mark-lightbg.svg" width="28"/>  |
| **Machine Learning**      | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" width="28"/>                                                                                                                                                |
| **Deep Learning**         | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" width="28"/>             <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg" width="28"/>                                                                                                                                                                                                                                                                                                 |
| **AI / NLP**              | <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" width="40"/>                                                                                                                                                                                                                                                                                                                        |
| **OCR & Report Parsing**  | <img src="https://skillicons.dev/icons?i=tesseract" width="28"/>  &nbsp; <img src="https://cdn.simpleicons.org/opencv/5C3EE8" width="28"/>                                                                                                                                                                                                                                                                                                                       |
| **Frontend / UI**         | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="28"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="28"/>  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="28"/>   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="28"/>    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="28"/> |
| **Tools & Platforms**     | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="28"/>   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28"/> |


---

## ⚡ How to Run

1. **Clone the Repository**
```bash
git clone https://github.com/PriceOptima-SpringBoard/AI-NutriCare.git
cd AI-NutriCare
```
1. **Create & Activate Virtual Environment**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```
3. **Install dependencies**
```bash
pip install -r requirements.txt
```
4. **Set Environment Variables**
```bash
GEMINI_API_KEY=your_api_key_here
```
5. **Run Backend**
```bash
uvicorn main:app --reload
```
6. **Run Frontend/UI**
- Open frontend folder and run the UI project (React/HTML).
- Ensure it points to backend at http://127.0.0.1:8000.