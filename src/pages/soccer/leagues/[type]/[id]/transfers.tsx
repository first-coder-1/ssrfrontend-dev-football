import React, { FC } from "react";
import {
  League,
  LeagueSeason,
  Stage,
  StandingsExtended,
  Standings as TStandings,
  Transfer as TTransfer,
  getActiveLeagueSeason,
  getActiveSeason,
  getLeague,
  getLeagueSeasons,
  getLeagueStats,
  getSeasonTransferYears,
  getSeasonTransfersByYear,
  getStagesBySeason,
  getStandingsByStageExtended,
} from "@/api";
import { Standings } from "@/components/LeaguePage/Standings/Standings";
import { Transfers } from "@/components/LeaguePage/Transfers/Transfers";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { getLeagueLayoutData } from "@/utils/getLayoutData";

type TTransfersPageProps = {
  league: League;
  activeLeagueSeason: LeagueSeason;
  transfers: TTransfer[];
  layoutData: TLeagueLayoutData;
};

const TransfersPage: FC<TTransfersPageProps> = ({ league, activeLeagueSeason, transfers, layoutData }) => {
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
          {intl.get("title.league.transfers", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.transfers", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.transfers", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.transfers", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Transfers league={league} season={activeLeagueSeason} transfers={transfers} />
    </LeaguePageLayout>
  );
};

export default observer(TransfersPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TTransfersPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const layoutData = getLeagueLayoutData(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, layoutData])
    .then(([leagueRes, leagueSeasonsRes, layoutData]) => {
      props = { ...props };

      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);

      props = {
        ...props,
        league: leagueRes.data,
        activeLeagueSeason: activeLeagueSeason,
        layoutData: layoutData,
      };

      const [getTransferYearsPromise] = getSeasonTransferYears(activeLeagueSeason._id);
      return getTransferYearsPromise;
    })
    .then((yearsRes) => {
      const currentYear = yearsRes.data[0];
      const [getTransfersPromise] = getSeasonTransfersByYear(props.activeLeagueSeason!._id, currentYear);
      return getTransfersPromise;
    })
    .then((transfersRes) => {
      props = {
        ...props,
        transfers: transfersRes.data.transfers,
      };

      return { props };
    })
    .catch((err) => {
      console.error(err);
      return { props };
    });
});
