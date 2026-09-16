"""Configuracao central do pipeline.

Um unico lugar define o contrato de dados. O treino, a API e os testes
importam daqui para nao divergirem.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_RAW = ROOT / "data" / "raw"
MODELS_DIR = ROOT / "models"
REPORTS_DIR = ROOT / "reports"

DATASET_FILE = DATA_RAW / "ASD_Physiological_Stress_Dataset.csv"
MODEL_FILE = MODELS_DIR / "lightpulse_rf.pkl"

RANDOM_SEED = 42

# --- Contrato de entrada -----------------------------------------------------
# Apenas variaveis que um smartwatch de baixo custo consegue entregar.
# O dataset tem outras (SCL_mean, SCR_Frequency, Noise_Level, Skin_Temperature,
# Respiration_Rate, SDNN): sao de laboratorio/EDA e ficam de fora de proposito.
SENSOR_FEATURES = ["Heart_Rate", "RMSSD", "Activity_Index", "Time_of_Day"]

# Colunas que o modelo realmente ve (Time_of_Day vira ciclico).
MODEL_FEATURES = ["Heart_Rate", "RMSSD", "Activity_Index", "tod_sin", "tod_cos"]

TARGET = "Stress_Label"
GROUP_COL = "Subject_ID"  # split por individuo, nunca por linha

# Faixas fisiologicas plausiveis. Fora disso = leitura ruim do relogio.
SENSOR_RANGES = {
    "Heart_Rate": (30.0, 220.0),
    "RMSSD": (0.0, 200.0),
    "Activity_Index": (0.0, 10.0),
    "Time_of_Day": (0, 23),
}

# --- Rotulos -----------------------------------------------------------------
# O numero fica restrito ao modelo. A API nunca devolve "estresse": traduz
# para linguagem de rotina (ver camada de traducao, etapa posterior).
LABEL_NAMES = {0: "calmo", 1: "intermediario", 2: "acelerado"}

# --- Split -------------------------------------------------------------------
TEST_SIZE = 0.25
