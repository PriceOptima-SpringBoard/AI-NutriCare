# MIMIC-III 24h ICU Mortality Prediction Data Prep

This repository contains a Jupyter notebook (`final_target.ipynb`) for processing MIMIC-III ICU dataset into time-series features for hospital mortality prediction. The script extracts hourly vital signs, labs, medications, and fluid balance over the first 24 hours of ICU stays, aligning them with mortality labels.

## Features Processed

The ETL pipeline handles these key features:

- **Vitals**: Heart Rate, MAP (Mean Arterial Pressure), Respiratory Rate, Temperature
- **Labs**: Glucose, Creatinine, BUN, Sodium, Potassium, Hemoglobin, WBC, Lactate
- **Medications** (binary/amount): Vasopressors, Sedatives, Antibiotics, Insulin
- **Fluids**: Fluid Balance (Input - Output)

Output: 17 features per hour for ~24 hours per patient stay, saved as `processed_mimic_24h_final.csv`.

## Output Datasets

- `xfinal.npy`: Shape (n_patients, 24, 17) – 3D time-series for LSTM/CNN models
- `yfinal.npy`: Binary labels (0=survived, 1=died in hospital)

Data is sorted by patient and hour, with missing values filled (ffill for labs, 0 for meds/vitals).

## Requirements

```bash
pip install pandas numpy matplotlib seaborn
```

MIMIC-III CSV files required in `./C/` directory:

- `admissions.csv`
- `labevents.csv`
- `chartevents.csv`
- `inputevents_mv.csv`
- `outputevents.csv` 


## Usage

1. Place raw MIMIC-III CSVs in `./C/`
2. Run notebook cells sequentially:
    - Configuration and helpers
    - Process labs/vitals/meds/fluids → `processed_mimic_24h_final.csv`
    - Load processed data, align labels → `Xfinal.npy`, `yfinal.npy`
3. Use datasets for ML training (e.g., LSTM for mortality prediction)

Handles class imbalance (mostly survivors) – apply weights in training.

## Notes

- Filters to first 24 hours post-admission
- Pivots time-series with mean aggregation


