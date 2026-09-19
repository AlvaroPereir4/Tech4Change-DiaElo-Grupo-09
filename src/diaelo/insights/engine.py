"""Orquestração: leituras do relógio -> insights para a família.

Descarta leitura implausível, classifica cada leitura, agrupa por período do
dia e descreve cada período em números medidos.
"""

from collections import Counter, defaultdict

from diaelo.data.features import period_of_day
from diaelo.insights import narrative
from diaelo.insights.contracts import (
    InsightRequest,
    InsightResponse,
    PeriodInsight,
    PeriodMetrics,
    PeriodName,
    Reading,
    StateName,
)
from diaelo.insights.predictor import ModelBundle, load_bundle

STATE_WEIGHT: dict[StateName, float] = {"calmo": 0.0, "intermediario": 1.0, "acelerado": 2.0}

# Ordem cronológica, não alfabética.
PERIOD_ORDER: list[PeriodName] = ["madrugada", "manha", "tarde", "noite"]


def _mean(values: list[float]) -> float:
    return round(sum(values) / len(values), 2)


def _metrics(readings: list[Reading]) -> PeriodMetrics:
    return PeriodMetrics(
        heart_rate_avg=_mean([r.heart_rate for r in readings]),
        rmssd_avg=_mean([r.rmssd for r in readings]),
        activity_avg=_mean([r.activity_index for r in readings]),
    )


def _activation_score(states: list[StateName]) -> float:
    return round(sum(STATE_WEIGHT[s] for s in states) / len(states), 3)


def _distribution(states: list[StateName]) -> dict[StateName, float]:
    counts = Counter(states)
    total = len(states)
    return {state: round(counts.get(state, 0) / total, 3) for state in STATE_WEIGHT}


def generate_insights(request: InsightRequest, bundle: ModelBundle | None = None) -> InsightResponse:
    bundle = bundle or load_bundle()

    usable = [r for r in request.readings if r.is_plausible()]
    discarded = len(request.readings) - len(usable)
    timestamps = [r.timestamp for r in request.readings]

    base = {
        "child_id": request.child_id,
        "window_start": min(timestamps),
        "window_end": max(timestamps),
        "readings_received": len(request.readings),
        "readings_used": len(usable),
        "readings_discarded": discarded,
        "data_quality_note": narrative.data_quality(discarded, len(request.readings)),
        "disclaimer": narrative.DISCLAIMER,
    }

    if not usable:
        return InsightResponse(**base, periods=[])

    states = bundle.predict(usable)
    day_metrics = _metrics(usable)

    by_period: dict[PeriodName, list[tuple[Reading, StateName]]] = defaultdict(list)
    for reading, state in zip(usable, states):
        by_period[period_of_day(reading.timestamp.hour)].append((reading, state))

    periods = [
        _build_period(name, by_period.get(name, []), request.min_readings_per_period, day_metrics)
        for name in PERIOD_ORDER
    ]

    return InsightResponse(
        **base,
        day_activation_score=_activation_score(states),
        day_metrics=day_metrics,
        periods=periods,
    )


def _build_period(
    name: PeriodName,
    entries: list[tuple[Reading, StateName]],
    min_readings: int,
    day_metrics: PeriodMetrics,
) -> PeriodInsight:
    label = narrative.PERIOD_LABEL[name]

    if len(entries) < min_readings:
        return PeriodInsight(
            period=name,
            label=label,
            readings_used=len(entries),
            conclusive=False,
            observation=narrative.inconclusive(name, len(entries)),
        )

    readings = [r for r, _ in entries]
    states = [s for _, s in entries]
    distribution = _distribution(states)
    metrics = _metrics(readings)

    return PeriodInsight(
        period=name,
        label=label,
        readings_used=len(entries),
        conclusive=True,
        distribution=distribution,
        predominant=max(distribution, key=distribution.get),
        activation_score=_activation_score(states),
        metrics=metrics,
        observation=narrative.observation(
            period=name,
            readings_used=len(entries),
            heart_rate_avg=metrics.heart_rate_avg,
            day_heart_rate_avg=day_metrics.heart_rate_avg,
            activity_avg=metrics.activity_avg,
            day_activity_avg=day_metrics.activity_avg,
        ),
    )
