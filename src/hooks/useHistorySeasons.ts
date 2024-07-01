import { useEffect, useState } from "react";
import {
  ActiveSeason,
  getTeamHistorySeasons,
  TeamHistorySeasonsOptions,
} from "@/api";

export function useHistorySeasons(
  teamId: number,
  options?: TeamHistorySeasonsOptions,
) {
  const [seasons, setSeasons] = useState<ActiveSeason[]>([]);
  useEffect(() => {
    const [promise, cancel] = getTeamHistorySeasons(teamId, options);
    promise.then((res) => setSeasons(res.data));
    return cancel;
  }, [teamId, options]);

  return seasons;
}
