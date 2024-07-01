import { useEffect, useState } from "react";
import { getTeamTransferYears } from "@/api";

export function useTeamTransferYears(teamId: number, initialYears?: number[]) {
  const [years, setYears] = useState<number[]>(initialYears ? initialYears : []);
  useEffect(() => {
    const [promise, cancel] = getTeamTransferYears(teamId);
    promise.then((res) => setYears(res.data));
    return cancel;
  }, [teamId]);
  const [year, setYear] = useState<number | undefined>(years[0]);
  useEffect(() => {
    setYear(years[0]);
  }, [years]);

  return [years, year, setYear] as const;
}
