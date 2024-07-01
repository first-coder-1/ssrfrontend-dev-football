import { Team, getTeam } from "@/api";
import Venue from "@/components/Team/Venue/Venue";
import { useIntl } from "@/hooks/useIntl";
import { TeamLayout } from "@/layouts/team";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import React, { FC } from "react";

type TVenuePageProps = {
  team: Team;
};

const VenuePage: FC<TVenuePageProps> = ({ team }) => {
  const { settings } = useMst();

  const intl = useIntl();

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
          {intl.get("title.team.venue", teamTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.venue", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.venue", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.venue", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Venue venue={team.venue!} />
    </TeamLayout>
  );
};

export default observer(VenuePage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TVenuePageProps> = {};

  const [getTeamPromise] = getTeam(teamId);
  getTeamPromise.then(({ data }) => {
    props = { ...props, team: data };
  });

  await Promise.all([getTeamPromise]);

  return {
    props,
  };
});
