import React, { FC, useEffect, useState } from "react";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import Head from "next/head";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import {
  League,
  LeagueSeason,
  getActiveLeagueSeason,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getStandingsByStage,
} from "@/api";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Matches from "@/components/LeaguePage/Matches";
import { getMatchesData } from "@/utils/getMatchesData";
import { TLeagueMatchesData } from "./summary";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";

type TMatchPageProps = {
  league: League;
  matchesData: TLeagueMatchesData;
  activeLeagueSeason: LeagueSeason;
  layoutData: TLeagueLayoutData;
};

const MatchesPage: FC<TMatchPageProps> = ({ league, activeLeagueSeason, matchesData, layoutData }) => {
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
          {intl.get("title.league.matches", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.matches", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.matches", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.matches", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Matches league={league} season={activeSeason} matches={matchesData} />
    </LeaguePageLayout>
  );
};

export default observer(MatchesPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const [getLeagueStatsPromise] = getLeagueStats(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, getLeagueStatsPromise])
    .then(([leagueRes, leagueSeasonsRes, leagueStatsRes]) => {
      props = {
        ...props,
        league: leagueRes.data,
        layoutData: { league: leagueRes.data, stats: leagueStatsRes.data, seasons: leagueSeasonsRes.data },
      };

      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);
      const [getStandingsPromise] = getStandingsByStage(activeLeagueSeason?.stage_id!);

      props = {
        ...props,
        activeLeagueSeason: activeLeagueSeason,
      };
      const getMatchesDataPromise = getMatchesData(leagueRes.data, activeLeagueSeason);
      return Promise.all([getMatchesDataPromise, getStandingsPromise]);
    })
    .then(([matchesData, standings]) => {
      props = {
        ...props,
        matchesData: matchesData,
        layoutData: { ...props.layoutData!, standings: standings.data },
      };

      return { props };
    })
    .catch(() => {
      return { props };
    });
});
