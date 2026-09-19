"""Carga do modelo e inferencia em lote.

A ordem das colunas vem do proprio artefato, nao de uma constante solta.
"""

from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

from diaelo.config import MODEL_FILE
from diaelo.data.features import build_features
from diaelo.insights.contracts import Reading


class ModelBundle:
    def __init__(self, payload: dict):
        self.model = payload["model"]
        self.feature_order: list[str] = payload["feature_order"]
        self.label_names: dict[int, str] = payload["label_names"]
        self.metrics: dict = payload.get("metrics", {})

    def predict(self, readings: list[Reading]) -> list[str]:
        """Classifica cada leitura e devolve o nome do estado."""
        if not readings:
            return []
        frame = pd.DataFrame(
            {
                "Heart_Rate": [r.heart_rate for r in readings],
                "RMSSD": [r.rmssd for r in readings],
                "Activity_Index": [r.activity_index for r in readings],
                "Time_of_Day": [r.timestamp.hour for r in readings],
            }
        )
        features = build_features(frame)[self.feature_order]
        return [self.label_names[int(p)] for p in self.model.predict(features)]


@lru_cache(maxsize=1)
def load_bundle(path: Path | None = None) -> ModelBundle:
    path = path or MODEL_FILE
    if not path.exists():
        raise FileNotFoundError(
            f"Modelo nao encontrado em {path}. "
            "Rode primeiro: python -m diaelo.training.train"
        )
    return ModelBundle(joblib.load(path))
