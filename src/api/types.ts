// import { ODDS_MODE, ORDER_MATCHES_BY } from "@/store";

import { WindowSize } from "@/utils/types";

// noinspection JSUnusedGlobalSymbols
export enum EventType {
  PENALTY = "penalty",
  YELLOW_RED = "yellowred",
  VAR = "var",
  SUBSTITUTION = "substitution",
  OWN_GOAL = "own-goal",
  PEN_SHOOTOUT_MISS = "pen_shootout_miss",
  GOAL = "goal",
  YELLOW_CARD = "yellowcard",
  MISSED_PENALTY = "missed_penalty",
  PEN_SHOOTOUT_GOAL = "pen_shootout_goal",
  RED_CARD = "redcard",
}

export enum LeagueType {
  CUP_INTERNATIONAL = "cup_international",
  DOMESTIC = "domestic",
  DOMESTIC_CUP = "domestic_cup",
  ELECTRONIC = "electronic",
  INTERNATIONAL = "international",
}

export enum FixtureStatus {
  // LIVE
  LIVE = "LIVE",
  HT = "HT",
  ET = "ET",
  PEN_LIVE = "PEN_LIVE",
  BREAK = "BREAK",
  // FINISHED
  FT = "FT",
  FT_PEN = "FT_PEN",
  AET = "AET",
  INT = "INT",
  AWARDED = "AWARDED",
  CANCL = "CANCL",
  POSTP = "POSTP",
  // SCHEDULED
  NS = "NS",
  ABAN = "ABAN",
  SUSP = "SUSP",
  DELAYED = "DELAYED",
  TBA = "TBA",
}

export enum ODDS_FORMAT {
  EU = "EU",
  UK = "UK",
  US = "US",
  HK = "HK",
  MA = "MA",
  IN = "IN",
}

export enum Side {
  HOME = "home",
  AWAY = "away",
}

export enum Position {
  OTHER = 0,
  GOALKEEPER = 1,
  DEFENDER = 2,
  MIDFIELD = 3,
  ATTACK = 4,
  COACH = 9,
}

export type StandingLetter = "W" | "D" | "L";

export enum TimeFormat {
  HHmm = "HH:mm",
  hhmma = "hh:mm a",
}

export interface SSPPaginationProps {
  lastPage: number;
  maxPage: number;
  minPage: number;
}

export type TeamEvent = {
  id?: number;
  type?: EventType;
  visitorteam_name?: string;
  localteam_name?: string;
  visitorteam_name_loc?: string;
  localteam_name_loc?: string;
  score: number;
};

export type LivescoreEvents = {
  _id: number;
  time: {
    minute: number | null;
    extra_minute: number | null;
    starting_at: number;
  };
  visitorteam_event: TeamEvent;
  localteam_event: TeamEvent;
};

export type MyLeague = {
  _id: number;
  logo_path: string;
  name: string;
  name_loc?: string;
  type: LeagueType;
  country_iso2?: string;
};

export type MyTeam = {
  _id: number;
  logo_path: string;
  name: string;
  name_loc?: string;
  national_team: boolean;
  country_iso2?: string;
};

export type FixtureEvent = {
  id: number;
  team_id: string;
  type: EventType;
  var_result: string;
  fixture_id: number;
  player_id: number;
  player_name: string | null;
  related_player_id: number | null;
  related_player_name: string | null;
  minute: number;
  extra_minute: number | null;
  reason: string;
  result?: string;
  has_video?: boolean;
};

export type TvStation = {
  fixture_id: number;
  tvstation: string;
};

type Time = {
  status: FixtureStatus;
  starting_at: number;
  minute: number | null;
  second: number | null;
  added_time: number | null;
  extra_minute: number | null;
  injury_time: number | null;
};

export type Livescore = {
  _id: number;
  other: Event[];
  localteam_id: number;
  localteam_name: string;
  localteam_name_loc: string;
  visitorteam_id: number;
  visitorteam_name: string;
  visitorteam_name_loc: string;
  scores: Scores;
  time: Time;
  tvstations: TvStation[];
  winner_team_id: number;
  winning_odds_calculated: boolean;
  lineup: boolean;
  stats: LivescoreStat[];
};

type BaseOdds = {
  label: string;
  value: string;
  probability: string;
  dp3: string;
  dp3_prev?: string;
  american: number;
  bookmaker_event_id?: number;
};

