import { makeAutoObservable, runInAction } from "mobx";
import React, { useEffect } from "react";
import { getLivescoreEvents, LivescoreEvents, UpdateEvent } from "@/api";

class LiveScoresStore {
  data: LivescoreEvents[] = [];

  constructor() {
    makeAutoObservable<LiveScoresStore, "prevListener">(this, {
      prevListener: false,
    });
  }

  fetchLiveScores() {
    const [promise, cancel] = getLivescoreEvents();
    promise.then((res) => {
      runInAction(() => {
        this.data = res.data;
      });
    });
    return cancel;
  }

  private prevListener?: (evt: CustomEvent) => void = undefined;
  removeSocketListener = () => {
    if (this.prevListener !== undefined) {
      window.removeEventListener("events", this.prevListener as EventListener);
    }
  };

  setSocketListener(locale: string) {
    this.removeSocketListener();

    this.prevListener = (evt: CustomEvent) => {
      this.onSocketMessage(locale, evt);
    };
    window.addEventListener("events", this.prevListener as EventListener);
  }

  private onSocketMessage = (locale: string, evt: CustomEvent) => {
    const updateEvent = evt.detail as UpdateEvent;
    let livescore = updateEvent.livescore;
    const [localTeamScore, visitorTeamScore] = updateEvent.result
      ?.split("-")
      .map((score) => parseInt(score, 10)) ?? [0, 0];

    let event: LivescoreEvents;

    const idx = this.data.findIndex((item) => item._id === livescore._id);
    if (idx !== -1) {
      event = this.data.splice(idx, 1)[0];
    } else {
      let localTeamName: string;
      if (
        livescore.localteam_translation &&
        livescore.localteam_translation[locale]
      ) {
        localTeamName = livescore.localteam_translation[locale];
      } else {
        localTeamName = livescore.localteam_name;
      }

      let visitorTeamName: string;
      if (
        livescore.visitorteam_translation &&
        livescore.visitorteam_translation[locale]
      ) {
        visitorTeamName = livescore.visitorteam_translation[locale];
      } else {
        visitorTeamName = livescore.visitorteam_name;
      }

      event = {
        _id: livescore._id,
        time: livescore.time,
        localteam_event: {
          localteam_name: localTeamName,
          visitorteam_name: visitorTeamName,
          score: localTeamScore,
        },
        visitorteam_event: {
          localteam_name: localTeamName,
          visitorteam_name: visitorTeamName,
          score: visitorTeamScore,
        },
      };
    }

    const teamId = parseInt(updateEvent.team_id, 10);
    if (teamId === livescore.localteam_id) {
      event.localteam_event.id = updateEvent.id;
      event.localteam_event.type = updateEvent.type;
      event.localteam_event.score = localTeamScore;
    } else {
      event.visitorteam_event.id = updateEvent.id;
      event.visitorteam_event.type = updateEvent.type;
      event.visitorteam_event.score = visitorTeamScore;
    }

    this.data.unshift(event);
  };
}

// todo refactor to singleton, when will be refactor RootStore
export const LiveScoresStoreInstance = new LiveScoresStore();
const LiveScoresStoreContext = React.createContext(LiveScoresStoreInstance);

export const useLiveScoresStore = () =>
  React.useContext(LiveScoresStoreContext);

export const useLiveScoresEvents = (locale: string) => {
  const liveScoresStore = useLiveScoresStore();

  useEffect(() => {
    const cancel = liveScoresStore.fetchLiveScores();
    return cancel;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    liveScoresStore.setSocketListener(locale);
    return liveScoresStore.removeSocketListener;
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return liveScoresStore.data;
};
