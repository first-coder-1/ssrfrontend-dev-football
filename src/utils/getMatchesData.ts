import {
  League,
  LeagueSeason,
  Round,
  Stage,
  getActiveRound,
  getActiveSeason,
  getFixturesByRound,
  getFixturesByStage,
  getRoundsBySeason,
  getStagesBySeason,
  maxPage,
  minPage,
} from "@/api";
import { Response } from "@/components/TeamFixtureList";

export async function getMatchesData(league: League, season?: LeagueSeason) {
  const isGetRoundsEnabled = !league.is_cup;
  const isGetStagesEnabled =
    league.is_cup ||
    (!league.is_cup && league.active && (league.current_stage_id || season?.stage_id) && !league.current_round_id);

  let rounds: Round[] = [];
  let activeRound: Round | undefined | null;
  let stages: Stage[] = [];
  let activeStage: Stage | undefined | null;
  let responseProps: Response = { fixtures: [], min: 1, max: 1 };

  if (season) {
    if (isGetRoundsEnabled) {
      const [getRoundsPromise] = getRoundsBySeason(season._id, season.current_stage_id!);
      const roundsResponse = await getRoundsPromise;
      rounds = roundsResponse.data;
      activeRound = getActiveRound(rounds, season.current_round_id);
    }

    if (isGetStagesEnabled) {
      const [getStagesPromise] = getStagesBySeason(season._id);
      const stagesResponse = await getStagesPromise;
      stages = stagesResponse.data;
      activeStage = getActiveSeason(stagesResponse.data, season.current_stage_id);
    }

    if (activeRound) {
      const [getFixturesPromise] = getFixturesByRound(activeRound._id);
      const fixturesResponse = await getFixturesPromise;
      responseProps = {
        fixtures: fixturesResponse.data,
        min: minPage(fixturesResponse, 32),
        max: maxPage(fixturesResponse, 32),
      };
    } else if (activeStage) {
      const [getFixturesPromise] = getFixturesByStage(
        activeStage._id,
        activeStage.type === "Group Stage" || activeStage.has_standings ? undefined : 1
      );
      const fixturesResponse = await getFixturesPromise;
      responseProps = {
        fixtures: fixturesResponse.data,
        min: minPage(fixturesResponse, 32),
        max: maxPage(fixturesResponse, 32),
      };
    }
  }

  const matchData =
    activeRound && activeStage
      ? { rounds, stages, activeRound, activeStage, response: responseProps }
      : activeRound
      ? { rounds, stages, activeRound, activeStage: null, response: responseProps }
      : activeStage
      ? { rounds, stages, activeRound: null, activeStage, response: responseProps }
      : { rounds, stages, activeRound: null, activeStage: null, response: responseProps };

  return matchData;
}
