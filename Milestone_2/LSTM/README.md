# Attention-Based LSTM for ICU Mortality Prediction

This Jupyter notebook implements an attention-enhanced LSTM model for predicting hospital mortality from 24-hour MIMIC-III ICU time-series data. The model processes 17 features (vitals, labs, meds, fluids) across 24 hourly bins, achieving up to 94.7% validation accuracy.

## Model Architecture

- **Input**: (batch, 24 timesteps, 17 features) – Heart Rate, MAP, Respiratory Rate, Temperature, Glucose, Creatinine, BUN, Sodium, Potassium, Hemoglobin, WBC, Lactate, Fluid Balance, Vasopressors, Sedatives, Antibiotics, Insulin
- **LSTM**: 128 units with return_sequences=True, dropout=0.2
- **Attention**: Custom SimpleAttentionLayer for timestep weighting
- **Dense**: 64 units (ReLU) → Dropout(0.2) → BatchNorm → Sigmoid output
- **Total params**: ~92K


## Training Results

Model trained for 30 epochs on scaled data with class weights for imbalance:


| Epoch | Train Acc | Val Acc | Val Loss | Learning Rate |
| :-- | :-- | :-- | :-- | :-- |
| 10 | 0.7400 | 0.9474 | 0.5163 | 0.001 |
| 15 | 0.8000 | 0.9474 | 0.4407 | 0.001 |
| 20 | 0.7867 | 0.9211 | 0.4451 | 0.0003 |
| 25 | 0.8600 | 0.8684 | 0.4542 | 0.00009 |

Test accuracy: 93.62%

## Key Features

- Handles class imbalance via `compute_class_weight`
- StandardScaler on flattened features
- Callbacks: EarlyStopping (patience=15), ReduceLROnPlateau
- Custom attention layer with tanh → softmax


## Dependencies

```bash
pip install tensorflow pandas numpy scikit-learn matplotlib seaborn
```

Requires `./C/`:

- `xfinal.npy`, `yfinal.npy` (from data prep notebook)


## Usage

1. Load data and model
2. `model.fit(Xtrain_scaled, ytrain, ...)` – trains with validation split
3. `model.save('attention_lstm.h5')`
4. Inference: Trajectory monitoring for patients at 6/12/18/24 hours

## Extensions

- **Trajectory Analysis**: Real-time risk over 24h with status (CRITICAL/WARNING/STABLE)
- **Multi-Task**: LOS prediction head (~0.2 days est.)
- **Diet Pipeline**: Risk-calibrated nutrition plans (e.g., trophic for critical)
- **10 Test Cases**: Diabetes, CKD, etc., generating adaptive diets

Saved artifacts: `attention_lstm.h5`, `trajectory.npy`, `multitaskresults.npy`



