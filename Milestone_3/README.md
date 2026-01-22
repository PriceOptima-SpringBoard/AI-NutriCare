# Milestone 3 – Attention‑Based LSTM & Adaptive Nutrition

Milestone 3 focuses on training and using an attention‑based LSTM model on 24‑hour ICU time‑series to predict mortality risk, derive latent representations, and drive adaptive, clinically informed nutrition targets.

---

## Scope of Milestone 3

- Uses preprocessed 24‑hour ICU feature tensors `X_final.npy` and labels `y_final.npy` generated in Milestone 2.  
- Trains an attention‑based LSTM mortality model with a custom `SimpleAttention` layer.  
- Extracts latent features and attaches a new head for length‑of‑stay (LOS) regression.  
- Builds risk trajectories over time (6h, 12h, 18h, 24h) for selected patients.  
- Converts model outputs into adaptive calorie, protein, fluid, and route recommendations.

---

## Data Inputs

From the ETL step, Milestone 3 expects:

- `processed_mimic_24h_final.csv` – hourly features per `hadm_id` and `hour_bin`.  
- `X_final.npy` – shape `(N, 24, F)` where:
  - 24 = hours since admission  
  - F = 17 features (vitals, labs, meds, fluid balance)  
- `y_final.npy` – binary labels (0 = survived, 1 = expired).

These are produced in the notebook sections that:

- Align admissions labels with time‑series rows.  
- Reshape to `(patients, 24, features)` and save `.npy` files.  

---

## Model Architecture

The core model is:

- Input: `(24, num_features)` time‑series tensor.  
- LSTM layer with increased units (e.g., 128) and tuned dropout.  
- `SimpleAttention` custom layer:
  - Learns attention weights across 24 time steps.  
  - Returns a context vector (weighted sum of hidden states).  
- Dense → Dropout → BatchNorm → Sigmoid output for mortality probability.  

Training details:

- Loss: binary cross‑entropy.  
- Metrics: accuracy.  
- Class weights to handle label imbalance.  
- Early stopping and ReduceLROnPlateau on validation accuracy.  
- Final test accuracy in the low‑to‑mid 90% range on the held‑out set.  

The trained model is saved as `attention_lstm.h5` for downstream use.

---

## Multi‑Task Extension (LOS & Risk Trajectory)

### Latent feature extractor

A separate section builds a feature extractor:

- Loads `attention_lstm.h5` with the `SimpleAttention` custom object.  
- Defines a Keras `Model` whose output is the penultimate layer (e.g., BatchNorm before final sigmoid).  
- Produces a latent vector (e.g., 64‑dim) per patient.

### LOS head

On top of latent features, Milestone 3 defines:

- A small `Sequential` model:
  - `Input(latent_dim)` → `Dense(16, relu)` → `Dense(1, linear)`  

This acts as a proxy LOS regressor (demonstration; not fully trained).

Both mortality risk and LOS are combined into a structured prediction array:

- `patient_indices`  
- `mortality_risk`  
- `predicted_los`  
- Optionally `latent_vectors`  

Saved to `multitask_predictions.npy`.

### Risk trajectory over time

Another script simulates **real‑time monitoring**:

- Masks future hours and predicts at checkpoints (6h, 12h, 18h, 24h).  
- Logs a table like:
  - `6 Hours: risk p, status`  
  - `12 Hours: risk p, status`  
- Classifies trend as:
  - Deteriorating (risk ↑ > 0.10)  
  - Improving (risk ↓ < −0.10)  
  - Stable (otherwise).  

A line plot visualizes the trajectory and thresholds (0.15 warning, 0.50 critical).

---

## Nutrition Logic (From Model to Diet Targets)

Milestone 3 connects predictions to **numeric nutrition targets**:

1. **Risk stratification**  
   - High: risk > 0.50 (critical).  
   - Moderate: risk > 0.15.  
   - Low: else.

2. **Baseline ICU parameters**  
   - Calories: ~25 kcal/kg/day.  
   - Protein: ~1.2 g/kg/day.  
   - Fluids: ~30 ml/kg/day.  
   - Assumed weight: e.g., 75 kg.

3. **Risk‑adjusted factors**  
   - High risk:
     - Caloric factor ~0.8 (permissive underfeeding).  
     - Protein factor ~1.3 (catabolic support).  
     - Fluid factor ~0.8 (restriction).  
   - Moderate:
     - Standard 25 kcal/kg, slightly higher protein.  
   - Low:
     - Slightly higher calories for anabolic recovery.  

4. **Renal safety & LOS logic**  
   - Long LOS + high risk → cap protein factor to avoid renal overload.  

5. **Route recommendation**  
   - High: Parenteral or trophic enteral.  
   - Moderate: Enteral (tube feeding).  
   - Low: Oral high‑energy soft diet.

The final **Milestone 3 plan object** commonly includes:

- `Risk_Profile` (mortality risk, LOS, category).  
- `Adaptive_Adjustments` (caloric/protein factors, base weight).  
- `Nutritional_Targets` (kcal/day, g protein/day, fluid limit).  
- `Recommended_Route` (oral vs enteral vs parenteral).  

---

## How to Run Milestone 3

1. Ensure `X_final.npy` and `y_final.npy` exist in the transformed data directory.  
2. Open the Milestone 3 notebook.  
3. Run sections in order:
   - Load data and split into train/test.  
   - Define `SimpleAttention` and the LSTM model.  
   - Train, evaluate, and save `attention_lstm.h5`.  
   - Build the feature extractor and LOS head.  
   - Generate `multitask_predictions.npy`.  
   - (Optional) Run risk trajectory and visualization cells.  
4. Use the saved model and predictions in later milestones (API and diet generation).
