# AI-ML Based Personalized Diet Plan Generator
## 🎯Milestone-3
> #### Focus: This milestone focuses on generating clinically safe, personalized diet plans using AI by combining patient medical data, nutrition knowledge, and rule-based medical constraints.

---

## 🧠 Inputs Used

| Input Type | Description |
|----------|------------|
|  Model Predictions | Mortality and nutrition risk scores |
|  ICU & Clinical Data | Processed patient data from Milestone-1 |
|  Lab Values | Glucose, Creatinine, Sodium, Cholesterol, etc. |
|  Patient Metadata | Age, Gender |
|  Diet Knowledge Base | Indian food items with nutrition values |

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

---
## 📈 Weekly Nutrition Summary

The system generates:
- Total weekly calories
- Average daily protein, fat, and carbohydrates
- Macro balance indicators

This enables **long-term diet monitoring and adjustment**.

---
## ☑️ Outcomes

- ML predictions successfully translated into actionable diet plans
- Medical safety enforced via rule-based + AI hybrid approach
- Indian diet patterns preserved with clinical correctness
- Ready for frontend integration and user-level personalization
