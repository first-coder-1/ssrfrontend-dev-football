import { useEffect, useState } from "react";
import {
  getActiveRound,
  getActiveSeason,
  getFixturesByRound,
  getFixturesByStage,
  getRoundsBySeason,
  getStagesBySeason,
  League,
  LeagueSeason,
  maxPage,
  minPage,
  Round,
  Stage,
  TeamSeasonFixture,
} from "../../../api";
import { TLeagueMatchesData } from "@/pages/soccer/leagues/[type]/[id]/summary";

type Response = {
  fixtures: TeamSeasonFixture[];
  min: number;
  max: number;
};

const initialResponse = { fixtures: [] as TeamSeasonFixture[], min: 1, max: 1 };

export const useMatchesData = (
  league: League,
  season?: LeagueSeason,
  //@ts-ignore
  initialState?: TLeagueMatchesData
) => {
  const [rounds, setRounds] = useState<Round[]>(initialState?.rounds ? initialState?.rounds : []);
  const [activeRound, setActiveRound] = useState<Round | undefined>(
    initialState?.activeRound ? initialState?.activeRound : undefined
  );
  const [stages, setStages] = useState<Stage[]>([] as Stage[]);
  const [activeStage, setActiveStage] = useState<Stage | undefined>(
    initialState?.activeStage ? initialState?.activeStage : undefined
  );

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(initialState?.response || initialResponse);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!season) {
      return;
    }

    const isGetRoundsEnabled = !league.is_cup;
    const isGetStagesEnabled =
      league.is_cup ||
      (!league.is_cup &&
        league.active &&
        (!!league.current_stage_id || !!season?.stage_id) &&
        !league.current_round_id);

    const [getRoundsBySeasonFetch, getRoundsBySeasonCancel] = getRoundsBySeason(
      season._id,
      season.current_stage_id || undefined
    );
    const [getStagesBySeasonFetch, getStagesBySeasonCancel] = getStagesBySeason(season._id);

    Promise.all([isGetRoundsEnabled && getRoundsBySeasonFetch, isGetStagesEnabled && getStagesBySeasonFetch])
      .then(([roundsResponse, stagesResponse]) => {
        if (roundsResponse) {
          setRounds(roundsResponse.data);
          setActiveRound(getActiveRound(roundsResponse.data, season.current_round_id));
        }

        if (stagesResponse) {
          setStages(stagesResponse.data);
          setActiveStage(getActiveSeason(stagesResponse.data, season.current_stage_id));
        }
      })
      .catch(() => {
        setRounds([]);
        setActiveRound(null as unknown as Round);
        setStages([]);
        setActiveStage(null as unknown as Stage);
        setLoading(false);
      });

    return () => {
      getRoundsBySeasonCancel();
      getStagesBySeasonCancel();
    };
  }, [season, league]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [page, activeStage]);

  useEffect(() => {
    let result: ReturnType<typeof getFixturesByRound | typeof getFixturesByStage> | undefined;
    if (activeRound) {
      result = getFixturesByRound(activeRound?._id);
    } else if (activeStage) {
      result = getFixturesByStage(
        activeStage?._id,
        activeStage.type === "Group Stage" || activeStage.has_standings ? undefined : page
      );
    }
    if (result) {
      const [promise, cancel] = result;
      setLoading(true);
      promise.then(
        (res) => {
          setResponse({ fixtures: res.data, min: minPage(res, 32), max: maxPage(res, 32) });
          setLoading(false);
        },
        () => {
          setResponse(initialResponse);
          setLoading(false);
        }
      );
      return cancel;
    }
  }, [league, activeRound, activeStage, page]);

  return {
    rounds,
    activeRound,
    setActiveRound,
    stages,
    activeStage,
    setActiveStage,
    loading,
    response,
    page,
    setPage,
  };
};
