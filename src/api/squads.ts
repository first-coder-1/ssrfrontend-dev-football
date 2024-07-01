import { PlayerShort, Sidelineds, Squad, Squads, SquadStat } from "./types";
import { get } from "./base";

export function getCurrentSquadsByTeamAndSeason(
  teamId: number,
  seasonId: number,
) {
  return get<Squads<Squad>>(`/teams/${teamId}/squads/${seasonId}/current`);
}

export function getCurrentCoachByTeamAndSeason(
  teamId: number,
  seasonId: number,
) {
  return get<PlayerShort>(`/teams/${teamId}/coaches/${seasonId}`);
}

export function getSquadStatsByTeamAndSeason(teamId: number, seasonId: number) {
  return get<Squads<SquadStat>>(`/teams/${teamId}/squads/${seasonId}/stats`);
}

export function getSquadSidelinedByTeamAndSeason(
  teamId: number,
  seasonId: number,
) {
  return get<Sidelineds>(`/teams/${teamId}/squads/${seasonId}/sidelined`);
}
