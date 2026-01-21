# main.py
import os
import io
import json
import re
from typing import Dict, Any, List
from concurrent.futures import ThreadPoolExecutor, as_completed

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
import pdfplumber
from pdf2image import convert_from_path

import pytesseract

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer

import pandas as pd
from google import genai
from google.genai import types

# =========================
# 0. CONFIG
# =========================
# Paths (update to match your setup)
MODEL_PATH = r"C:\AINutriCare\Notebooks\Milestone_2\attention_lstm.h5"
SCALER_PATH = r"C:\AINutriCare\Data\Transformed\X_final.npy"
FOOD_KB_FILE = r"C:\AINutriCare\Notebooks\Milestone_3\diet_kb.json"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDJ5d1Dkf8Xy5xy6dnPAJ7DPp7UJs0ZIDI")
GEMINI_MODEL_ID = "gemini-2.5-flash-lite"

# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

client = genai.Client(api_key=GEMINI_API_KEY)

# ========= FastAPI app =========
app = FastAPI(title="AI-NutriCare API", version="0.1.0")

# CORS for React dev (adjust origin as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PYDANTIC MODELS
# =========================
class DietaryPreferences(BaseModel):
    diet_type: Literal["vegetarian", "non-vegetarian", "both"] = "both"
    region: Optional[str] = None  # "North", "South", "East", "West", "North East", or None for all

class ManualEntryData(BaseModel):
    # Required biomarkers
    glucose: float
    creatinine: float
    urea_bun: float
    sodium: float
    potassium: float
    cholesterol: float
    # Optional fields
    age: Optional[int] = 45
    gender: Optional[str] = "Male"
    hemoglobin: Optional[float] = None
    hba1c: Optional[float] = None
    # Dietary preferences
    preferences: DietaryPreferences = DietaryPreferences()

# =========================
# 1. OCR + ROBUST PARAMETER EXTRACTION
# =========================

# We use the keys expected by the downstream LSTM model (e.g. "Urea (BUN)")
PARAMETERS = [
    "Glucose", "Insulin", "Creatinine", "Urea (BUN)",
    "Sodium", "Potassium", "Hemoglobin", "WBC",
    "Lactate", "pH", "Age", "Gender", "Cholestrol", "HbA1c",
]

# The "Waterfall" Extractors: A list of patterns for each parameter
EXTRACTORS = {
    "Glucose": [
        # Format 1: "Glucose fasting ... 146"
        r"Glucose\s*[-\s]*fasting\b.*?\s+(\d{2,3})",
        # Format 2: "Fasting Blood Sugar ... H 141.0"
        r"Fasting\s+Blood\s+Sugar\b.*?\s+(?:H|L)?\s*(\d{2,3}(?:\.\d+)?)",
        # Fallback
        r"GLUCOSE[^\n]*?([0-9.]+)\s*mg/[dl1I]+"
    ],
    "Insulin": [
        r"(Insulin)\s+([0-9.]+)"
    ],
    "Creatinine": [
        # Format 1 & 2 combined
        r"Creatinine(?:-serum|,\s*Serum)?\b.*?\s+(\d{1,2}\.\d{1,2})",
        r"CREATININE[^\n]*?([0-9.]+)"
    ],
    "Urea (BUN)": [
        # Format 1
        r"UREA\s*\*?\s+(\d{2,3}(?:\.\d+)?)",
        # Format 2 (handles L/H flags)
        r"Urea\b.*?\s+(?:H|L)?\s*(\d{2,3}(?:\.\d+)?)",
        # Fallback for "BUN" specific label
        r"BUN[^\n]*?([0-9.]+)"
    ],
    "Sodium": [
        r"SODIUM[^\n]*?([0-9.]+)",
        r"Sodium\s*\(Na\+\).*?(\d{2,3})"
    ],
    "Potassium": [
        r"POTASSIUM[^\n]*?([0-9.]+)",
        r"Potassium\s*\(K\+\).*?(\d{1,2}\.\d{1,2})"
    ],
    "Hemoglobin": [
        # British vs American spelling
        r"Haemoglobin\b.*?\s+(\d{1,2}\.\d{1,2})",
        r"Hemoglobin\b.*?\s+(\d{1,2}\.\d{1,2})"
    ],
    "WBC": [
        r"Total\s+WBC\s+Count\b.*?\s+(\d{4,6})",
        r"WBC\s+Count\b.*?\s+(\d{4,6})"
    ],
    "Lactate": [
        r"(Lactate)\s+([0-9.]+)"
    ],
    "pH": [
        r"\bpH\b\s*([0-9.]+)"
    ],
    "Age": [
        r"Age\s*/\s*Gender\s*:\s*(\d{1,3})\s*years",
        r"Sex\s*/\s*Age\s*:\s*\w+\s*/\s*(\d{1,3})\s*Y",
        r"Age\s*:\s*([0-9]{1,3})"
    ],
    "Gender": [
        r"Age\s*/\s*Gender\s*:\s*\d{1,3}\s*years\s*/\s*(Male|Female)",
        r"Sex\s*/\s*Age\s*:\s*(Male|Female)",
        r"(?:Sex|Gender)\s*:\s*([A-Za-z]+)"
    ],
    # Note: Key is "Cholestrol" to match original main.py logic
    "Cholestrol": [
        r"Cholesterol-Total\b.*?\s+(\d{2,3})",
        r"Cholesterol\b(?!.*HDL).*?\s+(\d{2,3}(?:\.\d+)?)",
        r"(Cholesterol)\s+([0-9.]+)"
    ],
    "HbA1c": [
        r"Glyco\s+Hb\s*\(HbA1C\)\b.*?\s+(\d{1,2}\.\d{1,2})",
        r"HbA1c\b.*?\s+(?:H|L)?\s*(\d{1,2}\.\d{1,2})"
    ]
}

