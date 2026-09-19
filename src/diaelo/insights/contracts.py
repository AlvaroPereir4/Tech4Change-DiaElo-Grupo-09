"""Entrada e saida da API.

Nenhum campo da resposta expoe o rotulo numerico do modelo.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from diaelo.config import SENSOR_RANGES

PeriodName = Literal["madrugada", "manha", "tarde", "noite"]
StateName = Literal["calmo", "intermediario", "acelerado"]


class Reading(BaseModel):
    """Uma leitura do smartwatch. A hora do dia e derivada do timestamp."""

    timestamp: datetime
    heart_rate: float = Field(..., description="bpm")
    rmssd: float = Field(..., description="variabilidade da FC, em ms")
    activity_index: float = Field(..., description="proxy de movimento do acelerometro")

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


class InsightRequest(BaseModel):
    """Um lote de leituras de um periodo (tipicamente um dia)."""

    child_id: str = Field(..., description="identificador anonimo, nunca o nome")
    readings: list[Reading] = Field(..., min_length=1)
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
