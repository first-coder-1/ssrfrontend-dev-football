import { format } from "date-fns";
import {
  AdditionalInfo,
  Comments,
  Fixture,
  FixtureEvent,
  FixtureStats,
  FixtureWithMarket,
  H2HFixture,
  FixtureLeague,
  Lineups,
  LivescoreEvents,
  Odds,
  Side,
  TeamSeasonFixture,
  PlayerSeasonFixture,
  Highlight,
} from "./types";
import { get } from "./base";

export type FixtureStatusParam = "live" | "fin" | "sch";

export function getLivescoreEvents() {
  return get<LivescoreEvents[]>("/livescores/events");
}

export function getLivescores(
  bytime?: boolean,
  status?: FixtureStatusParam,
  esoccer?: boolean,
  friendly?: boolean,
  women?: boolean,
  skip?: number,
  limit?: number,
  leagueIds?: number[]
) {
  return get<FixtureLeague[]>("/livescores", {
    params: {
      bytime: Number(bytime),
      esoccer: Number(esoccer),
      friendly: Number(friendly),
      women: Number(women),
      status,
      skip,
      limit,
      leagueIds: leagueIds?.join(","),
    },
  });
}

export function getLivescoresNow(status?: FixtureStatusParam) {
  return get<FixtureLeague[]>("/livescores/now", {
    params: {
      status,
    },
  });
}

export function getLivescoreOdds(bookmaker?: number, esoccer?: boolean, friendly?: boolean, women?: boolean) {
  return get<FixtureLeague<FixtureWithMarket>[]>("/livescores/odds", {
    params: {
      esoccer: Number(esoccer),
      friendly: Number(friendly),
      women: Number(women),
      bookmaker,
    },
  });
}

export function getFixturesByDate(
  date: Date,
  bytime?: boolean,
  status?: FixtureStatusParam,
  esoccer?: boolean,
  friendly?: boolean,
  women?: boolean,
  skip?: number,
  limit?: number,
  leagueIds?: number[]
) {
  return get<FixtureLeague[]>(`/fixtures/bydate/${format(date, "yyyy-MM-dd")}`, {
    params: {
      bytime: Number(bytime),
      esoccer: Number(esoccer),
      friendly: Number(friendly),
      women: Number(women),
      status,
      skip,
      limit,
      leagueIds: leagueIds?.join(","),
    },
  });
}

export function getTeamLastMatch(teamId: number) {
  return get<Fixture>(`/teams/${teamId}/last-match`);
}

export function getFixtureEvents(fixtureId: number) {
  return get<{ events: FixtureEvent[] }>(`/fixtures/${fixtureId}/events`);
}

export function getFixtureHighlights(fixtureId: number, type?: "clip") {
  return get<Highlight[]>(`/fixtures/${fixtureId}/highlights`, {
    params: {
      type,
    },
  });
}

export function getFixturesByTeamAndSeason(teamId: number, seasonId: number, page: number, side?: Side, perPage = 10) {
  return get<TeamSeasonFixture[]>(`/teams/${teamId}/fixtures/${seasonId}`, {
    params: {
      page,
      perPage,
      side,
    },
  });
}

export function getFixture(id: number) {
  return get<Fixture>(`/fixtures/${id}`);
}

export function getFixtureLineup(id: number) {
  return get<Lineups>(`/fixtures/${id}/lineup`);
}

export function getFixtureAdditionalInfo(id: number) {
  return get<AdditionalInfo>(`/fixtures/${id}/additional`);
}

export function getFixtureOdds(id: number, bookmaker?: number) {
  return get<Odds>(`/fixtures/${id}/odds`, {
    params: {
      bookmaker,
    },
  });
}

export function getFixtureStats(id: number) {
  return get<FixtureStats>(`/fixtures/${id}/stats`);
}

export function getFixtureComments(id: number) {
  return get<Comments>(`/fixtures/${id}/comments`);
}

export function getFixturesByStage(stageId: number, page?: number) {
  return get<TeamSeasonFixture[]>(`/stages/${stageId}/fixtures`, {
    params: { page },
  });
}

export function getH2HFixturesByTeamsAndSeason(
  team1Id: number,
  team2Id: number,
  page: number,
  side?: Side,
  perPage = 10
) {
  return get<H2HFixture[]>(`/h2h/${team1Id}/${team2Id}/fixtures`, {
    params: {
      page,
      perPage,
      side,
    },
  });
}

export function getFixturesByRound(roundId: number) {
  return get<TeamSeasonFixture[]>(`/rounds/${roundId}/fixtures`);
}

export function getFixturesByPlayerAndSeason(playerId: number, seasonIds: number[], page: number) {
  return get<PlayerSeasonFixture[]>(`/players/${playerId}/fixtures`, {
    params: {
      season_id: seasonIds.join(","),
      page,
    },
  });
}

export function getMyFixtures(ids: number[]) {
  return get<{ _id: number; time: { starting_at: number } }[]>("/my/fixtures", {
    params: {
      id: ids.join(","),
    },
  });
}

export function getFavoriteCount(leagueIds: number[], teamIds: number[], fixtureIds: number[]) {
  return get<number[]>("/fixtures/favorite", {
    params: {
      leagueIds: leagueIds.join(","),
      teamIds: teamIds.join(","),
      fixtureIds: fixtureIds.join(","),
    },
  });
}
