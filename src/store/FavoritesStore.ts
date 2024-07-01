import { addDays, endOfTomorrow, startOfYesterday } from "date-fns";
import { autorun, makeAutoObservable, observe } from "mobx";
// import intl from "react-intl-universal";
import {
  Favorites,
  getMyFavorites,
  getMyFixtures,
  setMyFavorites,
} from "@/api";
import { RootStore } from "./RootStore";
import { Alert, AlertSeverity } from "@/models/Alert";
import { getCookie, setCookie } from "cookies-next";
import { getStoreInitialData } from "@/utils/cookies";

function parseIds(ids?: string) {
  return ids?.split(",").map((str) => parseInt(str.trim(), 10)) || [];
}

function setsEqual(a: Set<number>, b: Set<number>) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

let timeout: ReturnType<typeof setTimeout>;

const limit = 150;

export class FavoritesStore {
  root: RootStore;

  leagues: Set<number> = new Set();
  teams: Set<number> = new Set();
  fixtures: Set<number> = new Set();
  notifiableLeagues: Set<number> = new Set();
  notifiableTeams: Set<number> = new Set();
  notifiableFixtures: Set<number> = new Set();

  private static getFromStorage(
    initialData?: any
  ): Record<string, Set<number>> {
    return getStoreInitialData(initialData, "favorites");
  }

  constructor(root: RootStore, initialData?: any) {
    this.getFromStorage(initialData);
    makeAutoObservable(this, { root: false }, { autoBind: true });
    this.root = root;
    autorun(() => this.save());
  }

  get leaguesIds() {
    return Array.from(this.leagues);
  }

  getFromStorage(initialData?: any) {
    const json = FavoritesStore.getFromStorage(initialData);
    this.leagues = new Set(
      json.leagues ?? parseIds(process.env.NEXT_PUBLIC_FAVORITE_LEAGUES)
    );
    this.teams = new Set(
      json.teams ?? parseIds(process.env.NEXT_PUBLIC_FAVORITE_TEAMS)
    );
    this.fixtures = new Set(json.fixtures ?? []);
    this.notifiableLeagues = new Set(
      json.notifiableLeagues ??
        parseIds(process.env.NEXT_PUBLIC_FAVORITE_LEAGUES)
    );
    this.notifiableTeams = new Set(
      json.notifiableTeams ?? parseIds(process.env.NEXT_PUBLIC_FAVORITE_TEAMS)
    );
    this.notifiableFixtures = new Set(json.notifiableFixtures ?? []);
  }

  init() {
    this.syncFavorites();
    if (this.fixtures.size > 0) {
      const start = Math.round(startOfYesterday().getTime() / 1000);
      const days = this.root.settings.extendedFavoritesTime ? 6 : 0;
      const end = Math.round(addDays(endOfTomorrow(), days).getTime() / 1000);
      const [promise] = getMyFixtures([
        ...this.fixtures.values(),
        ...this.notifiableFixtures.values(),
      ]);
      promise.then((res) => {
        const ids = res.data
          .filter(
            (fixture) =>
              fixture.time.starting_at < start || fixture.time.starting_at > end
          )
          .map((fixture) => fixture._id);
        this.removeFixtures(...ids);
        this.saveFavorites();
      });
    }
    observe(this.root.auth, "user", () => this.syncFavorites());
  }

  save() {
    const value = JSON.stringify({
      leagues: Array.from(this.leagues.values()),
      teams: Array.from(this.teams.values()),
      fixtures: Array.from(this.fixtures.values()),
      notifiableLeagues: Array.from(this.notifiableLeagues.values()),
      notifiableTeams: Array.from(this.notifiableTeams.values()),
      notifiableFixtures: Array.from(this.notifiableFixtures.values()),
    });
    setCookie("favorites", value);
    this.saveFavorites();
  }

  syncFavorites() {
    if (this.root.auth.user) {
      const [promise] = getMyFavorites();
      promise.then((res) => this.mergeFavorites(res.data));
    } else {
      this.getFromStorage();
    }
  }

