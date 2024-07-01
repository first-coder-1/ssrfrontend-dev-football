import React from "react";
import { useActiveSeasons } from "@/hooks/useActiveSeasons";
import {
  ActiveSeason,
  Fixture,
  LineupCoach,
  PlayerShort,
  Side,
  Squad as TSquad,
  Squads,
  Team,
  TeamSeasonFixture,
  getCurrentCoachByTeamAndSeason,
  getCurrentSquadsByTeamAndSeason,
  getFixturesByTeamAndSeason,
  getTeam,
  getTeamActiveSeasons,
  getTeamLastMatch,
  maxPage,
  minPage,
} from "@/api";
import Info from "@/components/Team/Summary/Info";
import About from "@/components/Team/Summary/About";
import Matches from "@/components/Team/Summary/Matches";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { Squad } from "@/components/Team/Summary/Squad/Squad";
import { TeamLayout } from "@/layouts/team";
import { getActiveSeason } from "@/utils/getActiveSeason";

export type TSeasonFixturesRes = {
  min: number;
  max: number;
  loading?: boolean;
  fixtures: TeamSeasonFixture[];
};

type Props = {
  team: Team;
  seasons: ActiveSeason[];
  seasonFixturesRes: TSeasonFixturesRes;
  lastMatch: Fixture;
  squads: Squads<TSquad>;
  coach: PlayerShort;
};

export function Summary({ team, seasons, seasonFixturesRes, lastMatch, squads, coach }: Props): React.ReactElement {
  return (
    <TeamLayout team={team}>
      <>
        <Info team={team} />
        <Matches lastMatch={lastMatch} team={team} seasons={seasons} seasonFixturesRes={seasonFixturesRes} />
        {team.has_squads && <Squad squads={squads} coach={coach} team={team} showSidelined />}
        <br />
        <About team={team} seasons={seasons} lastMatch={lastMatch} />
      </>
    </TeamLayout>
  );
}

export default Summary;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const teamId = parseInt(ctx.query.id as string);
  let props: Partial<Props> = {};

  const [getTeamPromise] = getTeam(teamId);
  const [getSeasonsPromise] = getTeamActiveSeasons(teamId);

  const [getLastMatchPromise] = getTeamLastMatch(teamId);
  getLastMatchPromise.then(({ data }) => {
    props = { ...props, lastMatch: data };
  });

  const getTeamAndActiveSeasonPromise = getTeamPromise
    .then(({ data }) => {
      props = { ...props, team: data };
    })
    .then(() => {
      return Promise.all([getSeasonsPromise, getTeamPromise]);
    })
    .then(([seasonsRes, teamRes]) => {
      props = { ...props, seasons: seasonsRes.data, team: teamRes.data };
      const activeSeason = getActiveSeason(seasonsRes.data, teamRes.data.current_season_id);
      return activeSeason;
    })
    .then((activeSeason) => {
      const [getFixturesByTeamAndSeasonPromise] = getFixturesByTeamAndSeason(teamId, activeSeason._id, 1);
      const [getCurrentSquadsByTeamAndSeasonPromise] = getCurrentSquadsByTeamAndSeason(teamId, activeSeason._id);
      const [getCurrentCoachByTeamAndSeasonPromise] = getCurrentCoachByTeamAndSeason(teamId, activeSeason._id);
      return Promise.all([
        getFixturesByTeamAndSeasonPromise,
        getCurrentSquadsByTeamAndSeasonPromise,
        getCurrentCoachByTeamAndSeasonPromise,
      ]);
    })
    .then(([fixturesRes, squadsRes, coachRes]) => {
      props = {
        ...props,
        seasonFixturesRes: {
          min: minPage(fixturesRes),
          max: maxPage(fixturesRes),
          fixtures: fixturesRes.data,
          loading: false,
        },
        squads: squadsRes.data,
        coach: coachRes.data,
      };
    });

  await Promise.all([getTeamAndActiveSeasonPromise, getSeasonsPromise, getLastMatchPromise, getSeasonsPromise]);

  return {
    props,
  };
});
