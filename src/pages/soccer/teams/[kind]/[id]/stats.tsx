import { ActiveSeason, Stats as TStats, Team, getStatsByTeamAndSeason, getTeam, getTeamHistorySeasons } from "@/api";
import { Stats } from "@/components/Team/Stats/Stats";
import { useHistorySeasons } from "@/hooks/useHistorySeasons";
import { useIntl } from "@/hooks/useIntl";
import { TeamLayout } from "@/layouts/team";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { NextPageContext } from "next";
import Head from "next/head";
import React from "react";

type TStatsPageProps = {
  team: Team;
  seasons: ActiveSeason[];
  stats: TStats;
  activeSeason: ActiveSeason;
};

const StatsPage: React.FC<TStatsPageProps> = ({ team, seasons, stats, activeSeason }) => {
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
          {intl.get("title.team.stats", teamTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.team.stats", teamTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.team.stats", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.team.stats", teamTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Stats seasons={seasons} team={team} stats={stats} activeSeason={activeSeason} />
    </TeamLayout>
  );
};

export default StatsPage;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<TStatsPageProps> = {};
  let team: Team;

  const [getTeamHistorySeasonsPromise] = getTeamHistorySeasons(teamId, { withStats: true });
  // const [getStatsByTeamAndSeasonPromise] = getStatsByTeamAndSeason();
  const [getTeamPromise] = getTeam(teamId);
  const getSeasonsAndStatsPromise = getTeamPromise
    .then((res) => {
      props = { ...props, team: res.data };
      team = res.data;
      return getTeamHistorySeasonsPromise;
    })
    .then((res) => {
      props = { ...props, seasons: res.data };
      const activeSeason = getActiveSeason(res.data, team.current_season_id);
      props = { ...props, activeSeason: activeSeason };
      const [getStatsByTeamAndSeasonPromise] = getStatsByTeamAndSeason(teamId, activeSeason._id);
      return getStatsByTeamAndSeasonPromise;
    })
    .then((res) => {
      props = { ...props, stats: res.data };
    });

  await Promise.all([getTeamPromise, getTeamHistorySeasonsPromise, getSeasonsAndStatsPromise]);

  return {
    props,
  };
});