  saveFavorites() {
    if (this.root.auth.user) {
      clearTimeout(timeout);
      timeout = setTimeout(
        () =>
          setMyFavorites(
            Array.from(this.leagues.values()),
            Array.from(this.teams.values()),
            Array.from(this.fixtures.values()),
            Array.from(this.notifiableLeagues.values()),
            Array.from(this.notifiableTeams.values()),
            Array.from(this.notifiableFixtures.values())
          ),
        1000
      );
    }
  }

  mergeFavorites(favorites: Favorites) {
    if (
      setsEqual(
        this.leagues,
        new Set(parseIds(process.env.NEXT_PUBLIC_FAVORITE_LEAGUES))
      )
    ) {
      this.leagues.clear();
    }
    favorites.leagues?.forEach((val) => val && this.leagues.add(val));
    if (
      setsEqual(
        this.teams,
        new Set(parseIds(process.env.NEXT_PUBLIC_FAVORITE_TEAMS))
      )
    ) {
      this.teams.clear();
    }
    favorites.teams?.forEach((val) => val && this.teams.add(val));
    favorites.fixtures?.forEach((val) => val && this.fixtures.add(val));
    if (
      setsEqual(
        this.notifiableLeagues,
        new Set(parseIds(process.env.NEXT_PUBLIC_FAVORITE_LEAGUES))
      )
    ) {
      this.notifiableLeagues.clear();
    }
    favorites.notifiableLeagues?.forEach(
      (val) => val && this.notifiableLeagues.add(val)
    );
    if (
      setsEqual(
        this.notifiableTeams,
        new Set(parseIds(process.env.NEXT_PUBLIC_FAVORITE_TEAMS))
      )
    ) {
      this.notifiableTeams.clear();
    }
    favorites.notifiableTeams?.forEach(
      (val) => val && this.notifiableTeams.add(val)
    );
    favorites.notifiableFixtures?.forEach(
      (val) => val && this.notifiableFixtures.add(val)
    );
  }

  addFavoriteLeague(leagueId: number) {
    if (this.leagues.size < limit) {
      this.leagues.add(leagueId);
      this.notifiableLeagues.add(leagueId);
    } else {
      this.limitWarning();
    }
  }

  removeFavoriteLeague(leagueId: number) {
    this.leagues.delete(leagueId);
    this.notifiableLeagues.delete(leagueId);
  }

  addNotifiableLeague(leagueId: number) {
    this.notifiableLeagues.add(leagueId);
  }

  removeNotifiableLeague(leagueId: number) {
    this.notifiableLeagues.delete(leagueId);
  }

  addFavoriteTeam(teamId: number) {
    if (this.teams.size < limit) {
      this.teams.add(teamId);
      this.notifiableTeams.add(teamId);
    } else {
      this.limitWarning();
    }
  }

  removeFavoriteTeam(teamId: number) {
    this.teams.delete(teamId);
    this.notifiableTeams.delete(teamId);
  }

  addNotifiableTeam(teamId: number) {
    this.notifiableTeams.add(teamId);
  }

  removeNotifiableTeam(teamId: number) {
    this.notifiableTeams.delete(teamId);
  }

  addFixtures(...fixtureIds: number[]) {
    if (this.fixtures.size < limit) {
      fixtureIds.forEach((id) => this.fixtures.add(id));
      fixtureIds.forEach((id) => this.notifiableFixtures.add(id));
    } else {
      this.limitWarning();
    }
  }

  removeFixtures(...fixtureIds: number[]) {
    fixtureIds.forEach((id) => this.fixtures.delete(id));
    fixtureIds.forEach((id) => this.notifiableFixtures.delete(id));
  }

  addNotifiableFixtures(...fixtureIds: number[]) {
    fixtureIds.forEach((id) => this.notifiableFixtures.add(id));
  }

  removeNotifiableFixtures(...fixtureIds: number[]) {
    fixtureIds.forEach((id) => this.notifiableFixtures.delete(id));
  }

  limitWarning() {
    // TODO: this.root.alerts.addAlert(
    //   new Alert(intl.get("favorites-limit-warning"), AlertSeverity.warning),
    // );
  }
}
