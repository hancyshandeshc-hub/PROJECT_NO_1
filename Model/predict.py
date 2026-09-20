from pathlib import Path

import joblib
import pandas as pd

# This file lives inside the Model/ folder, right next to OurMLmodel.pkl,
# so build the path from this file's own location.
MODEL_PATH = Path(__file__).resolve().parent / "OurMLmodel.pkl"

if not MODEL_PATH.exists():
    found = sorted(p.name for p in MODEL_PATH.parent.iterdir())
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Files here: {found}")

# joblib.load reads both plain pickle files and joblib-compressed ones.
model = joblib.load(MODEL_PATH)


def predict_output(user_input: dict):
    input_df = pd.DataFrame([user_input])

    # Make the column order match what the model was trained on.
    expected = getattr(model, "feature_names_in_", None)
    if expected is not None:
        input_df = input_df[list(expected)]

    output = model.predict(input_df)[0]

    # numpy types are not always JSON-serializable by FastAPI.
    return output.item() if hasattr(output, "item") else output
