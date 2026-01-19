# Milestone_3: NLP/AI Text Interpretation

## 🎯 Objective
An automated clinical decision support system that converts **unstructured medical PDFs** and doctor notes into **7-day ICU-safe Indian diet plans**. This project bridges deep learning mortality predictions with the generative power of **Google Gemini 2.5 Flash**.

---

## ⚙️ Technical Pipeline
The system operates through a specialized four-stage pipeline:

1. **Intelligent Extraction**: Orchestrates `pdfplumber` and `Tesseract OCR` to parse 22 critical clinical features (Vitals, Labs, Interventions) from raw patient reports.
2. **Risk Prediction (LSTM)**: A `TensorFlow` based LSTM model analyzes 24-hour temporal data sequences to predict mortality risk (Low/Moderate/High).
3. **Clinical Rule Engine**: Interprets raw biochemical markers (e.g., Glucose, Creatinine, pH) to map numerical data to medical constraints.
4. **Diet Generation (Gemini 2.5 Flash)**: Leverages the `google-generativeai` SDK to synthesize structured, recovery-focused Indian meal plans in JSON format.



---

## ✨ Key Features
- **Powered by Gemini 2.5 Flash**: Optimized for high-speed, low-latency generation of medically complex dietary plans.
- **Medical Safety First**: Hybrid logic ensures AI-generated diets strictly adhere to clinical bounds (e.g., Diabetic/Renal-safe protocols).
- **OCR Fallback**: Robust processing for both digital and scanned (image-based) medical reports via `pytesseract`.
- **Cultural Customization**: Specifically tuned for Indian recovery diets (e.g., Moong Dal Khichdi, Buttermilk).
- **JSON Interoperability**: Generates machine-readable outputs for seamless frontend or mobile app integration.

---

## 🛠 Tech Stack
* **LLM**: Google Gemini 2.5 Flash (`google-generativeai`)
* **AI/ML**: TensorFlow (LSTM), Keras
* **NLP & Parsing**: PyPDF2, pdfplumber, Pytesseract (OCR)
* **Data Science**: Pandas, NumPy, Scikit-learn

---

## 📊 Outputs
The system generates two primary structured documents:
* `Final_Patient_Report.json`: A unified summary of clinical findings and LSTM risk scores.
* `weekly_diet_plan.json`: A complete 7-day, meal-by-meal nutritional roadmap.

---

## 🚀 How It Works
The pipeline ingests a patient report, normalizes clinical features for the LSTM model, determines the patient's severity risk, and then prompts Gemini with these specific constraints to build a medically sound, culturally relevant diet roadmap.
