import { getCookie, setCookie } from "cookies-next";
import { AxiosError, AxiosResponse } from "axios";
import { autorun, makeAutoObservable, observe, runInAction } from "mobx";
import { format } from "date-fns";
import { getBookmaker, getMySettings, ODDS_FORMAT, TimeFormat } from "@/api";
import { RootStore } from "./RootStore";
import { isServer, isBrowser } from "@/utils";
import { getStoreInitialData } from "@/utils/cookies";
import { WindowSize } from "@/utils/types";
import { ORDER_MATCHES_BY } from "@/constants/enums";

export enum ODDS_MODE {
  ODDS = "odds",
  PREDICTIONS = "predictions",
}

type Bookmaker = number | undefined;

let timeout: ReturnType<typeof setTimeout>;
const log = (...message: any[]) => {
  const d = new Date();
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  console.debug("\n", "\x1b[36m%s\x1b[0m", `LOG ${time} - `, "", ...message, "\n\n");
};

export class SettingsStore {
  root: RootStore;

  dark: boolean;
  timeZone: string;
  orderMatchesBy: ORDER_MATCHES_BY;
  oddsMode: ODDS_MODE;
  hideLivebar: boolean;
  oddsFormat: ODDS_FORMAT;
  bookmaker: Bookmaker;
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

  fl?: string;

  constructor(root: RootStore, initialData?: any) {
    const json = getStoreInitialData(initialData, "settings");
    this.dark = json.dark ?? false;
    this.timeZone = json.timeZone ?? format(new Date(), "x");
    this.orderMatchesBy = json.orderMatchesBy ?? ORDER_MATCHES_BY.LEAGUE_NAME;
    this.oddsMode = json.oddsMode ?? ODDS_MODE.ODDS;
    this.hideLivebar = json.hideLivebar ?? true;
    this.oddsFormat = json.oddsFormat ?? ODDS_FORMAT.EU;
    this.bookmaker = json.bookmaker;
    this.hasChosenBookmaker = json.hasChosenBookmaker ?? false;
    this.esoccer = json.esoccer ?? false;
    this.cookieBanner = json.cookieBanner ?? false;
    this.functionalCookies = json.functionalCookies ?? false;
    this.thirdPartyCookies = json.thirdPartyCookies ?? false;
    this.notifications = json.notifications ?? false;
    this.country = json.country ?? "";
    this.locale = json.locale ?? null;
    this.bedtimeMode = json.bedtimeMode ?? false;
    this.friendly = json.friendly ?? true;
    this.women = json.women ?? true;
    this.extendedFavoritesTime = json.extendedFavoritesTime ?? false;
    this.openLeagues = json.openLeagues ?? false;
    this.openOdds = json.openOdds ?? false;
    this.timeFormat = json.timeFormat ?? TimeFormat.HHmm;
    this.originalNames = json.originalNames ?? false;
    this.oddsSwitchPositionNotified = json.oddsSwitchPositionNotified ?? false;
    this.windowSize = json.windowSize ?? "lg";

    makeAutoObservable(this, { root: false }, { autoBind: true });
    this.root = root;

    isBrowser &&
      setTimeout(() => {
        autorun(() => this.save());
      }, 100);
  }

  private static getDataFromStorage(): Record<string, any> {
    // TODO: const storedData = await localForage.getItem("settings");
    return {};
  }

  async setData() {}

  init() {
    this.syncSettings();
    // healthcheck.get("").then(this.onHealthCheck).catch(this.onHealthCheckError);
    observe(this.root.auth, "user", () => this.syncSettings());
  }

  getJSON() {
    const data = {
      dark: this.dark,
      timeZone: this.timeZone,
      orderMatchesBy: this.orderMatchesBy,
      oddsMode: this.oddsMode,
      hideLivebar: this.hideLivebar,
      oddsFormat: this.oddsFormat,
      bookmaker: this.bookmaker,
      hasChosenBookmaker: this.hasChosenBookmaker,
      esoccer: this.esoccer,
      cookieBanner: this.cookieBanner,
      functionalCookies: this.functionalCookies,
      thirdPartyCookies: this.thirdPartyCookies,
      notifications: this.notifications,
      country: this.country,
      locale: this.locale,
      bedtimeMode: this.bedtimeMode,
      friendly: this.friendly,
      women: this.women,
      extendedFavoritesTime: this.extendedFavoritesTime,
      openLeagues: this.openLeagues,
      openOdds: this.openOdds,
      timeFormat: this.timeFormat,
      originalNames: this.originalNames,
      oddsSwitchPositionNotified: this.oddsSwitchPositionNotified,
      windowSize: this.windowSize,
    };
    return data;
  }

  save() {
    if (isServer) return;
    const value = JSON.stringify(this.getJSON());
    setCookie("settings", value);
  }

