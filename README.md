
# AI‑NutriCare 🩺🥗

AI‑NutriCare is an end‑to‑end clinical decision support and nutrition planning system. It converts ICU lab reports into structured features, predicts mortality risk with an attention‑based LSTM, and generates personalized, Indian‑cuisine‑aware diet plans via a FastAPI backend.

## ✨ Key Highlights

- 🔍 Robust OCR + regex pipeline for noisy PDF lab reports.  
- 🧠 Attention‑based LSTM model trained on 24‑hour ICU time‑series (MIMIC‑III).  
- 🍱 7‑day personalized diet plans conditioned on risk, biomarkers, and dietary preferences.  
- ⚙️ Clean ETL to generate 24‑hour feature matrices from raw ICU events.  
- 🌐 Production‑ready REST API using FastAPI (ready for React / any frontend).

---

## 📁 Repository Structure

```text
.
├── main.py                     # FastAPI backend (OCR → risk → diet API)
├── OCR_Extraction.ipynb        # OCR & parameter extraction experiments
├── Attention_Based_LSTM.ipynb  # Attention LSTM + multi‑task head (mortality, LOS, nutrition)
├── final_target.ipynb          # MIMIC‑III ETL → 24h feature matrix
└── diet_kb.json                # Food knowledge base (not included in this repo example)
```

- **`main.py`** – Orchestrates OCR, biomarker extraction, LSTM inference, and Gemini‑backed diet generation. Exposes `/plan-diet` and `/plan-diet-manual` endpoints.
- **`Attention_Based_LSTM.ipynb`** – Defines the `SimpleAttention` Keras layer, loads `attention_lstm.h5`, and builds a multi‑task head for LOS and adaptive nutrition.
- **`final_target.ipynb`** – Builds 24‑hour sequences from MIMIC‑III (labs, vitals, inputs, outputs) and saves `processed_mimic_24h_final.csv`.

---

## 🧬 Data \& ETL (MIMIC‑III)

> Note: You are responsible for obtaining and handling MIMIC‑III data according to its license and IRB requirements.

The ETL pipeline in `final_target.ipynb` does the following:

1. Loads raw CSVs from `C:\AINutriCare\Data\Raw` (e.g., `admissions.csv`, `labevents.csv`, `chartevents.csv`, `inputevents_mv.csv`, `outputevents.csv`).
2. Maps ICU item IDs to high‑level concepts (`Glucose`, `MAP`, `Heart Rate`, `Vasopressors`, etc.) using a `CONFIG` dictionary.
3. Computes “hours since admission” and buckets events into 0–24 hour bins.
4. Pivots to an hourly panel indexed by `(hadm_id, hour_bin)` with 17 clinical features.
5. Merges all feature blocks and writes `processed_mimic_24h_final.csv` to `C:\AINutriCare\Data\Transformed`.

---

## 🧠 Model Overview

The modelling code in `Attention_Based_LSTM.ipynb` works roughly as follows:

- Loads inputs `X_final.npy` (shape: `N x 24 x F`) from the transformed data directory.
- Restores a trained attention‑based LSTM from `attention_lstm.h5` with a custom `SimpleAttention` layer.
- Extracts latent representations (penultimate layer) and attaches a small dense head for LOS regression.
- Saves a `multitask_predictions.npy` with patient indices, mortality risk, and predicted LOS, which later feeds into an adaptive nutrition logic block.

This enables multi‑task behaviour: a single time‑series encoder supports both mortality classification and LOS‑driven diet tuning.

---

## 🖥️ FastAPI Backend

The API in `main.py` powers real‑time inference and diet planning.

### Endpoints

#### `POST /plan-diet`

- **Input**:
    - `report`: PDF lab report (`multipart/form-data`).
    - Query params:
        - `diet_type`: `"vegetarian" | "non-vegetarian" | "both"` (default: `"both"`).
        - `region`: Optional `"North" | "South" | "East" | "West" | "North East"`.
- **Pipeline**:

1. OCR with `pdfplumber` → fallback to `pdf2image` + `pytesseract` for image‑only PDFs.
2. Regex “waterfall” extraction for: Glucose, Creatinine, Urea (BUN), Sodium, Potassium, Hemoglobin, WBC, Lactate, pH, Age, Gender, Cholesterol, HbA1c.
3. Feature vector construction and normalization to match LSTM training distribution.
4. Mortality risk prediction via the loaded LSTM model.
5. Clinical JSON with risk bucket, conditions (diabetes, renal stress, hypertension, etc.), and high‑level summary.
6. Diet candidate selection from `diet_kb.json` and 7‑day plan generation using Gemini (`gemini-2.5-flash-lite`) with structured JSON output.


#### `POST /plan-diet-manual`

- **Input (JSON body)**:
    - Required: `glucose`, `creatinine`, `urea_bun`, `sodium`, `potassium`, `cholesterol`
    - Optional: `age`, `gender`, `hemoglobin`, `hba1c`, `preferences` (diet type + region)
- Converts the payload into the same internal parameter format and runs the exact same risk + diet pipeline as `/plan-diet`.

The response for both endpoints merges:

- `clinical`: risk score, conditions, and key interpreted metrics.
- `diet`: 7‑day structured plan (`week_plan`, `total_nutrition`, `medical_reasoning`).

---

## ⚙️ Installation \& Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/<your-username>/ai-nutricare.git
cd ai-nutricare
```


### 2️⃣ Python environment

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

A typical `requirements.txt` would include:

- `fastapi`, `uvicorn`
- `pdfplumber`, `pdf2image`, `pytesseract`
- `numpy`, `pandas`
- `tensorflow` or `tensorflow-gpu`
- `google-genai` (or the official `google` GenAI client)
- `python-multipart` (for file uploads)


### 3️⃣ External dependencies

- **Tesseract OCR**
    - Install Tesseract and verify the path in `main.py` (`pytesseract.pytesseract.tesseract_cmd`).
- **Gemini API key**
    - Set `GEMINI_API_KEY` in your environment; `main.py` will read it at startup.
- **Model \& data artifacts**
    - `attention_lstm.h5` – trained attention LSTM model.
    - `X_final.npy` – feature matrix used to derive normalization stats.
    - `diet_kb.json` – curated food knowledge base with macronutrients and tags.

Place these files at the configured paths in `main.py` or update the constants (`MODEL_PATH`, `SCALER_PATH`, `FOOD_KB_FILE`).

---

## 🚀 Running the API

```bash
uvicorn main:app --reload
```

- Default dev URL: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs` (Swagger UI).

You can now:

- Upload a PDF report to `/plan-diet`.
- POST JSON biomarker values to `/plan-diet-manual`.

---

## 📌 Roadmap Ideas

- ✅ Stabilize 24‑hour ETL and attention‑based LSTM (done).
- 🔄 Fine‑tune LOS head and calibration for real‑world deployment.
- 🧪 Add unit tests for OCR and regex extraction patterns.
- 🌍 Extend cuisine tags beyond Indian (Mediterranean, Western, etc.).
- 📱 Build a React or mobile front‑end for clinicians and patients.

---
