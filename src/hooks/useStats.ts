import { useEffect, useState } from "react";
import { getStatsByTeamAndSeason, Stats as StatsType } from "@/api";

export function useStats(
  teamId: number,
  seasonId?: number,
  setLoading?: (loading: boolean) => void,
  initialStats?: StatsType
) {
  const [stats, setStats] = useState<StatsType | undefined>(initialStats);
  useEffect(() => {
    if (seasonId) {
      if (setLoading) {
        setLoading(true);
      }
      const [promise, cancel] = getStatsByTeamAndSeason(teamId, seasonId);
      promise
        .then(
          (res) => setStats(res.data),
          () => setStats(undefined)
        )
        .finally(() => {
          if (setLoading) {
            setLoading(false);
          }
        });
      return cancel;
    }
  }, [teamId, seasonId, setLoading]);

  return stats;
}
