import {
  BornToday,
  Player,
  PlayerAbroad,
  PlayerCardscorer,
  PlayerCareerEvent,
  PlayerChart,
  PlayerRatingHistory,
  PlayerStats,
  PlayerTopscorer,
  Sidelined,
} from "./types";
import { get } from "./base";

export function getBornToday(page: number) {
  return get<BornToday[]>("/players/born-today", {
    params: {
      page,
    },
  });
}

export function getTopscorers(page: number) {
  return get<PlayerTopscorer[]>("/players/topscorers", {
    params: {
      page,
    },
  });
}

export function getCardscorers(page: number) {
  return get<PlayerCardscorer[]>("/players/cardscorers", {
    params: {
      page,
    },
  });
}

export function getAbroad(page: number) {
  return get<PlayerAbroad[]>("/players/abroad", {
    params: {
      page,
    },
  });
}

export function getPlayer(playerId: number) {
  return get<Player>(`/players/${playerId}`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}

export function getPlayerCareer(playerId: number) {
  return get<PlayerCareerEvent[]>(`/players/${playerId}/career`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}

export function getPlayerSidelined(playerId: number) {
  return get<Sidelined[]>(`/players/${playerId}/sidelined`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}

export function getPlayerStats(playerId: number) {
  return get<PlayerStats>(`/players/${playerId}/stats`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}

export function getPlayerChart(playerId: number) {
  return get<PlayerChart>(`/players/${playerId}/chart`);
}

export function getPlayerRatingHistory(playerId: number) {
  return get<PlayerRatingHistory[]>(`/players/${playerId}/rating-history`, {
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    },
  });
}
