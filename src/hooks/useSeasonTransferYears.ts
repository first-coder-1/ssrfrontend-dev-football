import { useEffect, useState } from "react";
import { getSeasonTransferYears } from "@/api";

export function useSeasonTransferYears(seasonId?: number) {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    if (seasonId) {
      const [promise, cancel] = getSeasonTransferYears(seasonId);
      promise.then((res) => setYears(res.data));
      return cancel;
    }
  }, [seasonId]);

  const [year, setYear] = useState<number | undefined>(years[0]);

  useEffect(() => {
    setYear(years[0]);
  }, [years]);

  return [years, year, setYear] as const;
}
