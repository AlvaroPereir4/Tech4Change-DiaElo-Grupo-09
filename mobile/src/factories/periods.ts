import { DailySummary, Period, PeriodState } from "@/types";

export const stateLabels: Record<PeriodState, string> = {
  calmo: "Calmo",
  intermediario: "Intermediário",
  acelerado: "Maior ativação",
  insuficiente: "Dados insuficientes",
};

export const stateColors: Record<
  PeriodState,
  { bg: string; text: string; dot: string; border: string }
> = {
  calmo: { bg: "#E8F5EE", text: "#4E7C6A", dot: "#7AAE8E", border: "#B8DEC9" },
  intermediario: {
    bg: "#F9F1DA",
    text: "#7D6841",
    dot: "#D4A853",
    border: "#EDD89A",
  },
  acelerado: {
    bg: "#FCE7E3",
    text: "#A95A4E",
    dot: "#D46C5E",
    border: "#F0B5AF",
  },
  insuficiente: {
    bg: "#F1F0EE",
    text: "#6A625F",
    dot: "#A7A19A",
    border: "#D8D3CB",
  },
};

export const periodIcons: Record<string, string> = {
  madrugada: "🌙",
  manha: "☀️",
  tarde: "⛅",
  noite: "⭐",
};

export const periodRanges: Record<string, string> = {
  madrugada: "0h – 6h",
  manha: "6h – 12h",
  tarde: "12h – 18h",
  noite: "18h – 0h",
};

export function toPeriods(summary: DailySummary): Period[] {
  return summary.periods?.map((period) => {
    const state: PeriodState =
      period.conclusive && period.predominant
        ? period.predominant
        : "insuficiente";
    const acceleratedShare = period.distribution.acelerado;

    return {
      id: period.period,
      label: period.label.replace(/^de |^à /, "").replace(/^a /, ""),
      timeRange: periodRanges[period.period],
      state,
      stateLabel: stateLabels[state],
      fc: period.metrics?.heart_rate_avg ?? null,
      rmssd: period.metrics?.rmssd_avg ?? null,
      activity: period.metrics?.activity_avg ?? null,
      pct: acceleratedShare != null ? acceleratedShare * 100 : null,
      readings: period.readings_used,
      highlight: state === "acelerado",
      note: period.observation,
    };
  });
}