export type BasePredictions = {
  home?: number;
  away?: number;
  draw?: number;
};

export type Predictions = BasePredictions & {
  btts?: number;
  correct_score?: { [key: string]: number };
};

type MarketBookmaker = {
  id: number;
  name: string;
  odds: BaseOdds[];
};

type FixtureMarket = {
  id: number;
  bookmaker: MarketBookmaker[];
};

export type FixtureWithMarket = Livescore & {
  market: FixtureMarket;
  predictions?: BasePredictions;
};

type FixtureLeagueCountry = {
  name: string;
  iso2: string;
};

type FixtureLeagueStage = {
  name: string;
  type: string;
};

type FixtureLeagueRound = {
  name: string;
};

export type FixtureLeague<T extends Livescore = Livescore> = {
  _id: number;
  logo_path: string;
  name: string;
  name_loc?: string;
  live_standings: boolean;
  live: boolean;
  fixtures: T[];
  country: FixtureLeagueCountry;
  stage: FixtureLeagueStage;
  round: FixtureLeagueRound;
};

export type Venue = {
  _id: number;
  address: string;
  capacity: string;
  city: string;
  coordinates?: string;
  image_path: string | null;
  name: string;
  surface?: string;
};

export type SeasonVenue = Venue & {
  team_id: number;
  team_name: string;
  team_name_loc?: string;
};

export type Team = {
  _id: number;
  country_iso2?: string;
  country_id: number | null;
  league_id?: number;
  current_season_id: number;
  current_stage_id: number | null;
  founded: number;
  logo_path: string;
  name: string;
  name_loc?: string;
  facts?: string;
  national_team: boolean;
  short_code: string;
  twitter: string;
  website: string;
  has_sidelined: boolean;
  has_stats: boolean;
  has_transfers: boolean;
  has_trophies: boolean;
  has_squads: boolean;
  venue?: Venue;
};

export type ReducedTeam = {
  _id: number;
  logo_path: string;
  name: string;
  name_loc?: string;
};

export type SeasonTeam = {
  _id: number;
  name: string;
  name_loc?: string;
};

export type Scores = {
  localteam_score: number;
  visitorteam_score: number;
  localteam_pen_score: number | null;
  visitorteam_pen_score: number | null;
  ht_score: number | null;
  ft_score: number | null;
  et_score: number | null;
  ps_score: number | null;
};

export type TeamColor = {
  color: string;
};

type FixtureFormations = {
  localteam_formation: string | null;
  visitorteam_formation: string | null;
};

type FixtureGroup = {
  id: number;
  name: string;
};

type StandingTeam = {
  recent_form: string;
};

type FixtureStanding = {
  localteam?: StandingTeam;
  visitorteam?: StandingTeam;
};

type FixtureLeagueShortCountry = {
  name: string;
  type: string;
};

type FixtureLeagueShort = {
  logo_path: string;
  name: string;
  name_loc?: string;
  stage: FixtureLeagueStage;
  round: FixtureLeagueRound;
  country: FixtureLeagueShortCountry;
  is_cup: boolean;
  group_stage_id: number;
};

type FixtureColors = {
  localteam?: TeamColor;
  visitorteam?: TeamColor;
};

export type Fixture = {
  _id: number;
  formations: FixtureFormations;
  group: FixtureGroup;
  scores: Scores;
  time: Time;
  winner_team_id: number | null;
  localteam: ReducedTeam;
  visitorteam: ReducedTeam;
  standing: FixtureStanding;
  league_id: number | null;
  stage_id: number;
  season_id: number;
  league?: FixtureLeagueShort;
  venue?: Venue;
  colors?: FixtureColors;
  tvstations: TvStation[];
  has_comments?: boolean;
  has_events?: boolean;
  has_lineup?: boolean;
  has_odds?: boolean;
  has_sidelined?: boolean;
  has_stats?: boolean;
  has_substitutions?: boolean;
  has_video?: boolean;
};

type ActiveSeasonLeague = {
  name: string;
  name_loc?: string;
  current_season_id: number;
  id: number;
  logo_path: string;
  type?: string;
};

export type ActiveSeason = {
  _id: number;
  name: number;
  has_fixtures: boolean;
  league: ActiveSeasonLeague;
};

type Goal = {
  player_id: number | null;
  player_name?: string;
  minute: string;
  extra_minute: string;
  result: string;
  team_id: string;
};

