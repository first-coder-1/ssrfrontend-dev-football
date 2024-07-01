import React, { FC, useEffect, useState } from "react";
import {
  League,
  LeagueSeason,
  Stage,
  StandingsExtended,
  Standings as TStandings,
  Transfer as TTransfer,
  LeagueSidelined as TSidelined,
  getActiveLeagueSeason,
  getActiveSeason,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getSeasonTransferYears,
  getSeasonTransfersByYear,
  getStagesBySeason,
  getStandingsByStageExtended,
  getSidelinedBySeasonAndYear,
  getSeasonSidelinedYears,
  getTeamsBySeasonId,
  pageCount,
  getStandingsByStage,
} from "@/api";
import { Standings } from "@/components/LeaguePage/Standings/Standings";
import { Transfers } from "@/components/LeaguePage/Transfers/Transfers";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import Sidelined from "@/components/LeaguePage/Sidelined";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";

export type TSidelinedsRes = {
  sidelineds: TSidelined[];
  pages: number;
};

type TSidelinedPageProps = {
  league: League;
  activeLeagueSeason: LeagueSeason;
  sidelinedsRes: TSidelinedsRes;
  layoutData: TLeagueLayoutData;
};

const SidelinedPage: FC<TSidelinedPageProps> = ({ league, activeLeagueSeason, sidelinedsRes }) => {
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
    <LeaguePageLayout>
      <Head>
        <title>
          {intl.get("title.league.sidelined", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.sidelined", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.sidelined", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.sidelined", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Sidelined league={league} season={activeSeason} sidelinedsRes={sidelinedsRes} />
    </LeaguePageLayout>
  );
};

export default observer(SidelinedPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TSidelinedPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const [getLeagueStatsPromise] = getLeagueStats(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, getLeagueStatsPromise])
    .then(([leagueRes, leagueSeasonsRes, leagueStatsRes]) => {
      props = { ...props };

      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);

      props = {
        ...props,
        league: leagueRes.data,
        activeLeagueSeason: activeLeagueSeason,
        layoutData: { league: leagueRes.data, seasons: leagueSeasonsRes.data, stats: leagueStatsRes.data },
      };

      const [getSeasonSidelinedYearsPromise] = getSeasonSidelinedYears(activeLeagueSeason._id);
      const [getStandingsPromise] = getStandingsByStage(activeLeagueSeason.stage_id!);
      return Promise.all([getSeasonSidelinedYearsPromise, getStandingsPromise]);
    })
    .then(([yearsRes, standingsRes]) => {
      const currentYear = yearsRes.data[0];
      const [getSidelinedPromise] = getSidelinedBySeasonAndYear(props.activeLeagueSeason!._id, currentYear, 1);
      props = { ...props, layoutData: { ...props.layoutData!, standings: standingsRes.data } };
      return getSidelinedPromise;
    })
    .then((sidelinedRes) => {
      const sidelinedArr = sidelinedRes.data.sidelined.filter((sidelined) => !!sidelined.player);

      props = {
        ...props,
        sidelinedsRes: { sidelineds: sidelinedArr, pages: pageCount(sidelinedRes) },
      };

      return { props };
    })
    .catch((err) => {
      console.error(err);
      return { props };
    });
});
