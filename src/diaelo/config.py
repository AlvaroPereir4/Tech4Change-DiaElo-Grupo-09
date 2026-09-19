"""Configuracao central do pipeline."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_RAW = ROOT / "data" / "raw"
MODELS_DIR = ROOT / "models"
REPORTS_DIR = ROOT / "reports"

DATASET_FILE = DATA_RAW / "ASD_Physiological_Stress_Dataset.csv"
MODEL_FILE = MODELS_DIR / "diaelo_rf.pkl"

RANDOM_SEED = 42

# Apenas variaveis que um smartwatch de baixo custo entrega.
SENSOR_FEATURES = ["Heart_Rate", "RMSSD", "Activity_Index", "Time_of_Day"]

# Time_of_Day entra codificado de forma ciclica.
MODEL_FEATURES = ["Heart_Rate", "RMSSD", "Activity_Index", "tod_sin", "tod_cos"]

TARGET = "Stress_Label"
GROUP_COL = "Subject_ID"  # split por individuo, nunca por linha

SENSOR_RANGES = {
    "Heart_Rate": (30.0, 220.0),
    "RMSSD": (0.0, 200.0),
    "Activity_Index": (0.0, 10.0),
    "Time_of_Day": (0, 23),
}

LABEL_NAMES = {0: "calmo", 1: "intermediario", 2: "acelerado"}

TEST_SIZE = 0.25
