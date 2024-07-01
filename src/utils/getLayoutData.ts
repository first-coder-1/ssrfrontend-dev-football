import { getActiveLeagueSeason, getLeague, getLeagueSeasons, getLeagueStats, getStandingsByStage } from "@/api";
import { TLeagueLayoutData } from "@/layouts/league";

export const getLeagueLayoutData = async (leagueId: number) => {
  let layoutData: TLeagueLayoutData;
  const [getLeaguePromise] = getLeague(leagueId);
  const [getStatsPromise] = getLeagueStats(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);

  return Promise.all([getLeaguePromise, getStatsPromise, getLeagueSeasonsPromise])
    .then(([leagueRes, statsRes, seasonsRes]) => {
      layoutData = { league: leagueRes.data, stats: statsRes.data, seasons: seasonsRes.data };
      const activeSeason = getActiveLeagueSeason(layoutData.seasons, layoutData.league.current_season_id);
      const [getStandingsPromise] = getStandingsByStage(activeSeason.stage_id!);
      return getStandingsPromise;
    })
    .then(({ data }) => {
      layoutData = { ...layoutData, standings: data };
      return layoutData;
    });
};
