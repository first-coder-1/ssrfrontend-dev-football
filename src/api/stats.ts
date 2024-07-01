import { get } from "./base";
import { Assistscorer, Cardscorer, Stats, Topscorer } from "./types";

export function getStatsByTeamAndSeason(teamId: number, seasonId: number) {
  return get<Stats>(`/teams/${teamId}/stats/${seasonId}`);
}

export function getTopscorersBySeasonAndTeam(seasonId: number, teamId: number) {
  return get<Topscorer[]>(`/seasons/${seasonId}/topscorers/${teamId}`);
}

export function getAssistscorersBySeasonAndTeam(
  seasonId: number,
  teamId: number,
) {
  return get<Assistscorer[]>(`/seasons/${seasonId}/assistscorers/${teamId}`);
}

export function getCardscorersBySeasonAndTeam(
  seasonId: number,
  teamId: number,
) {
  return get<Cardscorer[]>(`/seasons/${seasonId}/cardscorers/${teamId}`);
}

export function getTopscorersBySeason(seasonId: number, page: number) {
  return get<Topscorer[]>(`/seasons/${seasonId}/topscorers`, {
    params: {
      page,
    },
  });
}

export function getAssistscorersBySeason(seasonId: number, page: number) {
  return get<Assistscorer[]>(`/seasons/${seasonId}/assistscorers`, {
    params: {
      page,
    },
  });
}

export function getCardscorersBySeason(seasonId: number, page: number) {
  return get<Cardscorer[]>(`/seasons/${seasonId}/cardscorers`, {
    params: {
      page,
    },
  });
}
