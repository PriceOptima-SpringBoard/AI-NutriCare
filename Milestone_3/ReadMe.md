# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-3
> #### Focus: This milestone focuses on generating clinically safe, personalized diet plans using AI by combining patient medical data, nutrition knowledge, and rule-based medical constraints.

---

## 🧠 Inputs Used

- Model predictions (mortality / nutrition risk scores)
- Processed ICU & clinical data (from Milestone-1)
- Extracted lab values (Glucose, Creatinine, Sodium, Cholesterol, etc.)
- Patient metadata (Age, Gender)
- Diet Knowledge Base (Indian foods with nutrition values)

All inputs are dynamically consumed to ensure **patient-specific recommendations**.

---
## 📌 Steps Performed

1. Ingest patient clinical metrics and ML risk outputs.
2. Apply medical threshold-based constraints (renal, diabetic, cardiac safety).
3. Query diet knowledge base for nutritionally suitable Indian meals.
4. Generate meal-wise diet plans (Breakfast, Lunch, Dinner, Snacks).
5. Compute per-meal and total nutritional values.
6. Generate weekly meal variations while maintaining safety constraints.
7. Aggregate weekly nutrition statistics.
8. Generate consolidated grocery list from weekly meals.
9. Output structured JSON for frontend/API consumption.
