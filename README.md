# AI-NutriCare: Smitha-AI-Nutricare

#  AI-Powered Clinical Decision Support System (CDSS) for ICU Nutrition

Author: Smitha
Status:Completed (Milestone 1 & 2)
Accuracy: ~89.29% (Test Set)

 Project Overview
This project implements an End-to-End AI Pipeline designed to predict patient mortality risk in the Intensive Care Unit (ICU) using the MIMIC-III Dataset. The system analyzes 24 hours of patient data to categorize risk and suggest personalized nutritional interventions (Rule-Based Engine).

##  Milestone 1: Data Engineering & Feature Selection
Goal: Transform raw ICU tables into a clean, time-series tensor for Deep Learning.

### The 18 Critical Features
We extracted 18 clinical signals known to impact mortality, covering hemodynamics, infection, and organ failure:
Vitals: Heart Rate, MAP (Mean Arterial Pressure), Respiratory Rate, Temperature (F), SpO2 (Oxygen Saturation).
Labs: Lactate, WBC, Creatinine, BUN, Sodium, Potassium, Glucose, Hemoglobin.
Fluids/Meds: Total Input, Total Output, Vasopressors, Sedatives, Insulin.

###  Data Pipeline Steps
1. Ingestion: Parsed `chartevents`, `labevents`, and `inputevents` from MIMIC-III.
2. Cleaning: Removed outliers (e.g., HR > 300) and handled units.
3. Imputation: Used Forward-Fill (ffill) to simulate real-time clinical data availability.
4. Transformation: Reshaped data into 3D Tensors: `(Patients, 24 Hours, 18 Features)`.

---

##  Milestone 2: AI Model Development
Goal: Build a robust Time-Series Classifier to predict `Expired` vs `Survived`.

###  Model Architecture: "GRU-Attention"
We utilized a specific architecture optimized for small datasets to prevent overfitting while capturing long-term dependencies.

Input Layer:Receives `(24, 18)` time-series data.
GRU (Gated Recurrent Unit): 64 Units. Chosen over LSTM for efficiency on smaller datasets.
Custom Attention Layer: Learns to "focus" on critical hours (e.g., a drop in BP at Hour 21) while ignoring stable hours.
Regularization: L2 Ridge Regression + Dropout (0.4) + Batch Normalization.
Optimizer: Nadam (Learning Rate 0.0005) with ReduceLROnPlateau.

### Performance Metrics
| Metric | Score | Notes |
| Test Accuracy| 89.29%| High reliability on unseen patients. |
| Training Accuracy | 96.00% | Achieved via Data Augmentation. |
| Robustness | Verified| Passed Negative Testing (Noise Injection). |

### Key Techniques Used
1. Data Augmentation:Added Gaussian Noise to synthetic samples to handle class imbalance.
2. Class Weights:Applied 10:1 penalty for missing "High Risk" cases.
3. Early Stopping:Automatically restored best weights at Epoch 39 to prevent overfitting.

##  How to Run
1. Clone the Repo:
   git clone [https://github.com/PriceOptima-SpringBoard/AI-NutriCare.git](https://github.com/PriceOptima-SpringBoard/AI-NutriCare.git)
