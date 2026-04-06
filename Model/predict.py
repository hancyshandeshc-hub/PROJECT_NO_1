import os
import pickle
base_path = os.path.dirname(__file__)
model_path = os.path.join(base_path, "model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)
def predict_output(user_input:dict):
    input_df=pd.DataFrame([user_input])
    output=model.predict(input_df)[0]
    return output
