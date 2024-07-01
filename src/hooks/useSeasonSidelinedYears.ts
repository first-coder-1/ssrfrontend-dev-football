import { useEffect, useState } from "react";
import { getSeasonSidelinedYears } from "@/api";

export function useSeasonSidelinedYears(seasonId?: number) {
  const [years, setYears] = useState<number[]>([]);
  useEffect(() => {
    if (seasonId) {
      const [promise, cancel] = getSeasonSidelinedYears(seasonId);
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
