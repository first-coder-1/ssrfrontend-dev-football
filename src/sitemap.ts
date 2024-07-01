import { matchPath } from "react-router";

export type Item = {
  title: string;
  url: string;
  path?: string[];
  children?: Item[];
};

export const fixtures = [
  {
    title: "fixtures-all",
    url: "/fixtures/all",
    path: ["/fixtures/bydate/:date", "/fixtures/all"],
  },
  {
    title: "fixtures-live",
    url: "/fixtures/live",
  },
  {
    title: "fixtures-my",
    url: "/fixtures/my",
  },
  {
    title: "fixtures-fin",
    url: "/fixtures/fin",
  },
  {
    title: "fixtures-sch",
    url: "/fixtures/sch",
  },
  {
    title: "fixtures-odds",
    url: "/fixtures/odds",
  },
];

export const team = [
  {
    title: "team-summary",
    url: "/soccer/teams/:name/:id/summary",
  },
  {
    title: "team-matches",
    url: "/soccer/teams/:name/:id/matches",
  },
  {
    title: "team-squad",
    url: "/soccer/teams/:name/:id/squad",
  },
  {
    title: "team-sidelined",
    url: "/soccer/teams/:name/:id/sidelined",
  },
  {
    title: "team-stats",
    url: "/soccer/teams/:name/:id/stats",
  },
  {
    title: "team-transfers",
    url: "/soccer/teams/:name/:id/transfers",
  },
  {
    title: "team-trophies",
    url: "/soccer/teams/:name/:id/trophies",
  },
  {
    title: "team-venue",
    url: "/soccer/teams/:name/:id/venue",
  },
];

export const match = [
  {
    title: "match-summary",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/summary",
  },
  {
    title: "match-stats",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/stats",
  },
  {
    title: "match-videos",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/videos",
  },
  {
    title: "match-venue",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/venue",
  },
  {
    title: "match-odds",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/odds",
  },
];

export const teams = [
  {
    title: "teams-domestic",
    url: "/soccer/teams/domestic",
  },
  {
    title: "teams-national",
    url: "/soccer/teams/national",
  },
  {
    title: "teams-h2h",
    url: "/soccer/teams/h2h",
    path: ["/soccer/teams/h2h/:leftName/:rightName/:leftId/:rightId", "/soccer/teams/h2h"],
  },
];

export const competitions = [
  {
    title: "competitions-domestic",
    url: "/soccer/leagues/domestic",
  },
  {
    title: "competitions-international",
    url: "/soccer/leagues/international",
  },
  {
    title: "competitions-domestic-cup",
    url: "/soccer/leagues/domestic-cup",
  },
  {
    title: "competitions-cup-international",
    url: "/soccer/leagues/cup-international",
  },
];

export const league = [
  {
    title: "league-summary",
    url: "/soccer/leagues/:name/:id/summary",
  },
  {
    title: "league-matches",
    url: "/soccer/leagues/:name/:id/matches",
  },
  {
    title: "league-tables",
    url: "/soccer/leagues/:name/:id/tables",
  },
  {
    title: "league-players",
    url: "/soccer/leagues/:name/:id/players",
  },
  {
    title: "league-transfers",
    url: "/soccer/leagues/:name/:id/transfers",
  },
  {
    title: "league-sidelined",
    url: "/soccer/leagues/:name/:id/sidelined",
  },
  {
    title: "league-trophies",
    url: "/soccer/leagues/:name/:id/trophies",
  },
  {
    title: "league-venues",
    url: "/soccer/leagues/:name/:id/venues",
  },
];

export const players = [
  {
    title: "players-topscorers",
    url: "/soccer/players/topscorers",
  },
  {
    title: "players-cardscorers",
    url: "/soccer/players/cardscorers",
  },
  {
    title: "players-born-today",
    url: "/soccer/players/born-today",
  },
  {
    title: "players-abroad",
    url: "/soccer/players/abroad",
  },
];

export const player = [
  {
    title: "player-summary",
    url: "/soccer/players/:name/:id/summary",
  },
  {
    title: "player-matches",
    url: "/soccer/players/:name/:id/matches",
  },
];

export const search = [
  {
    title: "search-all",
    url: "/soccer/search/all/*",
  },
  {
    title: "search-leagues",
    url: "/soccer/search/leagues/*",
  },
  {
    title: "search-teams",
    url: "/soccer/search/teams/*",
  },
  {
    title: "search-players",
    url: "/soccer/search/players/*",
  },
];

export const pages = [
  {
    title: "pages-privacy-policy",
    url: "/pages/privacy-policy",
  },
  {
    title: "pages-terms-of-use",
    url: "/pages/terms-of-use",
  },
  {
    title: "pages-cookie-policy",
    url: "/pages/cookie-policy",
  },
  {
    title: "pages-legal-information",
    url: "/pages/legal-information",
  },
];

const auth = [
  {
    title: "auth-login",
    url: "/auth/login",
  },
  {
    title: "auth-signup",
    url: "/auth/signup",
  },
  {
    title: "auth-forgot",
    url: "/auth/forgot",
  },
  {
    title: "auth-reset",
    url: "/auth/reset/:token",
  },
];

export const favorites = [
  {
    title: "my-leagues",
    url: "/favorites/leagues",
  },
  {
    title: "my-teams",
    url: "/favorites/teams",
  },
];

const sitemap: Item[] = [
  {
    title: "fixtures",
    url: "/fixtures/*",
    children: fixtures,
  },
  {
    title: "teams",
    url: "/soccer/teams/*",
    children: teams.concat(team),
  },
  {
    title: "match",
    url: "/soccer/fixtures/:localTeam/:visitorTeam/:id/*",
    children: match,
  },
  {
    title: "competitions",
    url: "/soccer/leagues/*",
    children: competitions.concat(league),
  },
  {
    title: "players",
    url: "/soccer/players/*",
    children: players.concat(player),
  },
  {
    title: "referrals",
    url: "/referrals",
  },
  {
    title: "search",
    url: "/soccer/search/*",
    children: search,
  },
  {
    title: "pages",
    url: "/pages/*",
    children: pages,
  },
  {
    title: "auth",
    url: "/auth/*",
    children: auth,
  },
  {
    title: "my",
    url: "/favorites/*",
    children: favorites,
  },
];

export const isMatchPath = (item: Item, location: string) => {
  if (item?.path !== undefined) {
    return item?.path.some((path) => matchPath({ path }, location));
  }
  if (item) {
    return !!matchPath({ path: item.url }, location);
  } else {
    return false;
  }
};

export default sitemap;
