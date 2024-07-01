import { computed, makeAutoObservable, runInAction } from "mobx";
import React, { useCallback, useEffect } from "react";
import { FixtureLeagueModel } from "@/models/FixtureLeagueModel";
import { FixtureLeague, FixtureStatusParam, getFixturesByDate, getLivescores, PartialLivescore } from "@/api";
import { isToday } from "date-fns";
import { AxiosResponse } from "axios";
import { RootStore, useMst } from "./RootStore";
import { isLiveOrScheduled, sortLeagues } from "@/utils";
import { ORDER_MATCHES_BY } from "@/constants/enums";

type FixturesResponse = {
  isLastPage: boolean;
  page: number;
  leagues: FixtureLeagueModel[];
};

export const INITIAL_STATE: FixturesResponse = {
  isLastPage: false,
  page: 0,
  leagues: [],
};

function request(
  date?: Date,
  bytime?: boolean,
  status?: FixtureStatusParam,
  esoccer?: boolean,
  friendly?: boolean,
  women?: boolean,
  skip?: number,
  limit?: number,
  leagueIds?: number[]
) {
  if (!date || isToday(date)) {
    return getLivescores(bytime, status, esoccer, friendly, women, skip, limit, leagueIds);
  } else {
    return getFixturesByDate(date, bytime, status, esoccer, friendly, women, skip, limit, leagueIds);
  }
}

export const PER_PAGE = 20;

export class FixturesStore {
  root: RootStore;
  data: FixturesResponse = INITIAL_STATE;
  fetching = false;

  date?: Date = undefined;
  status?: FixtureStatusParam = undefined;
  my?: boolean = undefined;

  constructor(root: RootStore) {
    makeAutoObservable<FixturesStore, "root">(this, { root: false, leagues: computed.struct }, { autoBind: true });
    this.root = root;
    if (typeof window !== "undefined") {
      window.addEventListener("fixtures", this.onSocketMessage as EventListener);
    }
  }

  get leagues() {
    const favorites = this.root.favorites;
    const settings = this.root.settings;

    if (this.my) {
      return this.data.leagues.filter((leagueModel) => {
        return (
          favorites.leagues.has(leagueModel.league._id) ||
          leagueModel.league.fixtures.some((fixture) => favorites.fixtures.has(fixture._id))
        );
      });
    }
    return this.data.leagues
      .slice()
      .sort(sortLeagues(Array.from(favorites.leagues.values()), settings.country, !!settings.fl));
  }

  get showLoader() {
    return this.fetching && this.leagues.length === 0;
  }

  setConfig(date?: Date, status?: FixtureStatusParam, my?: boolean) {
    this.date = date;
    this.status = status;
    this.my = my;
  }

  fetchFixtures(page?: number) {
    const leagueIds = this.root.favorites.leaguesIds;
    const settings = this.root.settings;
    const bytime = settings.orderMatchesBy === ORDER_MATCHES_BY.MATCH_START_TIME;
    runInAction(() => {
      this.fetching = true;
      if (!page) {
        this.data = INITIAL_STATE;
      }
    });

    const promises: Promise<AxiosResponse<FixtureLeague[]>>[] = [];
    const cancels: Function[] = [];

    if (!page && leagueIds && leagueIds.length > 0) {
      const result = request(
        this.date,
        bytime,
        this.status,
        settings.esoccer,
        settings.friendly,
        settings.women,
        undefined,
        undefined,
        leagueIds
      );
      promises.push(result[0]);
      cancels.push(result[1]);
    }

    const result = request(
      this.date,
      bytime,
      this.status,
      settings.esoccer,
      settings.friendly,
      settings.women,
      page === undefined ? undefined : page * PER_PAGE,
      page === undefined ? undefined : PER_PAGE
    );

    promises.push(result[0]);
    cancels.push(result[1]);

    return [
      Promise.all(promises).then((responses) => {
        let leagues: FixtureLeagueModel[] = [];

        responses.forEach((response, i) => {
          let items = response.data;
          if (i !== 0 || responses.length === 1) {
            items = items.filter((league) => !this.root.favorites.leagues.has(league._id));
          }

          leagues = leagues.concat(
            items.map((entry) => new FixtureLeagueModel(entry, settings.country, settings.openLeagues))
          );
        });

        runInAction(() => {
          this.fetching = false;

          this.data.isLastPage = responses[responses.length - 1].data.length < PER_PAGE || page === undefined;
          if (page !== undefined) {
            this.data.page = page;
          }

          this.data.leagues = this.data.leagues.concat(leagues);
        });
      }),
      () => {
        cancels.map((cancel) => cancel());
      },
    ] as const;
  }

  private onSocketMessage = (evt: CustomEvent) => {
    const fixtureNow = evt.detail as PartialLivescore;

    this.data.leagues.find((leagueModel) => {
      const fixture = leagueModel.league.fixtures.find((fixture) => fixture._id === fixtureNow._id);

      if (fixture !== undefined && isLiveOrScheduled(fixture.time.status)) {
        fixture.scores = fixtureNow.scores;
        fixture.time = fixtureNow.time;
        fixture.winner_team_id = fixtureNow.winner_team_id;

        leagueModel.updateLiveStatus();
      }
      return fixture !== undefined;
    });
  };

  onLoadMoreRows = async () => {
    if (!this.data.isLastPage) {
      await this.fetchFixtures(this.data.page + 1)[0];
    }
  };
}