UNIT_MAP = {
    "Glucose": "mg/dL",
    "Insulin": "µIU/mL",
    "Creatinine": "mg/dL",
    "Urea (BUN)": "mg/dL",
    "Sodium": "mmol/L",
    "Potassium": "mmol/L",
    "Hemoglobin": "g/dL",
    "WBC": "/cmm",
    "Lactate": "mmol/L",
    "pH": "",
    "Age": "years",
    "Gender": "",
    "Cholestrol": "mg/dL",
    "HbA1c": "%",
}

def ocr_pdf_bytes_to_text(pdf_bytes: bytes) -> str:
    # Use pdfplumber on bytes with x_tolerance for table accuracy
    text_pages = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                # x_tolerance=2 helps keep columns separated by spaces
                page_text = page.extract_text(x_tolerance=2) or ""
                text_pages.append(page_text)
    except Exception:
        pass

    full_text = "\n".join(text_pages).strip()

    # If direct text is too small, fallback to OCR
    if len(full_text) < 50:
        images = convert_from_path(io.BytesIO(pdf_bytes), dpi=300)
        ocr_pages = []
        for img in images:
            page_text = pytesseract.image_to_string(img)
            ocr_pages.append(page_text)
        full_text = "\n".join(ocr_pages)

    return full_text

def extract_parameter(text: str, parameter: str) -> Dict[str, Any]:
    # Retrieve the list of patterns for this parameter
    patterns = EXTRACTORS.get(parameter, [])
    
    result = {
        "name": parameter,
        "value": None,
        "unit": UNIT_MAP.get(parameter, ""),
        "raw_match": "",
    }

    # Waterfall approach: Try patterns one by one
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
        if match:
            # Assume value is the last capturing group
            value_str = match.groups()[-1]
            result["value"] = value_str.strip()
            result["raw_match"] = match.group(0).strip()
            break  # Stop once a match is found
            
    return result

def extract_all_parameters(text: str) -> Dict[str, Dict[str, Any]]:
    data = {}
    for param in PARAMETERS:
        data[param] = extract_parameter(text, param)
    return data


# =========================
# 2. LSTM MODEL + CLINICAL JSON
# =========================
MODEL_FEATURES = [
    "Heart Rate", "MAP", "Respiratory Rate", "Temperature",
    "Glucose", "Creatinine", "BUN", "Sodium", "Potassium",
    "Hemoglobin", "WBC", "Lactate",
    "Fluid Balance", "Vasopressors", "Sedatives", "Antibiotics", "Insulin",
]

