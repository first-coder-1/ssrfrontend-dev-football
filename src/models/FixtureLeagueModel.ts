import { makeAutoObservable } from "mobx";
import { FixtureLeague } from "@/api";
import { isLive } from "@/utils";

export class FixtureLeagueModel<T extends FixtureLeague = FixtureLeague> {
  open: boolean;

  constructor(
    public league: T,
    userLocale?: string,
    forceOpen?: boolean
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.open = forceOpen || league.live || !!(userLocale && league.country.iso2 === userLocale);
  }

  setLeague(league: T) {
    this.league = league;
  }

  updateLiveStatus() {
    this.league.live = this.league.fixtures.some((fixture) => isLive(fixture.time.status));
  }

  toggle() {
    this.open = !this.open;
  }
}
