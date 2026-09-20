import {
  ActivationState,
  PeriodNotes,
  PeriodState,
  PeriodSummary,
} from "@/types";
import { capitalize } from "@/utils";

const stateNotes: Record<ActivationState, string> = {
  calmo: "#7AAE8E",
  acelerado: "#D46C5E",
  intermediario: "#d6ac15",
};

export function toNotes(periods: PeriodSummary[]): PeriodNotes[] {
  const calmPeriods = periods?.filter(
    (period) => period.predominant === "calmo",
  );
  const calmTitle = calmPeriods
    ?.map((period) => capitalize(period.period))
    .join(" e ")
    .concat(` equilibrada${calmPeriods.length > 1 ? "s" : ""}`);
  const calmNote = {
    color: stateNotes["calmo"],
    title: calmTitle,
    note: "Sinais de dentro do padrão habitual de Sofia nesses períodos.",
  };

  const periodNotes =
    periods?.flatMap((period) => {
      const state: PeriodState =
        period.conclusive && period.predominant
          ? period.predominant
          : "insuficiente";

      if (state === "insuficiente" || state === "calmo") return [];

      return {
        color: stateNotes[state],
        title: `${capitalize(period.period)} com maior ativação`,
        note: period.observation,
      };
    }) ?? [];

  return [...periodNotes, calmNote];
}
