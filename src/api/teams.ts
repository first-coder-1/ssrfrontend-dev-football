import {
  CountryTeams,
  MyTeam,
  Ranking,
  SeasonTeam,
  Team,
  TeamShort,
} from "./types";
import { get } from "./base";

export const national =
  process.env.NEXT_PUBLIC_NATIONAL_TEAMS?.split(",").map((str) =>
    parseInt(str.trim(), 10),
  ) || [];
export const domestic =
  process.env.NEXT_PUBLIC_DOMESTIC_TEAMS?.split(",").map((str) =>
    parseInt(str.trim(), 10),
  ) || [];
export const h2h =
  process.env.NEXT_PUBLIC_H2H_TEAMS?.split(",").map((str) =>
    parseInt(str.trim(), 10),
  ) || [];

export function getMyTeams(id: number[]) {
  return get<MyTeam[]>("/my/teams", {
    params: {
      id: id.join(","),
    },
  });
}

export function getSelectedTeams() {
  return getMyTeams([...national, ...domestic]);
}

export function getTeam(id: number | string) {
  return get<Team>(`/teams/${id}`);
}

export function getTeamsBySeasonId(seasonId: number, withSidelined?: boolean) {
  return get<SeasonTeam[]>(`/seasons/${seasonId}/teams`, {
    params: {
      with_sidelined: withSidelined,
    },
  });
}

export function getTeamsByLeague(leagueId: number | string) {
  return get<TeamShort[]>(`/leagues/${leagueId}/teams`);
}

export function getTeams(national?: boolean, skip?: number, limit?: number) {
  return get<CountryTeams[]>(`/teams`, {
    params: {
      national_team: Number(!!national),
      skip,
      limit,
    },
  });
}

export function getRankings(fifa?: boolean) {
  return get<Ranking[]>(`/teams/rankings`, {
    params: {
      fifa: Number(!!fifa),
    },
  });
}
