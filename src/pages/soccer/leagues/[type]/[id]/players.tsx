import {
  League,
  LeagueSeason,
  Stage,
  StandingsExtended,
  Standings as TStandings,
  Topscorer,
  getActiveLeagueSeason,
  getActiveSeason,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getStagesBySeason,
  getStandingsByStageExtended,
  getTopscorersBySeason,
} from "@/api";
import Players from "@/components/LeaguePage/Players";
import { Standings } from "@/components/LeaguePage/Standings/Standings";
import { useIntl } from "@/hooks/useIntl";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import React, { FC, useEffect, useState } from "react";

type TPlayersPageProps = {
  league: League;
  topscorers: Topscorer[];
  activeLeagueSeason: LeagueSeason;
  stages: Stage[];
  standings: StandingsExtended;
  layoutData: TLeagueLayoutData;
};

const PlayersPage: FC<TPlayersPageProps> = ({ league, topscorers, activeLeagueSeason, layoutData }) => {
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
          {intl.get("title.league.players", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.players", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.players", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.players", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      {activeLeagueSeason && <Players league={league} season={activeSeason} topscorers={topscorers} />}
    </LeaguePageLayout>
  );
};

export default observer(PlayersPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TPlayersPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const [getLeagueStatsPromise] = getLeagueStats(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, getLeagueStatsPromise])
    .then(([leagueRes, leagueSeasonsRes, leagueStatsRes]) => {
      props = {
        ...props,
        league: leagueRes.data,
        layoutData: { stats: leagueStatsRes.data, league: leagueRes.data, seasons: leagueSeasonsRes.data },
      };

      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);

      props = {
        ...props,
        activeLeagueSeason: activeLeagueSeason,
      };
      const [getTopscorersBySeasonPromise] = getTopscorersBySeason(activeLeagueSeason._id!, 1);

      const [getStagesBySeasonPromise] = getStagesBySeason(activeLeagueSeason._id);

      return Promise.all([getTopscorersBySeasonPromise, getStagesBySeasonPromise]);
    })
    .then(([topscorersRes, stagesRes]) => {
      const stages = stagesRes.data;
      const stagesData = stages.filter((stage) => stage.has_standings);

      props = {
        ...props,
        stages: stagesData,
        topscorers: topscorersRes.data,
      };

      const activeStage = getActiveSeason(stagesData, props.league?.current_stage_id);

      const [getStandingsPromise] = getStandingsByStageExtended(activeStage?._id!);

      return getStandingsPromise;
    })
    .then((standingsRes) => {
      props = {
        ...props,
        standings: standingsRes.data,
        layoutData: { ...props.layoutData!, standings: standingsRes.data },
      };
      return { props };
    })
    .catch(() => {
      return { props };
    });
});
