import { Team, Trophies as TTrophies, Trophy, getTeam, getTrophiesByTeam } from "@/api";
import Trophies from "@/components/Team/Trophies/Trophies";
import { useIntl } from "@/hooks/useIntl";
import { TeamLayout } from "@/layouts/team";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Head from "next/head";
import React, { FC } from "react";

type TTrophiesPageProps = {
  team: Team;
  trophies: TTrophies;
};

const TrophiesPage: FC<TTrophiesPageProps> = ({ team, trophies }) => {
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

  const trophiesMap = trophies.trophies.reduce((map, trophy) => {
    const key = trophy.league_type || "other";
    if (map.has(key)) {
      map.get(key)!.push(trophy);
    } else {
      map.set(key, [trophy]);
    }

    return map;
  }, new Map());

  return (
    <TeamLayout team={team}>
      <Head>
        <title>
          {intl.get("title.team.transfers", teamTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.transfers", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.trophies", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.trophies", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Trophies team={team} trophies={trophiesMap} />
    </TeamLayout>
  );
};

export default observer(TrophiesPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TTrophiesPageProps> = {};

  const [getTeamPromise] = getTeam(teamId);
  getTeamPromise.then(({ data }) => {
    props = { ...props, team: data };
  });

  const [getTrophiesPromise] = getTrophiesByTeam(teamId);
  getTrophiesPromise.then(({ data }) => {
    props = { ...props, trophies: data };
  });

  await Promise.all([getTeamPromise, getTrophiesPromise]);

  return {
    props,
  };
});
