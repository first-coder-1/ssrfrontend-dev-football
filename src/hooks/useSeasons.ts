import { useActiveSeason } from "./useActiveSeason";
import { useHistorySeasons } from "./useHistorySeasons";
import { ActiveSeason, TeamHistorySeasonsOptions } from "@/api";

export function useSeasons(
  teamId: number,
  defaultSeasonId?: number,
  options?: TeamHistorySeasonsOptions,
  initialActiveSeason?: ActiveSeason
) {
  const seasons = useHistorySeasons(teamId, options);
  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, defaultSeasonId, initialActiveSeason);

  return [seasons, activeSeason, setActiveSeason] as const;
}
