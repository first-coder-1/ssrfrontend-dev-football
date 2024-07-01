import { useEffect, useState } from "react";
import { ActiveSeason, getPlayerSeasons } from "@/api";

export function usePlayerSeasons(playerId?: number) {
  const [seasons, setSeasons] = useState<ActiveSeason[]>([]);
  useEffect(() => {
    if (playerId) {
      const [promise, cancel] = getPlayerSeasons(playerId);
      promise.then(
        (res) => setSeasons(res.data),
        () => setSeasons([]),
      );
      return cancel;
    }
  }, [playerId]);

  return seasons;
}