type TeamSeasonFixtureGroup =
  | {
      name: string;
    }
  | any[];

type TeamSeasonFixtureStandings = {
  localteam_position?: number;
  visitorteam_position?: number;
};

export type TeamSeasonFixture = {
  _id: number;
  goals: Goal[];
  group?: TeamSeasonFixtureGroup;
  time: {
    status: FixtureStatus;
    starting_at: number;
  };
  winner_team_id: number;
  result: string;
  localteam_name: string;
  localteam_name_loc?: string;
  visitorteam_name: string;
  visitorteam_name_loc?: string;
  localteam_logo_path: string;
  visitorteam_logo_path: string;
  localteam_id: number;
  visitorteam_id: number;
  localteam_score: number;
  visitorteam_score: number;
  standings?: TeamSeasonFixtureStandings;
};

export type TeamSeasonDoubleFixture = TeamSeasonFixture & {
  localteam_scores: number[];
  visitorteam_scores: number[];
};

type Overall = {
  games_played: number;
  draw: number;
};

type Total = {
  goal_difference: string;
  points: number;
};

export type Standing = {
  position: number;
  group_id?: number;
  team_id: number;
  team_name: string;
  team_name_loc?: string;
  overall?: Overall;
  total?: Total;
  result?: string;
  status?: "up" | "down";
  team_logo_path: string;
  team_short_code?: string;
};

type StandingExtendedData = {
  games_played: number;
  won: number;
  draw: number;
  lost: number;
  goals_scored: number;
  goals_against: number;
};

export type StandingExtended = Standing & {
  round_id?: number;
  round_name?: string;
  group_name?: string;
  overall?: StandingExtendedData;
  home?: StandingExtendedData;
  away?: StandingExtendedData;
  points: string;
  recent_form: string;
  live: boolean;
};

export type Standings = {
  _id: number;
  stage_id: number;
  season_id: number;
  league_id: number;
  round_id: number;
  league_name: string;
  league_name_loc?: string;
  resource?: string;
  standings: Standing[];
};

export type StandingsExtended = Standings & {
  type: string;
  standings: StandingExtended[];
};

export type PlayerShort = {
  _id: number | null;
  birthdate: string | null;
  common_name: string;
  common_name_loc?: string;
  image_path: string | null;
  country_iso2?: string;
};

export type Squad = {
  player_id: number;
  position_id: number;
  number: number | null;
  minutes: number | null;
  captain: number;
  appearences: number | null;
  goals: number | null;
  yellowcards: number | null;
  redcards: number | null;
  player?: PlayerShort;
};

export type Squads<T extends Squad> = {
  _id: number;
  team_id: number;
  season_id: number;
  squad: T[];
};

export type SquadStat = Squad & {
  lineups: number | null;
  substitute_in: number | null;
  substitute_out: number | null;
  substitutes_on_bench: number | null;
  owngoals: number | null;
  assists: number | null;
  saves: number | null;
};

export type Sidelined = {
  player_id: number;
  description: string;
  start_date: string;
  end_date: string | null;
  player?: PlayerShort;
};

export type LeagueSidelined = Sidelined & {
  team_id: number;
  team_name: string;
  team_name_loc?: string;
};

export type Sidelineds<T extends Sidelined = Sidelined> = {
  _id: number;
  current_season_id: number;
  sidelined: T[];
};

export enum TransferType {
  IN = "IN",
  OUT = "OUT",
}

export type Transfer = {
  player_id: number;
  from_team_id: number;
  to_team_id: number;
  transfer: string;
  type: TransferType;
  date: string;
  amount: string;
  from_team_name: string;
  from_team_name_loc?: string;
  to_team_name: string;
  to_team_name_loc?: string;
  player?: PlayerShort;
};

export type Transfers = {
  _id: number;
  current_season_id: number;
  transfers: Transfer[];
};

type TrophySeason = {
  id: number;
  name: string;
  league_id: number;
  is_current_season: boolean;
  current_round_id: number | null;
  current_stage_id: number | null;
};

export type Trophy = {
  team_id: number;
  status: string;
  times: number;
  league: string;
  league_id: number;
  league_name: string;
  league_name_loc?: string;
  league_type: LeagueType;
  country_iso2: string | null;
  seasons: TrophySeason[];
};

export type Trophies = {
  _id: number;
  current_season_id: number;
  trophies: Trophy[];
};

