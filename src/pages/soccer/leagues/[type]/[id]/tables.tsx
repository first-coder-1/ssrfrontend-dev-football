import React, { FC, useState, useEffect } from "react";
import {
  League,
  LeagueSeason,
  Stage,
  StandingsExtended,
  Standings as TStandings,
  getActiveLeagueSeason,
  getActiveSeason,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getStagesBySeason,
  getStandingsByStageExtended,
} from "@/api";
import { Standings } from "@/components/LeaguePage/Standings/Standings";
import { useIntl } from "@/hooks/useIntl";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import { getLeagueLayoutData } from "@/utils/getLayoutData";

type TStandingProps = {
  league: League;
  standings: StandingsExtended;
  activeLeagueSeason: LeagueSeason;
  stages: Stage[];
  layoutData: TLeagueLayoutData;
};

const StandingsPage: FC<TStandingProps> = ({ league, standings, activeLeagueSeason, stages, layoutData }) => {
  const intl = useIntl();
  const { auth, favorites, settings, intermediate } = useMst();

  const [activeSeason, setActiveSeason] = useState(activeLeagueSeason);

  const leagueTitleData = {
    name: (!settings.originalNames && league.name_loc) || league.name,
    country: league.country_iso2 ? `(${intl.get(`countries.${league.country_iso2}`)}) ` : ``,
  };

  useEffect(() => {
    if (intermediate.activeSeason) {
      setActiveSeason(intermediate.activeSeason);
    }
  }, [intermediate.activeSeason]);

  return (
    <LeaguePageLayout layoutData={layoutData}>
      <Head>
        <title>
          {intl.get("title.league.tables", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.tables", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.tables", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.tables", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Standings league={league} season={activeSeason} standings={standings} stages={stages} />
    </LeaguePageLayout>
  );
};

export default observer(StandingsPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TStandingProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const layoutData = getLeagueLayoutData(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, layoutData])
    .then(([leagueRes, leagueSeasonsRes, layoutData]) => {
      props = { ...props, league: leagueRes.data, layoutData: layoutData };

      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);

      props = {
        ...props,
        activeLeagueSeason: activeLeagueSeason,
      };

      const [getStagesBySeasonPromise] = getStagesBySeason(activeLeagueSeason._id);

      return getStagesBySeasonPromise;
    })
    .then((stagesRes) => {
      const stages = stagesRes.data;
      const stagesData = stages.filter((stage) => stage.has_standings);

      props = {
        ...props,
        stages: stagesData,
      };

      const activeStage = getActiveSeason(stagesData, props.league?.current_stage_id);

      const [getStandingsPromise] = getStandingsByStageExtended(activeStage?._id!);

      return getStandingsPromise;
    })
    .then((standingsRes) => {
      props = {
        ...props,
        standings: standingsRes.data,
      };
      return { props };
    })
    .catch(() => {
      return { props };
    });
});
