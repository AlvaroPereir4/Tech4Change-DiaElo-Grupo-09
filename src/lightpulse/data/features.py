"""Engenharia de features.

Duas responsabilidades separadas de proposito:

1. `build_features` prepara o que o MODELO ve.
2. `period_of_day` prepara o que a FAMILIA le. A hora do dia quase nao ajuda
   a prever o rotulo, mas e a espinha dorsal da camada de traducao: e por
   periodo que os insights sao agregados ("de manha", "a tarde").
"""

import numpy as np
import pandas as pd

from lightpulse.config import GROUP_COL, MODEL_FEATURES, TARGET

HOURS_IN_DAY = 24

# Usados na narrativa dos insights, nao no modelo.
PERIODS = {
    "madrugada": range(0, 6),
    "manha": range(6, 12),
    "tarde": range(12, 18),
    "noite": range(18, 24),
}


def encode_time_of_day(hour: pd.Series) -> pd.DataFrame:
    """Codifica a hora de forma ciclica.

    Como inteiro, 23h e 0h ficam nos extremos opostos da escala, embora sejam
    adjacentes. Seno/cosseno preservam essa vizinhanca.
    """
    radians = 2 * np.pi * hour.astype(float) / HOURS_IN_DAY
    return pd.DataFrame(
        {"tod_sin": np.sin(radians), "tod_cos": np.cos(radians)},
        index=hour.index,
    )


def period_of_day(hour: int) -> str:
    """Traduz a hora no periodo que aparece para a familia."""
    for name, hours in PERIODS.items():
        if hour in hours:
            return name
    raise ValueError(f"Hora invalida: {hour}")


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """Monta a matriz X na ordem exata de MODEL_FEATURES.

    A ordem importa: o .pkl e servido pela API, e uma troca de colunas passaria
    silenciosamente e daria predicao errada.
    """
    features = df[["Heart_Rate", "RMSSD", "Activity_Index"]].copy()
    features = pd.concat([features, encode_time_of_day(df["Time_of_Day"])], axis=1)
    return features[MODEL_FEATURES]


def build_xy(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.Series]:
    """Devolve (X, y, grupos). Os grupos sao o Subject_ID, para o split."""
    return build_features(df), df[TARGET].astype(int), df[GROUP_COL]
