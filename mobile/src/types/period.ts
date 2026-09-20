export type PeriodState =
  | "calmo"
  | "intermediario"
  | "acelerado"
  | "insuficiente";

export interface Period {
  id: string;
  label: string;
  timeRange: string;
  state: PeriodState;
  stateLabel: string;
  fc: number | null;
  rmssd: number | null;
  activity: number | null;
  pct: number | null;
  readings: number;
  highlight: boolean;
  note: string;
}

export interface PeriodNotes {
  color: string;
  title: string;
  note: string;
}
