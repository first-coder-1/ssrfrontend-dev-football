import { useEffect, useState } from "react";
import { ActiveSeason } from "@/api";
import { useEffectWithoutFirstRender } from "./useEffectWOFirst";

export function useActiveSeason(
  seasons: ActiveSeason[],
  defaultSeasonId?: number,
  initialState: ActiveSeason | undefined = undefined
) {
  const [activeSeason, setActiveSeason] = useState<ActiveSeason | undefined>(initialState);
  useEffect(() => {
    setActiveSeason(
      seasons.find((season) => season._id === defaultSeasonId && season.has_fixtures) ||
        seasons.find((season) => season.has_fixtures) ||
        seasons[0]
    );
  }, [setActiveSeason, seasons, defaultSeasonId]);

  return [activeSeason, setActiveSeason] as const;
}
