from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path
import os



app = FastAPI(
    title="API Sistema de Recomendação",
    description="Machine Learning para recomendação",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *([os.environ["FRONTEND_ORIGIN"].rstrip("/")] if os.getenv("FRONTEND_ORIGIN") else []),
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
modelo = joblib.load(BASE_DIR / "modelo.pkl")

class CropInput(BaseModel):

    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.get("/")

def home():
    return {
        "Api esta no ar !!"
    }



@app.post("/predict")

def predict_crop(data: CropInput):

    input_data = pd.DataFrame(
        [[
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]],
        columns=[
            "N",
            "P",
            "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall"
        ]
    )

    prediction = modelo.predict(input_data)[0]
    probabilities = modelo.predict_proba(input_data)[0]

    confidence = max(probabilities) * 100


    return {
        "crop": prediction,
        "confidence": round(confidence, 2)
    }