export type TrophyTotal = {
  _id: number;
  league: string;
  league_name_loc?: string;
  league_id: number;
  country_iso2: string | null;
  total: number;
};

export type Stat = {
  total: string;
  home: string;
  away: string;
};

export type StatsTable = {
  win: Stat | null;
  draw: Stat | null;
  lost: Stat | null;
  goals_for: Stat | null;
  goals_against: Stat | null;
  clean_sheet: Stat | null;
  failed_to_score: Stat | null;
  avg_goals_per_game_scored: Stat | null;
  avg_goals_per_game_conceded: Stat | null;
  avg_first_goal_scored: Stat | null;
  avg_first_goal_conceded: Stat | null;
};

export type ScoringPeriod = {
  minute: string;
  count: string;
  percentage: number;
};

type ScoringMinute = {
  period: ScoringPeriod[];
};

export type Stats = StatsTable & {
  _id: number;
  team_id: number;
  season_id: number;
  stage_id: number;
  scoring_minutes: ScoringMinute[];
  goals_conceded_minutes: string;
  attacks: string;
  dangerous_attacks: string;
  avg_ball_possession_percentage: string;
  fouls: string;
  avg_fouls_per_game: string;
  offsides: string;
  redcards: string;
  yellowcards: string;
  shots_blocked: string;
  shots_off_target: string;
  avg_shots_off_target_per_game: string;
  shots_on_target: string;
  avg_shots_on_target_per_game: string;
  avg_corners: string;
  total_corners: string;
  btts: string;
  goal_line: string;
  avg_player_rating: string;
  avg_player_rating_per_match: string;
  tackles: string;
};

type LineupShots = {
  shots_total: string;
  shots_on_goal: string;
};

type LineupGoals = {
  scored: number;
  assists: number;
  conceded: number;
  owngoals: number;
};

type LineupFouls = {
  drawn: number;
  committed: number;
};

type LineupCards = {
  yellowcards: number;
  redcards: number;
  yellowredcards: number;
};

type LineupPassing = {
  total_crosses: number;
  crosses_accuracy: number;
  passes: number;
  accurate_passes: number;
  passes_accuracy: number;
  key_passes: number;
};

type LineupDribbles = {
  attempts: number;
  success: number;
  dribbled_past: number;
};

type LineupDuels = {
  total: number;
  won: number;
};

type LineupOther = {
  aerials_won: number;
  punches: number;
  offsides: number;
  saves: number;
  inside_box_saves: number;
  pen_scored: number;
  pen_missed: number;
  pen_saved: number;
  pen_committed: number;
  pen_won: number;
  hit_woodwork: number;
  tackles: number;
  blocks: number;
  interceptions: number;
  clearances: number;
  dispossesed: number;
  minutes_played: number;
};

type LineupPlayer = {
  image_path: string;
  country_iso2: string;
};

type LineupStats = {
  shots: LineupShots;
  goals: LineupGoals;
  fouls: LineupFouls;
  cards: LineupCards;
  passing: LineupPassing;
  dribbles: LineupDribbles;
  duels: LineupDuels;
  other: LineupOther;
  rating: number;
};

export type Lineup = {
  team_id: number;
  fixture_id: number;
  player_id: number;
  player_name: string;
  player_name_loc: string;
  number: string | null;
  position: string;
  additional_position: string;
  formation_position: number;
  posx: string;
  posy: string;
  captain: string;
  type: string;
  stats: LineupStats;
  player?: LineupPlayer;
};

export type LineupCoach = {
  common_name_loc: string;
  common_name: string;
  image_path: string;
  country_iso2?: string;
};

type Coaches = {
  localteam_coach?: LineupCoach;
  visitorteam_coach?: LineupCoach;
};

export type Lineups = {
  _id: number;
  localteam_id: number;
  visitorteam_id: number;
  coaches: Coaches;
  lineup: Lineup[];
  starting_at: number;
};

export type Official = {
  id: number;
  common_name: string;
  common_name_loc: string;
  fullname: string;
  firstname: string;
  lastname: string;
};

export type AdditionalInfo = {
  _id: number;
  referee?: Official | any[];
  firstAssistant?: Official | any[];
  fourthOfficial?: Official | any[];
  secondAssistant?: Official | any[];
  starting_at: number;
};

type OddLastUpdate = {
  date: string;
  timezone_type: number;
  timezone: string;
};