  syncSettings() {
    if (this.root.auth.user) {
      const [promise] = getMySettings();
      promise.then((res) => {
        runInAction(() => {
          this.dark = res.data.dark ?? this.dark;
          this.timeZone = res.data.timeZone ?? this.timeZone;
          this.orderMatchesBy = res.data.orderMatchesBy ?? this.orderMatchesBy;
          this.oddsMode = res.data.oddsMode ?? this.oddsMode;
          this.hideLivebar = res.data.hideLivebar ?? this.hideLivebar;
          this.oddsFormat = res.data.oddsFormat ?? this.oddsFormat;
          this.bookmaker = res.data.bookmaker ?? this.bookmaker;
          this.hasChosenBookmaker = res.data.hasChosenBookmaker ?? this.hasChosenBookmaker;
          this.esoccer = res.data.esoccer ?? this.esoccer;
          this.cookieBanner = res.data.cookieBanner ?? this.cookieBanner;
          this.functionalCookies = res.data.functionalCookies ?? this.functionalCookies;
          this.thirdPartyCookies = res.data.thirdPartyCookies ?? this.thirdPartyCookies;
          this.notifications = res.data.notifications ?? this.notifications;
          this.country = res.data.country ?? this.country;
          this.locale = res.data.locale ?? this.locale;
          this.bedtimeMode = res.data.bedtimeMode ?? this.bedtimeMode;
          this.friendly = res.data.friendly ?? this.friendly;
          this.women = res.data.women ?? this.women;
          this.extendedFavoritesTime = res.data.extendedFavoritesTime ?? this.extendedFavoritesTime;
          this.openLeagues = res.data.openLeagues ?? this.openLeagues;
          this.timeFormat = res.data.timeFormat ?? this.timeFormat;
          this.originalNames = res.data.originalNames ?? this.originalNames;
          this.oddsSwitchPositionNotified = res.data.oddsSwitchPositionNotified ?? this.oddsSwitchPositionNotified;
          this.windowSize = res.data.windowSize ?? this.windowSize;
        });
      });
    }
  }

  changeDark(dark: boolean) {
    this.dark = dark;
  }

  changeTimeZone(timeZone: string) {
    this.timeZone = timeZone;
  }

  changeOrderMatchesBy(value: ORDER_MATCHES_BY) {
    this.orderMatchesBy = value;
  }

  changeOddsMode(value: ODDS_MODE) {
    this.oddsMode = value;
  }

  changeHideLiveBar(hideLivebar: boolean) {
    this.hideLivebar = hideLivebar;
  }

  changeOddsFormat(oddsFormat: ODDS_FORMAT) {
    this.oddsFormat = oddsFormat;
  }

  changeWindowSize(windowSize: WindowSize) {
    this.windowSize = windowSize;
  }

  async fetchBookmaker() {
    if (!this.root.auth.user && !this.bookmaker && this.country) {
      const [promise] = getBookmaker(this.country.toLowerCase());
      const [response] = await Promise.all([promise]);
      this.changeBookmaker(response.data._id);
    }
    return this.bookmaker;
  }

  changeBookmaker(bookmaker: Bookmaker, manual = false) {
    this.bookmaker = bookmaker;
    this.hasChosenBookmaker = this.hasChosenBookmaker || manual;
  }

  changeEsoccer(esoccer: boolean) {
    this.esoccer = esoccer;
  }

  changeCookies = (functional: boolean, thirdParty: boolean) => {
    this.cookieBanner = true;
    this.functionalCookies = functional;
    this.thirdPartyCookies = thirdParty;
  };

  changeNotifications(notifications: boolean) {
    this.notifications = notifications;
  }

  changeBedtimeMode(bedtimeMode: boolean) {
    this.bedtimeMode = bedtimeMode;
  }

  changeCountry(country: string) {
    this.country = country;
  }

  changeLocale(locale: string) {
    this.locale = locale;
  }

  changeFriendly(friendly: boolean) {
    this.friendly = friendly;
  }

  changeWomen(women: boolean) {
    this.women = women;
  }

  changeExtendedFavoritesTime(extendedFavoritesTime: boolean) {
    this.extendedFavoritesTime = extendedFavoritesTime;
  }

  changeOpenLeagues(openLeagues: boolean) {
    this.openLeagues = openLeagues;
  }

  changeOpenOdds(openOdds: boolean) {
    this.openOdds = openOdds;
  }

  changeTimeFormat(timeFormat: TimeFormat) {
    this.timeFormat = timeFormat;
  }

  toggleOriginalNames() {
    this.originalNames = !this.originalNames;
  }

  notifyOddsSwitchPosition() {
    this.oddsSwitchPositionNotified = true;
  }

  onHealthCheck(res: AxiosResponse) {
    this.fl = res.headers["x-content-fl"] || "";
    if (!this.country) {
      this.country = res.headers["x-content-locale"] || "";
    }
  }

  onHealthCheckError(err: AxiosError) {
    if (err.response?.status === 503) {
      this.root.maintenanceOn();
    }
  }
}
