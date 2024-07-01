import { TFixturesByPlAndSRes } from "@/components/Player/Matches/MatchesTab";
import { autorun, makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { getStoreInitialData } from "@/utils/cookies";
import { setCookie } from "cookies-next";
import { LeagueSeason } from "@/api";

export class IntermediateStore {
  private static getFromStorage(initialData?: any): {
    FixturesByPlAndSRes: TFixturesByPlAndSRes;
  } {
    return getStoreInitialData(initialData, "intermediate", true);
  }

  FixturesByPlAndSRes: TFixturesByPlAndSRes = {
    loading: true,
    fixtures: [],
    min: 1,
    max: 1,
  };

  activeSeason?: LeagueSeason = undefined;

  OpenedCount: number = 0;

  root: RootStore;

  constructor(root: RootStore, initialData?: any) {
    this.getFromStorage(initialData);
    makeAutoObservable(this, { root: false }, { autoBind: true });
    this.root = root;
    autorun(() => this.save());
  }

  getFromStorage(initialData?: any) {
    const json = IntermediateStore.getFromStorage(initialData);
    this.setFixturesByPlAndSRes(json.FixturesByPlAndSRes);
  }

  incOpenedCount() {
    this.OpenedCount = this.OpenedCount + 1;
  }

  decOpenedCount() {
    this.OpenedCount = this.OpenedCount - 1;
  }

  setActiveSeason(season: LeagueSeason) {
    this.activeSeason = season;
  }

  save() {
    const value = JSON.stringify({
      FixturesByPlAndSRes: this.FixturesByPlAndSRes,
    });
    setCookie("intermediate", value);
  }

  get fixturesByPlAndSRes() {
    return this.FixturesByPlAndSRes;
  }

  get openedCount() {
    return this.OpenedCount;
  }

  setFixturesByPlAndSRes(newFixturesByPlAndSRes: TFixturesByPlAndSRes) {
    this.FixturesByPlAndSRes = newFixturesByPlAndSRes;
    // this.save();
  }
}