export type Odd = BaseOdds & {
  extra: string;
  factional: string;
  winning: string;
  stop: string;
  handicap: string;
  total: "First" | "Last" | "Anytime";
  last_update: OddLastUpdate;
};

type OddsData = {
  data: Odd[];
};

export type Bookmaker = {
  id: number;
  name: string;
  odds: OddsData;
};

export type Market = {
  id: number;
  name: string;
  suspended: boolean;
  bookmaker: Bookmaker[];
};

export type Odds = {
  _id: number;
  odds: Market[];
  predictions?: Predictions;
};

type FixtureStatShots = {
  total: number;
  ongoal: number;
  offgoal: string;
  blocked: string;
  insidebox: string;
  outsidebox: string;
};

type FixtureStatPasses = {
  total: string;
  percentage: number;
};

type FixtureStatAttacks = {
  attacks: string;
  dangerous_attacks: string;
};

export type FixtureStat = {
  team_id: number;
  fixture_id: number;
  shots: FixtureStatShots | null;
  passes: FixtureStatPasses | null;
  attacks: FixtureStatAttacks;
  fouls: number;
  corners: number;
  offsides: string;
  possessiontime: number;
  yellowcards: string;
  redcards: string;
  yellowredcards: string;
  saves: string;
  substitutions: string;
  goal_kick: string;
  goal_attempts: string;
  free_kick: string;
  throw_in: string;
  ball_safe: string;
  goals: number;
  penalties: string;
  injuries: string;
  tackles: string;
};

export type FixtureStats = {
  _id: number;
  localteam_id: number;
  stats: FixtureStat[];
  stats_ht?: FixtureStat[];
  visitorteam_id: number;
  starting_at: number;
};

export type Comment = {
  fixture_id: number;
  important: boolean;
  order: number;
  goal: boolean;
  minute: number;
  extra_minute: number | null;
  comment: string;
};

export type Comments = {
  _id: number;
  comments: Comment[];
  localteam_id: number;
  visitorteam_id: number;
  starting_at: number;
};

export type Country = {
  _id: number;
  name: string;
  name_loc?: string;
  national: boolean;
  country_iso2: string;
};

export type LeagueShort = {
  _id: number;
  name: string;
  name_loc: string;
};

export type TeamShort = {
  _id: number;
  name: string;
  name_loc?: string;
};

export type H2HEvent = {
  id: number;
  player_id: number;
  player_name: string;
  player?: PlayerShort;
  minute: number;
  extra_minute: number | null;
  result: string;
  team_id: string;
  type: EventType;
};

export type H2HFixture = {
  _id: number;
  events: H2HEvent[];
  time: {
    status: FixtureStatus;
    starting_at: number;
  };
  winner_team_id: number;
  result: string;
  localteam_name: string;
  localteam_name_loc?: string;
  visitorteam_name: string;
  visitorteam_name_loc?: string;
  localteam_logo_path: string;
  visitorteam_logo_path: string;
  localteam_id: number;
  visitorteam_id: number;
  localteam_score: number;
  visitorteam_score: number;
};

export type Scorer = {
  position: string;
  season_id: number;
  player_id: number;
  team_id: number;
  player_name: string;
  player_name_loc: string;
  player_image_path: string;
  country_iso2: string;
  team_name: string;
  team_name_loc: string;
  team_logo_path: string;
  type: "goals" | "assists" | "cards";
};

export type Topscorer = Scorer & {
  goals: number;
  penalty_goals: number;
  substitutes_on_bench: number;
  rating?: string | null;
};

export type Assistscorer = Scorer & {
  assists: number;
};

export type Cardscorer = Scorer & {
  yellowcards: number;
  redcards: number;
};

export type CountryTeam = {
  _id: number;
  league_id?: number;
  league_name?: string;
  league_name_loc?: string;
  season_name?: string;
  name_loc?: string;
  name: string;
};

export type CountryTeams = {
  _id: number | null;
  country_name?: string;
  country_iso2?: string;
  teams: CountryTeam[];
};

export type CountryLeague = {
  _id: number;
  name: string;
  name_loc?: string;
  current_season_id: number;
  live_standings: boolean;
  season_name: string;
};

export type CountryLeagues = {
  _id: number | null;
  country_name?: string;
  country_iso2?: string;
  leagues: CountryLeague[];
};

