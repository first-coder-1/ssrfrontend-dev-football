import React, { FC } from "react";
import {
  League,
  LeagueSeason,
  LeagueTrophy,
  getActiveLeagueSeason,
  getLeague,
  getLeagueSeasons,
  getTrophiesByLeague,
} from "@/api";
import { Standings } from "@/components/LeaguePage/Standings/Standings";
import { Transfers } from "@/components/LeaguePage/Transfers/Transfers";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import Trophies from "@/components/LeaguePage/Trophies";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { getLeagueLayoutData } from "@/utils/getLayoutData";

type TTrophiesPageProps = {
  league: League;
  activeLeagueSeason: LeagueSeason;
  trophies: LeagueTrophy[];
  layoutData: TLeagueLayoutData;
};

const TrophiesPage: FC<TTrophiesPageProps> = ({ league, activeLeagueSeason, trophies, layoutData }) => {
  const intl = useIntl();
  const { auth, favorites, settings } = useMst();

  const leagueTitleData = {
    name: (!settings.originalNames && league.name_loc) || league.name,
    country: league.country_iso2 ? `(${intl.get(`countries.${league.country_iso2}`)}) ` : ``,
  };

  return (
    <LeaguePageLayout layoutData={layoutData}>
      <Head>
        <title>
          {intl.get("title.league.trophies", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.trophies", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.trophies", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.trophies", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      {activeLeagueSeason && <Trophies league={league} trophies={trophies} />}
    </LeaguePageLayout>
  );
};

export default observer(TrophiesPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TTrophiesPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const [getTrophiesPromise] = getTrophiesByLeague(leagueId);
  const layoutData = getLeagueLayoutData(leagueId);

  return Promise.all([getLeaguePromise, getTrophiesPromise, getLeagueSeasonsPromise, layoutData])
    .then(([leagueRes, trophiesRes, leagueSeasonsRes, layoutData]) => {
      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);
      props = {
        ...props,
        league: leagueRes.data,
        trophies: trophiesRes.data,
        activeLeagueSeason: activeLeagueSeason,
        layoutData: layoutData,
      };
      return { props };
    })
    .catch((err) => {
      console.error(err);
      return { props };
    });
});
