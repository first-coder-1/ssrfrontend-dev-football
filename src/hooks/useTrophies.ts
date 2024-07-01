import { useEffect, useState } from "react";
import { getTrophiesByTeam, Trophy } from "@/api";

export function useTrophies(
  teamId: number,
  setLoading?: (loading: boolean) => void,
  initialTrophiesMap?: Map<string, Trophy[]>
) {
  const [map, setMap] = useState<Map<string, Trophy[]>>(initialTrophiesMap ? initialTrophiesMap : new Map());
  useEffect(() => {
    if (setLoading) {
      setLoading(true);
    }
    const [promise, cancel] = getTrophiesByTeam(teamId);
    promise
      .then((res) =>
        setMap(
          res.data.trophies.reduce((map, trophy) => {
            const key = trophy.league_type || "other";
            if (map.has(key)) {
              map.get(key)!.push(trophy);
            } else {
              map.set(key, [trophy]);
            }

            return map;
          }, new Map())
        )
      )
      .finally(() => {
        if (setLoading) {
          setLoading(false);
        }
      });
    return cancel;
  }, [teamId, setLoading]);

  return map;
}
