import React from "react";
import {
  League,
  LeagueSeason,
  LeagueStats,
  Stage,
  StandingsExtended,
  TeamSeasonDoubleFixture,
  Topscorer,
} from "../../../api";
import Matches from "../Matches";
import Standings from "../Standings";
import Players from "../Players";
import Qualification from "./Qualification";
import { AboutLeague } from "./AboutLeague";
import { TLeagueMatchesData } from "@/pages/soccer/leagues/[type]/[id]/summary";

type Props = {
  league: League;
  season?: LeagueSeason;
  matches: TLeagueMatchesData;
  standings: StandingsExtended;
  stages: Stage[];
  topscorers: Topscorer[];
  leagueStats: LeagueStats;
  doubleFixtures: TeamSeasonDoubleFixture[][];
};

export function Summary(props: Props): React.ReactElement {
  const { league, season, matches, standings, stages, topscorers, leagueStats, doubleFixtures } = props;

  return (
    <>
      <Matches league={league} season={season} matches={matches} />
      {league.is_cup && <Qualification league={league} season={season} doubleFixtures={doubleFixtures} />}
      {season && season.has_standings && (
        <Standings standings={standings} league={league} season={season} stages={stages} />
      )}
      {season && (season.has_topscorers || season.has_assistscorers || season.has_cardscorers) && (
        <Players league={league} season={season} topscorers={topscorers} />
      )}
      <AboutLeague league={league} season={season} leagueStats={leagueStats} />
    </>
  );
}

export default Summary;
