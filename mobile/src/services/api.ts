import { readings } from "@/mock/readings";
import type { DailySummary } from "@/types/daily-summary";
import { network } from "./instance";

export async function getDailySummary(): Promise<DailySummary> {
  const data = await network.post("/insights", { ...readings });
  return data.data;
}

export const mockApi = {
  getDailySummary,
};
