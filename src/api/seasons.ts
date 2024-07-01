import {
  ActiveSeason,
  LeagueSidelined,
  Round,
  Sidelineds,
  SeasonVenue,
  Stage,
} from "./types";
import { get } from "./base";

export function getTeamActiveSeasons(teamId: number) {
  return get<ActiveSeason[]>(`/teams/${teamId}/active-seasons`);
}

export type TeamHistorySeasonsOptions = {
  withSquads?: boolean;
  withSidelined?: boolean;
  withStats?: boolean;
};

export function getTeamHistorySeasons(
  teamId: number,
  options?: TeamHistorySeasonsOptions,
) {
  return get<ActiveSeason[]>(`/teams/${teamId}/history-seasons`, {
    params: {
      with_squads: Number(options?.withSquads) || 0,
      with_sidelined: Number(options?.withSidelined) || 0,
      with_stats: Number(options?.withStats) || 0,
    },
  });
}

export function getPlayerSeasons(playerId: number) {
  return get<ActiveSeason[]>(`/players/${playerId}/seasons`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}

export function getRoundsBySeason(seasonId: number, stageId?: number) {
  return get<Round[]>(`/seasons/${seasonId}/rounds`, {
    params: {
      stage_id: stageId,
    },
  });
}

export function getActiveRound(
  rounds: Round[],
  defaultRoundId?: number | null,
) {
  return rounds.find((round) => round._id === defaultRoundId) || rounds[0];
}

export function getStagesBySeason(seasonId: number) {
  return get<Stage[]>(`/seasons/${seasonId}/stages`);
}

export function getActiveSeason(
  seasons: Stage[],
  defaultStageId?: number | null,
) {
  return (
    seasons.find(
      (stage) => stage._id === defaultStageId && stage.has_fixtures,
    ) ||
    seasons.find((stage) => stage.has_fixtures) ||
    seasons[0]
  );
}

export function getSeasonSidelinedYears(seasonId: number) {
  return get<number[]>(`/seasons/${seasonId}/sidelined-years`);
}

export function getSidelinedBySeasonAndYear(
  seasonId: number,
  year: number,
  page: number,
  teamId?: number,
) {
  return get<Sidelineds<LeagueSidelined>>(
    `/seasons/${seasonId}/sidelined/${year}`,
    {
      params: {
        page,
        team_id: teamId,
      },
    },
  );
}

export function getVenuesBySeason(seasonId: number) {
  return get<SeasonVenue[]>(`/seasons/${seasonId}/venues`);
}
