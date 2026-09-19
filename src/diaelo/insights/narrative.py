"""Camada de tradução humanizada.

Só se afirma o que foi medido: toda frase cita número de sensor comparado ao
próprio dia da criança, nunca a classificação do modelo. Não se usa "estresse",
"crise", "alerta" nem nome de emoção.
"""

from diaelo.insights.contracts import PeriodName

# Abaixo desta diferença de batimento, o período é "em linha com o dia".
HR_DELTA_BPM = 5.0

ACTIVITY_DELTA_RATIO = 0.10
DISCARD_WARN_RATIO = 0.20

PERIOD_LABEL: dict[PeriodName, str] = {
    "madrugada": "de madrugada",
    "manha": "de manhã",
    "tarde": "à tarde",
    "noite": "à noite",
}

# Capitalizado, para início de frase.
PERIOD_LABEL_START: dict[PeriodName, str] = {
    "madrugada": "De madrugada",
    "manha": "De manhã",
    "tarde": "À tarde",
    "noite": "À noite",
}


def inconclusive(period: PeriodName, readings_used: int) -> str:
    plural = "leituras" if readings_used != 1 else "leitura"
    return (
        f"Houve apenas {readings_used} {plural} {PERIOD_LABEL[period]}, "
        "pouco para observar um padrão. Isso costuma acontecer quando o "
        "relógio fica fora do pulso ou sem bateria."
    )


def observation(
    period: PeriodName,
    readings_used: int,
    heart_rate_avg: float,
    day_heart_rate_avg: float,
    activity_avg: float,
    day_activity_avg: float,
) -> str:
    """Descreve o período citando apenas sensor, comparado ao próprio dia."""
    delta = heart_rate_avg - day_heart_rate_avg
    start = PERIOD_LABEL_START[period]

    if abs(delta) < HR_DELTA_BPM:
        return (
            f"{start}, os batimentos ficaram em média {heart_rate_avg:.0f} bpm "
            f"em {readings_used} leituras, em linha com a média do dia "
            f"({day_heart_rate_avg:.0f} bpm)."
        )

    direction = "acima" if delta > 0 else "abaixo"
    first = (
        f"{start}, os batimentos ficaram em média {heart_rate_avg:.0f} bpm "
        f"em {readings_used} leituras, {abs(delta):.0f} bpm {direction} da "
        f"média do dia ({day_heart_rate_avg:.0f} bpm)."
    )

    # O movimento acompanhou a alta dos batimentos?
    if delta > 0 and day_activity_avg > 0:
        ratio = activity_avg / day_activity_avg - 1
        if ratio >= ACTIVITY_DELTA_RATIO:
            return first + " O movimento nesse período também ficou acima do restante do dia."
        if ratio <= -ACTIVITY_DELTA_RATIO:
            return first + " O movimento, por outro lado, ficou abaixo do restante do dia."

    return first


def data_quality(discarded: int, received: int) -> str | None:
    """Avisa quando muitas leituras foram descartadas."""
    if received == 0 or discarded / received <= DISCARD_WARN_RATIO:
        return None
    return (
        f"{discarded} das {received} leituras de hoje ficaram fora da faixa "
        "esperada e não foram usadas. Vale conferir como o relógio está sendo "
        "usado durante o dia."
    )


DISCLAIMER = (
    "Estes dados descrevem sinais do corpo, não emoções nem diagnóstico. "
    "Batimentos mais altos podem vir de brincadeira, corrida ou animação. "
    "Use como ponto de partida para a conversa em família e leve as dúvidas "
    "aos profissionais que acompanham a criança."
)
