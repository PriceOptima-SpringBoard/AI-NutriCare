# 🧠 AI-NutriCare  
## AI/ML-Powered Personalized Diet Plan Generator  

**AI-NutriCare** is an intelligent, AI/ML-driven platform that generates **personalized diet plans** by analyzing comprehensive patient medical data — including **numeric lab measurements, doctor prescriptions, and textual clinical notes**.  
Unlike traditional diet suggestions, **AI-NutriCare** creates tailored nutrition plans that consider each individual’s **health conditions, allergies, and food preferences**, delivering accurate and actionable dietary recommendations.  

---

## 🚀 Overview  

AI-NutriCare integrates **Artificial Intelligence (AI)**, **Machine Learning (ML)**, and **Natural Language Processing (NLP)** to process both **structured** (e.g., lab values, vitals) and **unstructured** (e.g., doctor notes) medical data.  
By leveraging **time-series data** from medical histories, the system identifies meaningful trends in a patient’s health parameters and generates **optimized diet recommendations** aligned with medical needs.  

---

## 💡 Problem Statement  

Interpreting complex medical reports and translating them into daily nutrition choices is often challenging for patients.  
Most existing diet plans are **generic** and **ignore the individual’s medical background**, which can lead to **ineffective or even harmful dietary outcomes**.  

**AI-NutriCare** addresses this challenge by:  
- Automatically analyzing and interpreting medical reports using AI/ML models.  
- Extracting key health and nutritional insights from clinical data.  
- Delivering customized diet plans designed around personal medical and lifestyle factors.  

---

## 📊 Dataset Used  

**Dataset Source:** [MIMIC-IV Clinical Database Demo (Kaggle)](https://www.kaggle.com/datasets/montassarba/mimic-iv-clinical-database-demo-2-2) 

---

### 📂 Repository Structure
- AI-NutriCare/
  - `Dataset/`
  - `Milestone_1/`
    - Data_Collection_and Preprocessing.ipynb`
    - `ReadMe.md`
  - `Milestone_2/`
    - `ML_based_Health_Analysis.ipynb`
    - `ReadMe.md`
  - `Milestone_3/`
    - `NLP_AI_Text_Interpretation.ipynb`
    - `Final_Patient_Report.json`
    - `weekly_diet_plan.json`
    - `ReadMe.md`
  - `Milestone_4/`
  - `README.md`

---

## 📆 Project Milestones  

### 🧩 Milestone 1: Data Collection and Preprocessing  
**Objective:** Gather and preprocess patient data from ICU and general hospital sources to form dynamic time-series datasets.  

**Key Tasks:** - Extract, clean, and standardize data for modeling.  
- Handle missing values, data normalization, and feature creation.  

**Outcome:** - A structured, high-quality dataset ready for machine learning applications.  

---

### 🤖 Milestone 2: ML-Based Health Analysis  
**Objective:** Apply AI and ML models to derive insights from patient data and predict personalized nutritional needs.  

**Key Tasks:** - Train predictive models to detect health risks and dietary requirements.  
- Utilize NLP to analyze doctor notes and prescriptions.  
- Identify nutrition-related factors from medical patterns.  

**Outcome:** - Extraction of health indicators and generation of nutrition-driven insights that form the base for personalized diet plans.  

---

### 🧠 Milestone 3: NLP/AI Text Interpretation & Diet Generation
**Objective:** Build an automated system to convert raw clinical PDFs and lab results into a 7-day ICU-safe Indian diet plan using Deep Learning and LLMs.

**Key Tasks:** - **Intelligent PDF Parsing:** Used `pdfplumber` and `Tesseract OCR` to extract 22 critical features (Vitals, Labs, Interventions) from clinical reports.
- **Risk Prediction:** Implemented a **TensorFlow LSTM** model to predict mortality risk (Low/Moderate/High) based on 24-hour time-series data sequences.
- **Clinical Rule Engine:** Developed logic to map raw values (Glucose, pH, Creatinine) to dietary objectives and clinical findings.
- **Generative AI Synthesis:** Utilized **Google Gemini 2.5 Flash** to generate a structured 7-day Indian meal plan in JSON format.

**Outcome:** - Automated generation of `Final_Patient_Report.json` and `weekly_diet_plan.json` .

---

### 🌐 Milestone 4: Diet Plan Generation and UI Integration
**Objective:** Deploy the platform as a web-based application for patients and clinicians. 

**Key Tasks:** - Development of a web interface for report uploading and plan visualization.  
- Integration of **real-time patient monitoring** and **adaptive diet modification** based on ongoing health updates.




