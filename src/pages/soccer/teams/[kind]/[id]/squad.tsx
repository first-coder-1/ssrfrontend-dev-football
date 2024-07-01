import {
  getCurrentCoachByTeamAndSeason,
  getCurrentSquadsByTeamAndSeason,
  getTeam,
  PlayerShort,
  Squads,
  Team,
  Squad as TSquad,
} from "@/api";
import Squad from "@/components/Team/Summary/Squad/Squad";
import { useIntl } from "@/hooks/useIntl";
import { TeamLayout } from "@/layouts/team";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import React from "react";

type TSquadPageProps = {
  team: Team;
  squads: Squads<TSquad>;
  coach: PlayerShort;
};

const SquadPage: React.FC<TSquadPageProps> = ({ team, squads, coach }) => {
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
          {intl.get("title.team.squad", teamTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.squad", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.squad", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.squad", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Squad team={team} coach={coach} squads={squads} />
    </TeamLayout>
  );
};

export default observer(SquadPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TSquadPageProps> = {};

  const [getTeamPromise] = getTeam(teamId);

  const getTeamAndSquadsPromise = getTeamPromise
    .then(({ data }) => {
      props = { ...props, team: data };
      return data;
    })
    .then((team) => {
      const [getCurrentSquadsByTeamAndSeasonPromise] = getCurrentSquadsByTeamAndSeason(teamId, team.current_season_id);
      const [getCurrentCoachByTeamAndSeasonPromise] = getCurrentCoachByTeamAndSeason(teamId, team.current_season_id);
      return Promise.all([getCurrentSquadsByTeamAndSeasonPromise, getCurrentCoachByTeamAndSeasonPromise]);
    })
    .then(([squadsRes, coachRes]) => {
      props = {
        ...props,
        squads: squadsRes.data,
        coach: coachRes.data,
      };
    });

  await Promise.all([getTeamAndSquadsPromise]);

  return {
    props,
  };
});
