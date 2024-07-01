import React, { FC } from "react";
import {
  League,
  LeagueSeason,
  LeagueTrophy,
  SeasonVenue,
  Venue,
  getActiveLeagueSeason,
  getLeague,
  getLeagueSeasons,
  getTrophiesByLeague,
  getVenuesBySeason,
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
import { Venues } from "@/components/LeaguePage/Venues/Venues";
import { LeaguePageLayout, TLeagueLayoutData } from "@/layouts/league";
import { getLeagueLayoutData } from "@/utils/getLayoutData";

type TVenuesPageProps = {
  league: League;
  activeLeagueSeason: LeagueSeason;
  venues: SeasonVenue[];
  layoutData: TLeagueLayoutData;
};

const VenuesPage: FC<TVenuesPageProps> = ({ league, activeLeagueSeason, venues, layoutData }) => {
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
          {intl.get("title.league.venues", leagueTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.league.venues", leagueTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.league.venues", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.league.venues", leagueTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Venues league={league} season={activeLeagueSeason} venues={venues} />
    </LeaguePageLayout>
  );
};

export default observer(VenuesPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TVenuesPageProps> = {};

  const leagueId = parseInt(ctx.query.id as string);
  const [getLeaguePromise] = getLeague(leagueId);
  const [getLeagueSeasonsPromise] = getLeagueSeasons(leagueId);
  const layoutData = getLeagueLayoutData(leagueId);

  return Promise.all([getLeaguePromise, getLeagueSeasonsPromise, layoutData])
    .then(([leagueRes, leagueSeasonsRes, layoutData]) => {
      const activeLeagueSeason = getActiveLeagueSeason(leagueSeasonsRes.data, leagueRes.data.current_season_id);
      props = {
        ...props,
        league: leagueRes.data,
        activeLeagueSeason: activeLeagueSeason,
        layoutData: layoutData,
      };

      const [getVenuesPromise] = getVenuesBySeason(activeLeagueSeason._id);
      return getVenuesPromise;
    })
    .then((venuesRes) => {
      props = {
        ...props,
        venues: venuesRes.data,
      };

      return { props };
    })
    .catch((err) => {
      console.error(err);
      return { props };
    });
});
