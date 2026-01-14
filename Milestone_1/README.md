AI-NutriCare: Smitha-AI-Nutricare
AI-Powered Clinical Decision Support System (CDSS) for ICU Nutrition
Author: Smitha Status:Completed (Milestone 1 & 2) Accuracy: ~89.29% (Test Set)

Project Overview This project implements an End-to-End AI Pipeline designed to predict patient mortality risk in the Intensive Care Unit (ICU) using the MIMIC-III Dataset. The system analyzes 24 hours of patient data to categorize risk and suggest personalized nutritional interventions (Rule-Based Engine).

Milestone 1: Data Engineering & Feature Selection
Goal: Transform raw ICU tables into a clean, time-series tensor for Deep Learning.

The 18 Critical Features
We extracted 18 clinical signals known to impact mortality, covering hemodynamics, infection, and organ failure: Vitals: Heart Rate, MAP (Mean Arterial Pressure), Respiratory Rate, Temperature (F), SpO2 (Oxygen Saturation). Labs: Lactate, WBC, Creatinine, BUN, Sodium, Potassium, Glucose, Hemoglobin. Fluids/Meds: Total Input, Total Output, Vasopressors, Sedatives, Insulin.

Data Pipeline Steps
Ingestion: Parsed chartevents, labevents, and inputevents from MIMIC-III.
Cleaning: Removed outliers (e.g., HR > 300) and handled units.
Imputation: Used Forward-Fill (ffill) to simulate real-time clinical data availability.
Transformation: Reshaped data into 3D Tensors: (Patients, 24 Hours, 18 Features).
