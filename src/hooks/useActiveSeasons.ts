import { useEffect, useState } from "react";
import { ActiveSeason, getTeamActiveSeasons } from "@/api";

export function useActiveSeasons(teamId?: number) {
  const [seasons, setSeasons] = useState<ActiveSeason[]>([]);
  useEffect(() => {
    if (teamId) {
      const [promise, cancel] = getTeamActiveSeasons(teamId);
      promise.then((res) => setSeasons(res.data));
      return cancel;
    }
  }, [teamId]);

  return seasons;
}
