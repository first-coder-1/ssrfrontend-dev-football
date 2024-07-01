import {
  ActiveSeason,
  Sidelined as TSidelined,
  Team,
  getSquadSidelinedByTeamAndSeason,
  getTeam,
  getTeamHistorySeasons,
} from "@/api";
import Sidelined from "@/components/Team/Sidelined/Sidelined";
import { useIntl } from "@/hooks/useIntl";
import { TeamLayout } from "@/layouts/team";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import React from "react";

type TSidelinedPageProps = {
  team: Team;
  seasons: ActiveSeason[];
  sidelineds: TSidelined[];
};

const SidelinedPage: React.FC<TSidelinedPageProps> = ({ team, seasons, sidelineds }) => {
  const intl = useIntl();

  const { settings } = useMst();

  let teamTitleData = {
    name: (!settings.originalNames && team.name_loc) || team.name,
    country: team.country_iso2 ? `(${intl.get(`countries.${team.country_iso2}`)}) ` : "",
  };
  if (team.national_team) {
    teamTitleData = {
      name: (!settings.originalNames && team.name_loc) || team.name,
      country: team.country_iso2 ? `` : "",
    };
  }

  return (
    <TeamLayout team={team}>
      <Head>
        <title>
          {intl.get("title.team.sidelined", teamTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.sidelined", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.sidelined", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.sidelined", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Sidelined seasons={seasons} sidelineds={sidelineds} team={team} />
    </TeamLayout>
  );
};

export default observer(SidelinedPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TSidelinedPageProps> = {};

  const [getTeamHistorySeasonsPromise] = getTeamHistorySeasons(teamId, { withSidelined: true });
  const [getTeamPromise] = getTeam(teamId);

  const getSeasonsAndSidelinedPromise = getTeamPromise
    .then((res) => {
      props = { ...props, team: res.data };
      return getTeamHistorySeasonsPromise;
    })
    .then((res) => {
      props = { ...props, seasons: res.data };
      const activeSeason = getActiveSeason(res.data, props.team?.current_season_id);
      const [getSquadSidelinedByTeamAndSeasonPromise] = getSquadSidelinedByTeamAndSeason(teamId, activeSeason._id);
      return getSquadSidelinedByTeamAndSeasonPromise;
    })
    .then((res) => {
      props = { ...props, sidelineds: res.data.sidelined.filter((sidelined) => !!sidelined.player) };
    });

  await Promise.all([getTeamPromise, getTeamHistorySeasonsPromise, getSeasonsAndSidelinedPromise]);

  return {
    props,
  };
});