type LeagueCoverage = {
  predictions: boolean;
  topscorer_goals: boolean;
  topscorer_assists: boolean;
  topscorer_cards: boolean;
};

export type League = {
  _id: number;
  active: boolean;
  type: string;
  country_id: number;
  logo_path: string;
  name_loc: string;
  name: string;
  facts?: string;
  is_cup: boolean;
  current_season_id: number;
  current_round_id: number;
  current_stage_id: number;
  live_standings: boolean;
  coverage: LeagueCoverage;
  stage_name: string;
  stage_type: string;
  resource: "stage" | "group";
  standing_name: string;
  country_name: string;
  country_iso2: string;
  has_sidelined?: boolean;
  has_transfers?: boolean;
  has_trophies?: boolean;
  has_venues?: boolean;
  total_fixtures_round?: number;
  total_fixtures_stage?: number;
};

export type LeagueSeason = {
  _id: number;
  name: string;
  league_id: number;
  is_current_season: boolean;
  current_round_id: number | null;
  current_stage_id: number | null;
  stage_id: number | null;
  is_draw?: boolean;
  has_topscorers: boolean;
  has_assistscorers: boolean;
  has_cardscorers: boolean;
  has_standings: boolean;
  has_fixtures: boolean;
};

export type Ranking = {
  _id: number;
  country_id: number;
  name: string;
  name_loc: string;
  short_code: string;
  logo_path: string;
  points: number;
  position: number;
  position_status: "same" | "down" | "up";
  position_won_or_lost: -1 | 0 | 1;
  country_iso2: string;
};

export type Round = {
  _id: number;
  name: string;
  start: string | null;
  end: string | null;
};

export type Stage = {
  _id: number;
  name: string;
  type: string;
  has_standings: boolean;
  has_fixtures: boolean;
};

export type LeagueStats = {
  _id: number;
  rounds_per_season: number;
  yellow_cards_per_season: number;
  red_cards_per_season: number;
  avg_overall_goals_per_season: number;
  avg_goals_per_game: number;
  overall_won: number;
  home_won: number;
  away_won: number;
  avg_total_games_played_per_season: number;
};

type TrophyShort = {
  status: "Winner" | "Runner-up";
  times: number;
  seasons: string[];
};

export type LeagueTrophy = {
  _id: number;
  trophies: TrophyShort[];
  name: string;
  logo_path?: string;
};

export type MostExpensiveTransfer = {
  _id: number;
  common_name: string;
  transfers: Transfer;
  image_path: string;
  country_iso2: string;
};

export type PlayerScorer = {
  _id: number;
  player_image_path?: string;
  player_id: string;
  player_name: string;
  player_name_loc: string;
  country_iso2: string;
  team_id: number;
  team_name: string;
  team_name_loc: string;
  team_logo_path?: string;
  league_id: number;
  league_name: string;
  league_name_loc: string;
  league_logo_path?: string;
};

export type BornToday = PlayerScorer & {
  year: string;
};

export type PlayerTopscorer = PlayerScorer & {
  goals: number;
  penalty_goals: number;
  type: "aggregated_goals";
  rating: number;
  substitutes_on_bench: number;
};

export type PlayerCardscorer = PlayerScorer & {
  yellowcards: number;
  redcards: number;
  type: "aggregated_cards";
};

export type PlayerAbroad = PlayerTopscorer & {
  player_country_iso2: string;
  team_country_iso2: string;
  play_abroad: boolean;
};

export type SearchTeam = {
  _id: number;
  logo_path: string;
  name_loc: string;
  name: string;
  league_name: string;
  league_name_loc?: string;
  league_logo_path?: string;
  national_team: boolean;
  points: number | null;
  country_iso2?: string;
};

export type SearchLeague = {
  _id: number;
  logo_path?: string;
  name: string;
  name_loc: string;
  type: string;
  country_iso2?: string;
};

type SearchPlayerPosition = {
  id: Position;
  name: string;
};

export type SearchPlayer = {
  _id: number;
  common_name: string;
  common_name_loc: string;
  image_path: string;
  height: string;
  position: SearchPlayerPosition;
  team_id: number;
  weight: string;
  country_iso2?: string;
  team_name: string;
  team_name_loc: string;
  team_logo_path: string;
  age: number;
};

export type SearchResult = {
  teams: SearchTeam[];
  leagues: SearchLeague[];
  players: SearchPlayer[];
};

