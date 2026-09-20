import type {
  ActivationState,
  DailyMetrics,
  PeriodMetrics,
  PeriodName,
} from "./health";

export interface PeriodSummary {
  period: PeriodName;
  label: string;
  readings_used: number;
  conclusive: boolean;
  distribution: Partial<Record<ActivationState, number>>;
  predominant: ActivationState | null;
  activation_score: number | null;
  metrics: PeriodMetrics | null;
  observation: string;
}

export interface DailySummary {
  child_id: string;
  window_start: string;
  window_end: string;
  readings_received: number;
  readings_used: number;
  readings_discarded: number;
  day_activation_score: number;
  day_metrics: DailyMetrics;
  periods: PeriodSummary[];
  data_quality_note: string | null;
  disclaimer: string;
}