DEFAULTS = {
    "Heart Rate": 75,
    "MAP": 90,
    "Respiratory Rate": 16,
    "Temperature": 98.4,
    "Lactate": 1.0,
    "Fluid Balance": 0,
    "Vasopressors": 0,
    "Sedatives": 0,
    "Antibiotics": 0,
    "Insulin": 0,
}

@tf.keras.utils.register_keras_serializable()
class SimpleAttention(Layer):
    def __init__(self, units=64, **kwargs):
        super(SimpleAttention, self).__init__(**kwargs)
        self.units = units

    def get_config(self):
        config = super(SimpleAttention, self).get_config()
        config.update({"units": self.units})
        return config

    def build(self, input_shape):
        self.W1 = self.add_weight(name="att_w1", shape=(input_shape[-1], self.units), initializer="glorot_uniform")
        self.W2 = self.add_weight(name="att_w2", shape=(self.units, 1), initializer="glorot_uniform")
        self.b1 = self.add_weight(name="att_b1", shape=(self.units,), initializer="zeros")
        super(SimpleAttention, self).build(input_shape)

    def call(self, x):
        h = tf.nn.tanh(tf.matmul(x, self.W1) + self.b1)
        e = tf.squeeze(tf.matmul(h, self.W2), -1)
        alpha = tf.nn.softmax(e)
        context = x * tf.expand_dims(alpha, -1)
        context = tf.reduce_sum(context, axis=1)
        return context, alpha

def load_ai_resources():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    model = load_model(MODEL_PATH, custom_objects={"SimpleAttention": SimpleAttention})

    if os.path.exists(SCALER_PATH):
        X_ref = np.load(SCALER_PATH)
        X_flat = X_ref.reshape(-1, X_ref.shape[2])
        means = np.mean(X_flat, axis=0)
        stds = np.std(X_flat, axis=0)
        stds[stds == 0] = 1.0
    else:
        means = np.zeros(len(MODEL_FEATURES))
        stds = np.ones(len(MODEL_FEATURES))
    return model, means, stds

MODEL, MEANS, STDS = load_ai_resources()

def preprocess_patient_data(extracted_params: Dict[str, Any]):
    def get_val_from_params(key: str):
        item = extracted_params.get(key, {})
        val = item.get("value")
        if val in [None, "N/A", "Not Found"]:
            return None
        try:
            clean = str(val).replace("H", "").replace("L", "").replace("<", "").replace(">", "").strip()
            return float(clean)
        except:
            return None

    vector = []
    vitals_for_report = {}

    for feature in MODEL_FEATURES:
        json_key = feature
        if feature == "BUN":
            json_key = "Urea (BUN)"
        if feature == "Cholesterol":
            json_key = "Cholestrol"

        val = get_val_from_params(json_key)
        if val is None:
            val = DEFAULTS.get(feature, 0)

        if feature == "WBC" and val > 1000:
            val = val / 1000.0

        vector.append(val)
        vitals_for_report[feature] = val

    patient_matrix = np.tile(vector, (24, 1))
    normalized_matrix = (patient_matrix - MEANS) / STDS
    input_tensor = normalized_matrix.reshape(1, 24, len(MODEL_FEATURES))

    return input_tensor, vitals_for_report

