import {
  CountryLeagues,
  League,
  LeagueSeason,
  LeagueShort,
  LeagueStats,
  LeagueType,
  MyLeague,
} from "./types";
import { get } from "./base";

export function getMyLeagues(id: number[]) {
  return get<MyLeague[]>("/my/leagues", {
    params: {
      id: id.join(","),
    },
  });
}

export function getSelectedLeagues() {
  return getMyLeagues(
    process.env.NEXT_PUBLIC_POPULAR_LEAGUES?.split(",").map((str) =>
      parseInt(str.trim(), 10),
    ) || [],
  );
}

export function getByCountry(countryId: number | string, type: string) {
  return get<LeagueShort[]>(`/countries/${countryId}/leagues`, {
    params: {
      type,
    },
  });
}

export function getLeagues(type: LeagueType) {
  return get<CountryLeagues[]>(`/leagues`, {
    params: {
      type,
    },
  });
}

export function getLeague(id: number) {
  return get<League>(`/leagues/${id}`);
}

export function getLeagueSeasons(leagueId: number) {
  return get<LeagueSeason[]>(`/leagues/${leagueId}/seasons`);
}

export function getActiveLeagueSeason(
  seasons: LeagueSeason[],
  defaultSeasonId?: number,
) {
  return (
    seasons.find(
      (season) => season._id === defaultSeasonId && season.has_fixtures,
    ) ||
    seasons.find((season) => season.has_fixtures) ||
    seasons[0]
  );
}

export function getLeagueStats(leagueId: number) {
  return get<LeagueStats>(`/leagues/${leagueId}/stats`);
}
