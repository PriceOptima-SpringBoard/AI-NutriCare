

# 🎯 Milestone-3


##  Objective

This milestone focuses on developing a **clinically safe, AI-driven personalized diet planning system** by integrating patient medical data, machine-learning risk scores, nutrition intelligence, and rule-based medical constraints.

The goal is to transform raw clinical and ML outputs into **actionable, patient-specific diet recommendations**.


## Data Inputs Utilized


| Input Category         | Details                                              |
| ---------------------- | ---------------------------------------------------- |
| ML Model Outputs       | Mortality risk score, nutrition risk score           |
| ICU & Clinical Records | Processed patient data from Milestone-1              |
| Laboratory Parameters  | Glucose, Creatinine, Sodium, Cholesterol, etc.       |
| Patient Profile        | Age, Gender                                          |
| Diet Knowledge Base    | Indian food items with macro & micro-nutrient values |

All inputs are dynamically consumed to generate **condition-aware and personalized** diet plans.

##  Processing Pipeline

1. [x] Ingested patient vitals, lab values, and ML risk predictions.
2. [x] Applied rule-based medical constraints (renal, diabetic, cardiac safety).
3. [x] Filtered nutritionally suitable meals from the Indian diet knowledge base.
4. [x] Generated meal-wise diet plans (Breakfast, Lunch, Dinner, Snacks).
5. [x] Calculated nutrition values per meal and per day.
6. [x] Created weekly diet variations while maintaining safety rules.
7. [x] Computed weekly nutrition aggregates and trends.
8. [x] Built a consolidated grocery list from weekly meal plans.
9. [x] Exported structured JSON outputs for API / frontend usage.


##  Weekly Nutrition Overview

| Metric                      | Description                              |
| --------------------------- | ---------------------------------------- |
| Total Weekly Calories       | Total calorie intake over 7 days         |
| Average Daily Protein       | Mean daily protein consumption           |
| Average Daily Fat           | Mean daily fat consumption               |
| Average Daily Carbohydrates | Mean daily carbohydrate intake           |
| Macro Balance Score         | Indicator of overall nutritional balance |

This supports **long-term dietary tracking and adaptive diet plan tuning**.


##  Key Results of Milestone-3

* ML risk scores successfully converted into actionable diet plans
* Clinical safety ensured using a hybrid AI + rule-based approach
* Indian dietary preferences preserved with medical correctness
* Output ready for frontend dashboards and personalization layers



##  Readiness & Next Steps

* Fully structured JSON outputs ready for API consumption
* Designed for seamless frontend integration
* Supports dynamic personalization and future rule extensions


## Output Artifacts

* `daily_diet_plan.json`
* `weekly_diet_plan.json`
