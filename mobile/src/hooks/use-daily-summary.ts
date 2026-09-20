import { useCallback, useEffect, useState } from "react";

import { getDailySummary } from "@/services/api";
import type { DailySummary } from "@/types/daily-summary";

interface UseDailySummaryResult {
  data: DailySummary | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useDailySummary(): UseDailySummaryResult {
  const [data, setData] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  const retry = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(true);
    setRequestKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    getDailySummary()
      .then((summary) => {
        if (active) {
          setData(summary);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError("Não foi possível carregar o resumo do dia.");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [requestKey]);

  return { data, isLoading, error, retry };
}
