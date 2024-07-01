import { EventType, FixtureEvent, Lineups, Squad, Squads } from "@/api";

export const getTeamReserves = (lineups: Lineups, events: FixtureEvent[], squad: Squads<Squad>) => {
  const playerIds = lineups.lineup.filter((lineup) => lineup.player_id).map((lineup) => lineup.player_id) || [];
  if (!squad) {
    return undefined;
  }
  if (playerIds.length === 0) {
    const eventIds = events.filter((event) => event.type === EventType.SUBSTITUTION).map((event) => event.player_id);
    return squad?.squad.filter((squad) => squad.player && eventIds.includes(squad.player_id)) || [];
  }
  return squad?.squad.filter((squad) => squad.player && !playerIds.includes(squad.player_id)) || [];
};