export type Player = {
  _id: number;
  country_id: string;
  common_name: string;
  display_name: string;
  height: string;
  image_path: string;
  lastname: string;
  nationality: string;
  team_id: number;
  weight: string;
  birthdate: string;
  position_id: Position;
  facts?: string;
  team_name: string;
  team_name_loc?: string;
  team_logo_path: string;
  current_season_id: number;
  country_iso2: string;
  age: string;
  number: number | null;
  has_career: boolean;
  has_sidelined: boolean;
  has_trophies: boolean;
};

export type PlayerCareerEvent = {
  _id: number;
  team_id: number;
  league_id: number;
  season_id: number;
  minutes: number;
  appearences: number;
  lineups: number;
  substitute_in: number;
  goals: number;
  owngoals: number;
  assists: number;
  yellowcards: number;
  redcards: number;
  type: string;
  rating: number;
  team_name: string;
  team_name_loc?: string;
  league_logo_path: string;
  league_name: string;
  league_name_loc?: string;
  substitute_out: number;
  substitutes_on_bench: number;
  season_name: string;
  country_iso2?: string;
};

export type PlayerSeasonFixture = TeamSeasonFixture & {
  league_type: LeagueType;
};

export type PlayerTrophies = Trophies & {
  type: LeagueType;
};

export type PlayerStats = {
  goals: number;
  assists: number;
  dribbles_attempts: number;
  dribbles_success: number;
  passes_accuracy: number;
  passes_total: number;
  appearences: number;
};

export type PlayerChart = {
  aggression: number;
  attack: number;
  creativity: number;
  defence: number;
  sociality: number;
  tactics: number;
  technics: number;
  rating: number;
};

type PlayerRatingHistoryLeague = {
  current_season_id: number;
  logo_path?: string;
  name: string;
  type: LeagueType;
  _id: number;
};

export type PlayerRatingHistory = {
  _id: number;
  has_fixtures: boolean;
  has_stats: boolean;
  league: PlayerRatingHistoryLeague;
  name: string;
  rating: number;
};

export type Page = {
  title: string;
  content: string;
};

export type BookmakerShort = {
  _id: number;
  name: string;
};

export type UserResponse = {
  username: string;
  token: string;
  expires_at: number;
  payload: any;
};

export type Favorites = {
  leagues: number[];
  teams: number[];
  fixtures: number[];
  notifiableLeagues: number[];
  notifiableTeams: number[];
  notifiableFixtures: number[];
};

export type Settings = {
  dark: boolean;
  timeZone: string;
  /**
   * TODO: add mobx store
   */
  orderMatchesBy: any; //ORDER_MATCHES_BY;
  oddsMode: any; // ODDS_MODE;
  hideLivebar: boolean;
  oddsFormat: ODDS_FORMAT;
  bookmaker?: number;
  hasChosenBookmaker: boolean;
  esoccer: boolean;
  cookieBanner: boolean;
  functionalCookies: boolean;
  thirdPartyCookies: boolean;
  notifications: boolean;
  country: string;
  locale: string;
  bedtimeMode: boolean;
  friendly: boolean;
  women: boolean;
  extendedFavoritesTime: boolean;
  openLeagues: boolean;
  openOdds: boolean;
  timeFormat: TimeFormat;
  originalNames: boolean;
  oddsSwitchPositionNotified: boolean;
  windowSize: WindowSize;
};

export type Highlight = {
  _id: string;
  fixture_id: number;
  event_id: number | null;
  location: string;
  type: "clip";
  created_at: string;
};

export type LivescoreStat = {
  team_id: number;
  redcards: number;
  yellowcards: number;
};

export type PartialLivescore = {
  _id: number;
  scores: Scores;
  time: Time;
  winner_team_id: number;
  stats: LivescoreStat[];
};

export type UpdateEvent = FixtureEvent & {
  livescore: {
    _id: number;
    scores: Scores;
    time: Time;
    winner_team_id: number | null;
    localteam_id: number;
    localteam_name: string;
    localteam_translation?: { [key: string]: string };
    visitorteam_id: number;
    visitorteam_name: string;
    visitorteam_translation?: { [key: string]: string };
  };
};

export type Account = {
  referralCode: string;
  referralsByDate: string | null;
};

export type Referral = {
  username?: string;
  createdAt: string;
  confirmedAt: string | null;
};