def build_clinical_json(risk_score: float, vitals: Dict[str, float], raw_params: Dict[str, Any]):
    llm_context = {
        "patient_metrics": {
            "mortality_risk": float(risk_score),
            "glucose": float(vitals.get("Glucose", 0.0)),
            "creatinine": float(vitals.get("Creatinine", 0.0)),
        },
        "conditions": [],
        "avoid": [],
        "recommend": [],
        "summary": "",
    }

    if risk_score > 0.60:
        llm_context["conditions"].append("Critical Stability Risk")
        llm_context["summary"] = "Patient is at HIGH RISK. Immediate metabolic intervention required."
    elif risk_score > 0.30:
        llm_context["conditions"].append("Moderate Clinical Risk")
        llm_context["summary"] = "Patient requires dietary management and monitoring."
    else:
        llm_context["summary"] = "Patient is stable. Routine maintenance diet recommended."

    glucose = vitals.get("Glucose", 0.0)
    hba1c_val = raw_params.get("HbA1c", {}).get("value", "N/A")

    is_diabetic = False
    if glucose > 126:
        is_diabetic = True
    if hba1c_val != "N/A":
        try:
            val = float(str(hba1c_val).replace("H", "").replace("L", ""))
            if val > 6.5:
                is_diabetic = True
        except:
            pass

    if is_diabetic:
        llm_context["conditions"].append("Diabetes (Type 2 / Hyperglycemia)")
        llm_context["avoid"].extend(["Fruit juices", "White bread", "Processed sugars", "High-GI foods"])
        llm_context["recommend"].extend(["Complex carbohydrates", "High fiber foods (>30g/day)", "Leafy greens"])

    creat = vitals.get("Creatinine", 0.0)
    if creat > 1.2:
        llm_context["conditions"].append("Renal Stress / Kidney Strain")
        llm_context["avoid"].extend(["High sodium foods", "Excessive red meat", "Processed deli meats"])
        llm_context["recommend"].extend(["Low-potassium vegetables", "Cauliflower", "Berries"])

    if vitals.get("MAP", 90) > 100:
        llm_context["conditions"].append("Hypertension Risk")
        llm_context["avoid"].append("Salt/Sodium")
        llm_context["recommend"].append("DASH diet principles")

    if not llm_context["conditions"]:
        llm_context["conditions"].append("General Health Maintenance")
        llm_context["recommend"].append("Balanced diet with lean proteins and vegetables")

    return llm_context


# =========================
# 3. FOOD KB + GEMINI DIET PLAN
# =========================
def load_and_tag_data(filepath):
    if not os.path.exists(filepath):
        return pd.DataFrame()

    with open(filepath, "r") as f:
        data = json.load(f)
    df = pd.DataFrame(data)

    def get_tags(row):
        tags = []
        if row["Carbohydrate (g)"] < 30 and "sugar" not in str(row["ingredients"]).lower():
            tags.append("diabetic_friendly")
            tags.append("low_sugar")
        if row["Protein (g)"] > 10:
            tags.append("high_protein")
        if row["Total Fat (g)"] < 8:
            tags.append("low_fat")
        if 5 < row["Protein (g)"] < 15:
            tags.append("renal_safe")
        return tags

    df["medical_tags"] = df.apply(get_tags, axis=1)
    return df

def get_smart_candidates(df, clinical_insights, dietary_preferences: Optional[DietaryPreferences] = None):
    if df.empty:
        return [] # Return empty list instead of empty dict

    # 1. Apply Clinical Filters (Keep this logic, it's good!)
    conditions = " ".join(clinical_insights.get("conditions", [])).lower()
    avoid = " ".join(clinical_insights.get("avoid", [])).lower()

    candidates = df.copy()

    # Filter for Diabetes
    if "diabetes" in conditions or "sugar" in avoid:
        candidates = candidates[candidates["medical_tags"].apply(lambda x: "diabetic_friendly" in x)]

    # Filter for Renal/Kidney issues
    if "renal" in conditions or "kidney" in conditions:
        candidates = candidates[candidates["medical_tags"].apply(lambda x: "renal_safe" in x)]

    # 2. Apply Dietary Preferences
    if dietary_preferences:
        # Non-vegetarian ingredient keywords
        non_veg_keywords = ["fish", "chicken", "mutton", "lamb", "pork", "egg", "prawn", "shrimp", 
                           "crab", "lobster", "meat", "beef", "goat", "duck", "turkey", "bacon",
                           "sausage", "ham", "sardine", "tuna", "salmon", "mackerel", "hilsa", "rohu"]
        
        def is_non_veg(ingredients_str):
            if not isinstance(ingredients_str, str):
                return False
            ing_lower = ingredients_str.lower()
            return any(keyword in ing_lower for keyword in non_veg_keywords)
        
        # Filter by diet type
        if dietary_preferences.diet_type == "vegetarian":
            candidates = candidates[~candidates["ingredients"].apply(is_non_veg)]
        elif dietary_preferences.diet_type == "non-vegetarian":
            # For non-veg preference, we can include everything (veg + non-veg)
            # but prioritize non-veg items by keeping all
            pass
        # "both" means no filtering
        
        # Filter by region
        if dietary_preferences.region and dietary_preferences.region.lower() != "all":
            region_lower = dietary_preferences.region.lower()
            # Handle region mapping
            region_map = {
                "north": "North",
                "south": "South", 
                "east": "East",
                "west": "West",
                "north_east": "North East",
                "northeast": "North East",
                "north east": "North East"
            }
            target_region = region_map.get(region_lower, dietary_preferences.region)
            candidates = candidates[candidates["region"].str.lower() == target_region.lower()]

    # 3. Return a Mixed Pool
    # We sample ~30 items to fit in the context window easily.
    sample_size = min(30, len(candidates))
    
    if sample_size == 0:
        # If no candidates after filtering, return all items from original df with just clinical filters
        return df.sample(n=min(30, len(df))).to_dict(orient="records")
    
    # We return a list of dictionaries directly
    return candidates.sample(n=sample_size).to_dict(orient="records")

