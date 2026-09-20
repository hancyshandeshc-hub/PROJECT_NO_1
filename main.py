from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from schema.user_input_pydantic import UserInput
from Model.predict import predict_output

app = FastAPI(
    title="Rainfall Prediction System",
    description="Machine Learning based Rainfall Prediction API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Rainfall Prediction System API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "OK"
    }


@app.post("/predict")
def predict_rainfall(data: UserInput):

    try:

        user_input = {
            "MONTH": data.MONTH,
            "DISTRICT": data.DISTRICT,
            "RH2M": data.RH2M,
            "T2M": data.T2M,
            "WS10M": data.WS10M,
            "PS": data.PS,
            "PRECTOT_LAST_MONTH": data.PRECTOT_LAST_MONTH,
            "RH2M_LAST_MONTH": data.RH2M_LAST_MONTH
        }

        prediction = predict_output(user_input)

        return JSONResponse(
            status_code=200,
            content={
                "prediction": round(float(prediction), 2),
                "unit": "mm"
            }
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )
