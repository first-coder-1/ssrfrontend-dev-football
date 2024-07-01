import { useEffect, useMemo, useState } from "react";
import { EventType, FixtureEvent, getCurrentSquadsByTeamAndSeason, Lineups, Squad, Squads } from "@/api";

export function useTeamReserves(teamId: number, seasonId: number, lineups: Lineups, events: FixtureEvent[]) {
  const [squad, setSquad] = useState<Squads<Squad>>();
  useEffect(() => {
    const [promise, cancel] = getCurrentSquadsByTeamAndSeason(teamId, seasonId);
    promise.then((res) => setSquad(res.data));
    return cancel;
  }, [teamId, seasonId]);

  return useMemo(() => {
    const playerIds = lineups.lineup.filter((lineup) => lineup.player_id).map((lineup) => lineup.player_id) || [];
    if (playerIds.length === 0) {
      const eventIds = events.filter((event) => event.type === EventType.SUBSTITUTION).map((event) => event.player_id);
      return squad?.squad.filter((squad) => squad.player && eventIds.includes(squad.player_id)) || [];
    }
    return squad?.squad.filter((squad) => squad.player && !playerIds.includes(squad.player_id)) || [];
  }, [squad, lineups, events]);
}
