import { LeagueTrophy, PlayerTrophies, Trophies, TrophyTotal } from "./types";
import { get } from "./base";

export function getTrophiesByTeam(teamId: number) {
  return get<Trophies>(`/teams/${teamId}/trophies`);
}

export function getTrophiesTable(teamId: number) {
  return get<TrophyTotal[]>(`/teams/${teamId}/trophies/table`);
}

export function getTrophiesByLeague(leagueId: number) {
  return get<LeagueTrophy[]>(`/leagues/${leagueId}/trophies`);
}

export function getTrophiesByPlayer(playerId: number) {
  return get<PlayerTrophies[]>(`/players/${playerId}/trophies`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}
