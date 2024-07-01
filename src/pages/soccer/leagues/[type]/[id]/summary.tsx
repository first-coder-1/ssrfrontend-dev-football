import React, { FC, useEffect, useState } from "react";
import { useActiveTab } from "@/utils/getActiveTab";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import {
  League,
  LeagueSeason,
  LeagueStats,
  LeagueType,
  Round,
  Stage,
  StandingsExtended,
  TeamSeasonDoubleFixture,
  Topscorer,
  getActiveLeagueSeason,
  getActiveRound,
  getActiveSeason,
  getFixturesByStage,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getRoundsBySeason,
  getStagesBySeason,
  getStandingsByStageExtended,
  getTopscorersBySeason,
} from "@/api";
import Summary from "@/components/LeaguePage/Summary";
import PlaceholderPage from "@/components/PlaceholderPage";
import PlaceholderList from "@/components/PlaceholderList";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { getMatchesData } from "@/utils/getMatchesData";
import { Response } from "@/components/TeamFixtureList";
import { isFinished } from "@/utils";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { useRouter } from "next/router";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

export type TLeagueMatchesData = {
  rounds: Round[];
  activeRound?: Round | null;
  activeStage?: Stage | null;
  response: Response;
};

type TLeagueSummaryProps = {
  league: League;
  leagueSeason: LeagueSeason;
  matchesData: TLeagueMatchesData;
  standings: StandingsExtended;
  stages: Stage[];
  topscorers: Topscorer[];
  leagueStats: LeagueStats;
  doubleFixtures: TeamSeasonDoubleFixture[][];
  layoutData: TLeagueLayoutData;
};

const LeagueSummary: FC<TLeagueSummaryProps> = ({
  league: initialLeague,
  leagueSeason: initialLeagueSeason,
  matchesData,
  standings,
  stages,
  topscorers,
  leagueStats,
  doubleFixtures,
  layoutData,
}) => {
  const intl = useIntl();

  const {
    query: { type, id },
  } = useRouter();

  const { auth, favorites, settings, intermediate } = useMst();

  layoutData = { ...layoutData, standings: standings, stats: leagueStats };

  const [league, setLeague] = useState<League | undefined | null>(initialLeague);
  const [activeSeason, setActiveSeason] = useState(initialLeagueSeason);

  useEffectWithoutFirstRender(() => {
    const leagueId = parseInt(id! as string, 10);
    const [getLeagueFetch, getLeagueCancel] = getLeague(leagueId);
    const [getLeagueSeasonsFetch, getLeagueSeasonsCancel] = getLeagueSeasons(leagueId);

    Promise.all([getLeagueFetch, getLeagueSeasonsFetch])
      .then(([leagueResponse, seasonsResponse]) => {
        const leagueData = leagueResponse.data;
        const seasonsData = seasonsResponse.data;
        setLeague(leagueData);
        setActiveSeason(getActiveLeagueSeason(seasonsData, leagueData.current_season_id));
      })
      .catch(() => {
        setLeague(null);
      });

    return () => {
      getLeagueCancel();
      getLeagueSeasonsCancel();
    };
  }, [id]);

  useEffect(() => {
    if (intermediate.activeSeason) {
      setActiveSeason(intermediate.activeSeason);
    }
  }, [intermediate.activeSeason]);

  if (!league) {
    return null;
  }

  const leagueTitleData = {
    name: (!settings.originalNames && league.name_loc) || league.name,
    country: league.country_iso2 ? `(${intl.get(`countries.${league.country_iso2}`)}) ` : ``,
  };

  return (
    <LeaguePageLayout layoutData={layoutData}>
      <Head>
        <title>
          {intl.get("title.league.summary", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.summary", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.summary", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.summary", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
      </Head>
      <Summary
        league={league}
        season={activeSeason}
        matches={matchesData}
        standings={standings}
        stages={stages}
        topscorers={topscorers}
        leagueStats={leagueStats}
        doubleFixtures={doubleFixtures}
      />
    </LeaguePageLayout>
  );
};

export default observer(LeagueSummary);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TLeagueSummaryProps> = {};
  let rawStages: Stage[];

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const [getLeagueStatsPromise] = getLeagueStats(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, getLeagueStatsPromise])
    .then(([leagueRes, leagueSeasonsRes, leagueStatsRes]) => {
      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);
      props = {
        ...props,
        league: leagueRes.data,
        leagueStats: leagueStatsRes.data,
        leagueSeason: activeLeagueSeason,
        layoutData: { seasons: leagueSeasonsRes.data, league: leagueRes.data, stats: leagueStatsRes.data },
      };

      return getMatchesData(leagueRes.data, activeLeagueSeason);
    })
    .then((matchesData) => {
      props = {
        ...props,
        matchesData: matchesData,
      };
      const [getStagesBySeasonPromise] = getStagesBySeason(props.leagueSeason?._id!);

      return getStagesBySeasonPromise;
    })
    .then((stagesRes) => {
      const stages = stagesRes.data;
      rawStages = stagesRes.data;

      const stagesData = stages.filter((stage) => stage.has_standings);
      props = {
        ...props,
        stages: stagesData,
      };
      const activeStage = getActiveSeason(stagesData, props.league?.current_stage_id);

      const [getStandingsPromise] = getStandingsByStageExtended(activeStage?._id!);
      const [getTopscorersBySeasonPromise] = getTopscorersBySeason(props.leagueSeason?._id!, 1);

      const returns = stages.map((stage) => getFixturesByStage(stage._id));
      const getDoubleFixturesPromise = returns.map((result) => result[0]);

      return Promise.all([getStandingsPromise, getTopscorersBySeasonPromise, getDoubleFixturesPromise]);
    })
    .then(([standingsRes, topscorersRes, doubleFixturesRes]) => {
      props = {
        ...props,
        standings: standingsRes.data,
        topscorers: topscorersRes.data,
      };

      return Promise.all(doubleFixturesRes);
    })
    .then((doubleFixturesRes) => {
      const groupStageIndex = rawStages.findIndex((stage) => stage.type === "Group Stage"); // keep in mind that props.stages is not really stages that we need, just TEST CASE

      const doubleFixtures = doubleFixturesRes.map((result, i) => {
        return result.data.reduce<TeamSeasonDoubleFixture[]>((fixtures, fixture) => {
          const prev = fixtures.find(
            (prev) => prev.localteam_id === fixture.visitorteam_id && prev.visitorteam_id === fixture.localteam_id
          );

          const finished = isFinished(fixture.time.status);

          if (prev && i > groupStageIndex) {
            if (finished) {
              prev.localteam_scores.push(fixture.visitorteam_score);
              prev.visitorteam_scores.push(fixture.localteam_score);
            }
          } else {
            fixtures.push({
              ...fixture,
              localteam_scores: finished ? [fixture.localteam_score] : [],
              visitorteam_scores: finished ? [fixture.visitorteam_score] : [],
            });
          }

          return fixtures;
        }, []);
      });

      props = {
        ...props,
        doubleFixtures: doubleFixtures,
      };

      return { props };
    })
    .catch((error) => {
      console.error("Error:", error);
      return { props };
    });
});
