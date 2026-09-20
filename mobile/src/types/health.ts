export type PeriodName = "madrugada" | "manha" | "tarde" | "noite";
export type ActivationState = "calmo" | "intermediario" | "acelerado";

export interface PeriodMetrics {
  heart_rate_avg: number;
  rmssd_avg: number;
  activity_avg: number;
}

export interface DailyMetrics {
  heart_rate_avg: number;
  rmssd_avg: number;
  activity_avg: number;
}
