## Executive Summary of Project Milestones

### Project Goal
To build an end-to-end AI pipeline that converts raw patient medical records into medically safe, personalized diet plans by fusing **Clinical NLP**, **Machine Learning**, and **Physiological Simulation**.

## Phase 1: Data Pipeline and Extraction (Completed)

**Objective:**  
Automate the digitization of unstructured medical records.
**Achievement:**  
Developed a PDF parsing engine using `pdfplumber` and regular expressions to extract:
- Patient demographics
- Diagnoses
- Numerical laboratory values (Glucose, Creatinine, Sodium)
The extraction pipeline achieved **greater than 95% accuracy** on structured biomarker recovery.
**Output:**  
Structured JSON patient profiles (`lab_structured_output.json`).

## Phase 2: Physiological Simulation and Safety Validation (Completed)
**Objective:**  
Prevent unsafe or clinically harmful diet recommendations before deployment.

**Achievement:**  
Implemented a metabolic simulation engine capable of predicting the physiological impact of macronutrient intake.

**Mechanism:**  
- Simulates glucose response
- Models renal solute load (BUN)

**Outcome:**  
Automatically flags high-risk diet plans when simulated organ stress is detected (e.g., elevated BUN levels in renal-compromised patients).

## Phase 3: Fusion Engine and Menu Generation (Completed)
**Objective:**  
Integrate biological safety constraints with physician instructions.

**Achievement:**  
Designed a Constraint Fusion Engine that resolves conflicts between:
1. **Hard Constraints:**  
   - Machine learning–derived safety thresholds  
   - Example: Creatinine > 1.5 → Low-protein diet
2. **Soft Constraints:**  
   - Doctor notes interpreted using clinical NLP
**Output:**  
A constraint-aware menu generation algorithm that filters the **ICMR-NIN Food Database** to produce medically safe daily meal plans.


## Phase 4: Advanced AI Integration (Completed)
**Objective:**  
Enable semantic understanding of clinical instructions beyond keyword matching.
**Achievement:**  
Integrated **Meta’s BART-Large-MNLI** zero-shot transformer model to interpret ambiguous or implicit doctor notes.
**Capability:**  
- Detects latent dietary constraints (e.g., “Monitor fluid intake” implies fluid restriction)
- Provides probability-based classification for safety validation
**Design Choice:**  
Selected over generative LLMs (e.g., GPT, LLaMA) to ensure deterministic, hallucination-free medical decision-making.
-

## Phase 5: Automated Reporting and Outputs (Completed)
**Objective:**  
Deliver professional-grade outputs suitable for both clinicians and patients.
**Achievement:**  
Built an automated PDF reporting engine that generates:
- **Patient Menu Card:** Simplified, patient-friendly meal plans
- **Clinical Report:** Detailed summaries including extraction confidence, risk scores, and AI decision logic


## Technology Stack

- Python
- Pandas
- NumPy
- PyTorch
- Hugging Face Transformers (BART-Large-MNLI)
- PDFPlumber

## Data Source
- ICMR–NIN Indian Food Composition Tables (2017)