def generate_single_day_plan(patient_profile, clinical_insights, food_candidates, dietary_preferences, day_number, previous_items=None):
    """Generate a single day's meal plan."""
    summary = clinical_insights.get("summary", "Healthy Diet")
    options_preview = json.dumps(food_candidates, indent=2)
    
    # Build dietary preference instructions
    diet_instructions = ""
    if dietary_preferences:
        if dietary_preferences.diet_type == "vegetarian":
            diet_instructions += "\n    - Patient is VEGETARIAN. NO meat, fish, or eggs."
        elif dietary_preferences.diet_type == "non-vegetarian":
            diet_instructions += "\n    - Include a mix of vegetarian and non-vegetarian items."
        if dietary_preferences.region:
            diet_instructions += f"\n    - Prioritize {dietary_preferences.region} Indian cuisine."

    # Build clinical data for prompt
    clinical_data_for_prompt = {
        "glucose": clinical_insights.get("patient_metrics", {}).get("glucose", 0),
        "creatinine": clinical_insights.get("patient_metrics", {}).get("creatinine", 0),
        "conditions": clinical_insights.get("conditions", []),
    }
    
    # Avoid repeating items from previous days
    avoid_items = ""
    if previous_items and len(previous_items) > 0:
        avoid_items = f"\n    AVOID THESE ITEMS (already used in previous days): {', '.join(previous_items[:20])}"

    prompt = f"""
    You are a clinical dietitian AI creating DAY {day_number} of a 7-day meal plan.

    PATIENT: {patient_profile['name']}, Age: {patient_profile.get('age', 45)} years (ADULT)
    CONDITION: {summary}
    Clinical: {json.dumps(clinical_data_for_prompt)}
    {diet_instructions}
    {avoid_items}

    Available foods: {options_preview}

    CRITICAL RULES FOR MEAL CATEGORIES:
    1. **Breakfast:** MUST be a complete meal like Idli Sambhar, Poha, Upma, Paratha with Curd, or Oats with Milk. DO NOT suggest snacks like "Almonds" or "Tea" alone. NO heavy curries or rice.
    2. **Lunch:** MUST be a full meal. Rice/Roti + Dal + Sabzi (Dry Vegetable) + Salad. Example: "2 Rotis with Paneer Curry and Salad".
    3. **Dinner:** MUST be lighter than lunch. Khichdi, Soup with Bread, Light Roti with Dal. NO heavy biryanis or heavy fried items.
    4. **Snacks:** Healthy light items. Roasted Chana, Fruit Chaat, Buttermilk, Sprouted Salad.

    MEAL DESCRIPTION STYLE (MANDATORY):
    - Describe meals in natural, appetizing form.
    - BAD: "Oats", "Milk", "Apple"
    - GOOD: "Oats porridge cooked with skim milk and topped with apple slices"
    - GOOD: "2 Multigrain Rotis with Palak Paneer and Cucumber Salad"

    TAGGING RULES:
    - If creatinine > 2.0 → add "renal_safe" tag
    - If glucose > 180 → add "diabetic_friendly" tag

    Return JSON with 1-2 complete meal descriptions per category:
    {{
      "breakfast": [{{"item": "Oats porridge with skim milk", "calories": 250, "protein": 8, "fat": 4, "carbs": 45, "tags": ["diabetic_friendly"], "ingredients": ["oats", "milk"], "origin": "North"}}],
      "lunch": [],
      "dinner": [],
      "snacks": []
    }}
    """

    meal_item_schema = {
        "type": "object",
        "properties": {
            "item": {"type": "string"},
            "calories": {"type": "number"},
            "protein": {"type": "number"},
            "fat": {"type": "number"},
            "carbs": {"type": "number"},
            "tags": {"type": "array", "items": {"type": "string"}},
            "ingredients": {"type": "array", "items": {"type": "string"}},
            "origin": {"type": "string"},
        },
        "required": ["item", "calories", "protein", "fat", "carbs", "tags"],
    }

    schema = {
        "type": "object",
        "properties": {
            "breakfast": {"type": "array", "items": meal_item_schema},
            "lunch": {"type": "array", "items": meal_item_schema},
            "dinner": {"type": "array", "items": meal_item_schema},
            "snacks": {"type": "array", "items": meal_item_schema},
        },
        "required": ["breakfast", "lunch", "dinner", "snacks"],
    }

    resp = client.models.generate_content(
        model=GEMINI_MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0.1,
        ),
    )

    if hasattr(resp, "parsed") and resp.parsed is not None:
        return resp.parsed
    return json.loads(resp.text.strip())


