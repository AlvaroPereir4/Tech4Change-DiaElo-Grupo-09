"""Engenharia de features.

`build_features` prepara o que o modelo ve; `period_of_day`, o eixo usado na
narrativa dos insights.
"""

import numpy as np
import pandas as pd

from diaelo.config import GROUP_COL, MODEL_FEATURES, TARGET

HOURS_IN_DAY = 24

PERIODS = {
    "madrugada": range(0, 6),
    "manha": range(6, 12),
    "tarde": range(12, 18),
    "noite": range(18, 24),
}


def encode_time_of_day(hour: pd.Series) -> pd.DataFrame:
    """Codifica a hora em seno/cosseno, para 23h e 0h ficarem adjacentes."""
    radians = 2 * np.pi * hour.astype(float) / HOURS_IN_DAY
    return pd.DataFrame(
        {"tod_sin": np.sin(radians), "tod_cos": np.cos(radians)},
        index=hour.index,
    )


def period_of_day(hour: int) -> str:
    """Traduz a hora no periodo do dia."""
    for name, hours in PERIODS.items():
        if hour in hours:
            return name
    raise ValueError(f"Hora invalida: {hour}")


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """Monta a matriz X na ordem exata de MODEL_FEATURES."""
    features = df[["Heart_Rate", "RMSSD", "Activity_Index"]].copy()
    features = pd.concat([features, encode_time_of_day(df["Time_of_Day"])], axis=1)
    return features[MODEL_FEATURES]


def build_xy(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.Series]:
    """Devolve (X, y, grupos), sendo os grupos o Subject_ID."""
    return build_features(df), df[TARGET].astype(int), df[GROUP_COL]
