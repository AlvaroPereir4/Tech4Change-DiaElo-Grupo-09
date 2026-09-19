"""Entrada e saida da API.

Nenhum campo da resposta expoe o rotulo numerico do modelo.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from diaelo.config import SENSOR_RANGES

PeriodName = Literal["madrugada", "manha", "tarde", "noite"]
StateName = Literal["calmo", "intermediario", "acelerado"]


class Reading(BaseModel):
    """Uma leitura do smartwatch. A hora do dia e derivada do timestamp."""

    timestamp: datetime = Field(
        ...,
        description="momento da leitura, ISO 8601 com fuso",
        examples=["2026-09-19T14:00:00-03:00"],
    )
    heart_rate: float = Field(..., description="bpm", examples=[105.7])
    rmssd: float = Field(..., description="variabilidade da FC, em ms", examples=[15.2])
    activity_index: float = Field(
        ..., description="proxy de movimento do acelerometro", examples=[1.21]
    )

    @field_validator("heart_rate", "rmssd", "activity_index")
    @classmethod
    def _finite(cls, v: float) -> float:
        if v != v or v in (float("inf"), float("-inf")):
            raise ValueError("valor nao numerico")
        return v

    def is_plausible(self) -> bool:
        """Leitura dentro da faixa fisiologica possivel."""
        checks = {
            "Heart_Rate": self.heart_rate,
            "RMSSD": self.rmssd,
            "Activity_Index": self.activity_index,
        }
        return all(SENSOR_RANGES[k][0] <= v <= SENSOR_RANGES[k][1] for k, v in checks.items())


# Dia de exemplo servido no /docs: manha tranquila, tarde mais agitada, uma
# leitura impossivel para demonstrar o descarte. A madrugada fica sem dado,
# entao volta como inconclusiva.
EXAMPLE_REQUEST = {
    "child_id": "anon-7f3a",
    "min_readings_per_period": 6,
    "readings": [
        {"timestamp": "2026-09-19T07:00:00-03:00", "heart_rate": 78.4, "rmssd": 42.1, "activity_index": 0.50},
        {"timestamp": "2026-09-19T08:00:00-03:00", "heart_rate": 80.2, "rmssd": 40.8, "activity_index": 0.55},
        {"timestamp": "2026-09-19T09:00:00-03:00", "heart_rate": 76.9, "rmssd": 44.3, "activity_index": 0.47},
        {"timestamp": "2026-09-19T10:00:00-03:00", "heart_rate": 79.1, "rmssd": 41.5, "activity_index": 0.52},
        {"timestamp": "2026-09-19T11:00:00-03:00", "heart_rate": 77.5, "rmssd": 43.0, "activity_index": 0.49},
        {"timestamp": "2026-09-19T11:30:00-03:00", "heart_rate": 81.0, "rmssd": 39.6, "activity_index": 0.58},
        {"timestamp": "2026-09-19T13:00:00-03:00", "heart_rate": 101.3, "rmssd": 18.4, "activity_index": 1.08},
        {"timestamp": "2026-09-19T14:00:00-03:00", "heart_rate": 105.7, "rmssd": 15.2, "activity_index": 1.21},
        {"timestamp": "2026-09-19T15:00:00-03:00", "heart_rate": 99.8, "rmssd": 20.1, "activity_index": 1.02},
        {"timestamp": "2026-09-19T16:00:00-03:00", "heart_rate": 108.2, "rmssd": 13.9, "activity_index": 1.30},
        {"timestamp": "2026-09-19T16:30:00-03:00", "heart_rate": 103.4, "rmssd": 16.8, "activity_index": 1.14},
        {"timestamp": "2026-09-19T17:00:00-03:00", "heart_rate": 97.6, "rmssd": 21.3, "activity_index": 0.98},
        {"timestamp": "2026-09-19T19:00:00-03:00", "heart_rate": 84.2, "rmssd": 35.9, "activity_index": 0.64},
        {"timestamp": "2026-09-19T20:00:00-03:00", "heart_rate": 82.7, "rmssd": 37.2, "activity_index": 0.60},
        {"timestamp": "2026-09-19T20:30:00-03:00", "heart_rate": 80.5, "rmssd": 39.1, "activity_index": 0.56},
        {"timestamp": "2026-09-19T21:00:00-03:00", "heart_rate": 79.8, "rmssd": 40.4, "activity_index": 0.53},
        {"timestamp": "2026-09-19T21:30:00-03:00", "heart_rate": 78.1, "rmssd": 41.8, "activity_index": 0.50},
        {"timestamp": "2026-09-19T22:00:00-03:00", "heart_rate": 77.3, "rmssd": 43.5, "activity_index": 0.48},
        {"timestamp": "2026-09-19T12:10:00-03:00", "heart_rate": 310.0, "rmssd": 22.0, "activity_index": 1.00},
    ],
}


class InsightRequest(BaseModel):
    """Um lote de leituras de um periodo (tipicamente um dia)."""

    model_config = ConfigDict(json_schema_extra={"examples": [EXAMPLE_REQUEST]})

    child_id: str = Field(
        ...,
        description="identificador anonimo, nunca o nome",
        examples=["anon-7f3a"],
    )
    readings: list[Reading] = Field(
        ..., min_length=1, description="todas as leituras da janela, tipicamente um dia"
    )
    min_readings_per_period: int = Field(
        default=6,
        ge=1,
        description="abaixo disso o periodo e reportado como inconclusivo",
    )


class PeriodMetrics(BaseModel):
    heart_rate_avg: float
    rmssd_avg: float
    activity_avg: float


class PeriodInsight(BaseModel):
    period: PeriodName
    label: str = Field(..., description="o periodo escrito como aparece na frase")
    readings_used: int
    conclusive: bool = Field(..., description="False = leituras insuficientes")
    distribution: dict[StateName, float] = Field(
        default_factory=dict, description="fracao das leituras em cada estado"
    )
    predominant: StateName | None = None
    activation_score: float | None = Field(
        default=None, ge=0, le=2, description="0 = calmo, 2 = acelerado; media continua"
    )
    metrics: PeriodMetrics | None = None
    observation: str = Field(..., description="o que foi medido, sem interpretacao")


class InsightResponse(BaseModel):
    child_id: str
    window_start: datetime
    window_end: datetime
    readings_received: int
    readings_used: int
    readings_discarded: int = Field(..., description="fora de faixa fisiologica plausivel")
    day_activation_score: float | None = None
    day_metrics: PeriodMetrics | None = Field(
        default=None, description="medias do dia inteiro, referencia das comparacoes"
    )
    periods: list[PeriodInsight]
    data_quality_note: str | None = Field(
        default=None, description="preenchido quando muitas leituras foram descartadas"
    )
    disclaimer: str