def generate_structured_plan(patient_profile, clinical_insights, food_candidates, dietary_preferences: Optional[DietaryPreferences] = None):
    """Generate a 7-day meal plan using PARALLEL API calls for speed."""
    week_plan = {}
    total_nutrition = {"calories": 0, "protein": 0, "fat": 0, "carbs": 0}
    
    # Generate all 7 days in PARALLEL using ThreadPoolExecutor
    def generate_day(day_num):
        return day_num, generate_single_day_plan(
            patient_profile, 
            clinical_insights, 
            food_candidates, 
            dietary_preferences, 
            day_num, 
            None  # No previous items tracking in parallel mode
        )
    
    # Run all 7 API calls in parallel
    with ThreadPoolExecutor(max_workers=7) as executor:
        futures = [executor.submit(generate_day, day_num) for day_num in range(1, 8)]
        
        for future in as_completed(futures):
            day_num, day_plan = future.result()
            day_key = f"day{day_num}"
            week_plan[day_key] = day_plan
            
            # Accumulate nutrition
            for meal in ["breakfast", "lunch", "dinner", "snacks"]:
                for item in day_plan.get(meal, []):
                    total_nutrition["calories"] += item.get("calories", 0)
                    total_nutrition["protein"] += item.get("protein", 0)
                    total_nutrition["fat"] += item.get("fat", 0)
                    total_nutrition["carbs"] += item.get("carbs", 0)
    
    # Average nutrition per day
    for key in total_nutrition:
        total_nutrition[key] = round(total_nutrition[key] / 7, 1)
    
    # Generate medical reasoning
    conditions = clinical_insights.get("conditions", [])
    reasoning = f"This 7-day meal plan is designed for a patient with {', '.join(conditions) if conditions else 'general health maintenance'}. "
    reasoning += "Each day provides balanced nutrition with variety across Indian cuisines. "
    if clinical_insights.get("patient_metrics", {}).get("glucose", 0) > 126:
        reasoning += "Diabetic-friendly options are prioritized with low glycemic index foods. "
    if clinical_insights.get("patient_metrics", {}).get("creatinine", 0) > 1.2:
        reasoning += "Renal-safe options with controlled protein and sodium are included. "
    
    return {
        "week_plan": week_plan,
        "total_nutrition": total_nutrition,
        "medical_reasoning": reasoning
    }

def round_plan(plan: Dict[str, Any], ndigits: int = 0) -> Dict[str, Any]:
    # Round values for all 7 days in week_plan
    week_plan = plan.get("week_plan", {})
    for day_key in ["day1", "day2", "day3", "day4", "day5", "day6", "day7"]:
        day_plan = week_plan.get(day_key, {})
        for meal in ["breakfast", "lunch", "dinner", "snacks"]:
            for dish in day_plan.get(meal, []):
                for key in ["calories", "protein", "fat", "carbs"]:
                    val = dish.get(key)
                    if isinstance(val, (int, float)):
                        dish[key] = round(val, ndigits)

    tn = plan.get("total_nutrition", {})
    for key in ["calories", "protein", "fat", "carbs"]:
        val = tn.get(key)
        if isinstance(val, (int, float)):
            tn[key] = round(val, ndigits)
    return plan

# =========================
# 4. FastAPI endpoints
# =========================
@app.post("/plan-diet")
async def plan_diet(
    report: UploadFile = File(...),
    diet_type: str = Query("both", description="Dietary preference: vegetarian, non-vegetarian, or both"),
    region: Optional[str] = Query(None, description="Regional cuisine preference: North, South, East, West, North East")
):
    if report.content_type not in ["application/pdf"]:
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Create dietary preferences object
    dietary_prefs = DietaryPreferences(diet_type=diet_type, region=region)

    pdf_bytes = await report.read()

    # 1) OCR + parameter extraction (using new waterfall logic)
    text = ocr_pdf_bytes_to_text(pdf_bytes)
    extracted_params = extract_all_parameters(text)

    # 2) LSTM risk prediction
    input_tensor, vitals = preprocess_patient_data(extracted_params)
    prediction = MODEL.predict(input_tensor, verbose=0)[0][0]
    clinical_json = build_clinical_json(float(prediction), vitals, extracted_params)

    # 3) Diet plan with dietary preferences
    food_df = load_and_tag_data(FOOD_KB_FILE)
    candidates = get_smart_candidates(food_df, clinical_json, dietary_prefs)
    patient = {"name": "From PDF", "age": extracted_params.get("Age", {}).get("value", None) or 45}
    diet_plan = generate_structured_plan(patient, clinical_json, candidates, dietary_prefs)
    diet_plan = round_plan(diet_plan, ndigits=0)

    # Combine clinical + diet
    result = {
        "clinical": clinical_json,
        "diet": diet_plan,
    }
    return result


@app.post("/plan-diet-manual")
async def plan_diet_manual(data: ManualEntryData):
    """
    Generate a diet plan from manually entered biomarker data.
    Required fields: glucose, creatinine, urea_bun, sodium, potassium, cholesterol
    """
    # Convert manual entry data to the format expected by preprocess_patient_data
    extracted_params = {
        "Glucose": {"value": str(data.glucose), "unit": "mg/dL"},
        "Creatinine": {"value": str(data.creatinine), "unit": "mg/dL"},
        "Urea (BUN)": {"value": str(data.urea_bun), "unit": "mg/dL"},
        "Sodium": {"value": str(data.sodium), "unit": "mmol/L"},
        "Potassium": {"value": str(data.potassium), "unit": "mmol/L"},
        "Cholestrol": {"value": str(data.cholesterol), "unit": "mg/dL"},
        "Age": {"value": str(data.age) if data.age else "45"},
        "Gender": {"value": data.gender or "Male"},
        "Hemoglobin": {"value": str(data.hemoglobin) if data.hemoglobin else None},
        "HbA1c": {"value": str(data.hba1c) if data.hba1c else None},
        # Default values for other parameters not collected manually
        "Insulin": {"value": None},
        "WBC": {"value": None},
        "Lactate": {"value": None},
        "pH": {"value": None},

    }

    # 1) LSTM risk prediction
    input_tensor, vitals = preprocess_patient_data(extracted_params)
    prediction = MODEL.predict(input_tensor, verbose=0)[0][0]
    clinical_json = build_clinical_json(float(prediction), vitals, extracted_params)

    # 2) Diet plan with dietary preferences
    food_df = load_and_tag_data(FOOD_KB_FILE)
    candidates = get_smart_candidates(food_df, clinical_json, data.preferences)
    patient = {"name": "Manual Entry", "age": data.age or 45}
    diet_plan = generate_structured_plan(patient, clinical_json, candidates, data.preferences)
    diet_plan = round_plan(diet_plan, ndigits=0)

    # Combine clinical + diet
    result = {
        "clinical": clinical_json,
        "diet": diet_plan,
    }
    return result