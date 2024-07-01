import { Favorites, Referral, Settings } from "./types";
import { del, get, post, put } from "./base";

export function getMyFavorites() {
  return get<Favorites>("/my/favorites");
}

export function setMyFavorites(
  leagues: number[],
  teams: number[],
  fixtures: number[],
  notifiableLeagues: number[],
  notifiableTeams: number[],
  notifiableFixtures: number[],
) {
  return put<Favorites>("/my/favorites", {
    leagues,
    teams,
    fixtures,
    notifiableLeagues,
    notifiableTeams,
    notifiableFixtures,
  });
}

export function getMySettings() {
  return get<Settings>("/my/settings");
}

export function setMySettings(settings: Settings) {
  return put<Settings>("/my/settings", settings);
}

type PasswordData = {
  password: string;
  newPassword: string;
};

export function setPassword(data: PasswordData) {
  return put<Settings>("/my/password", data);
}

export function createDevice(token: string) {
  return post<any>("/my/devices", { token });
}

export function deleteDevice(token: string) {
  return del<any>(`/my/devices/${token}`);
}

export function getMyReferrals(skip?: number, limit?: number) {
  return get<Referral[]>("/my/referrals", {
    params: {
      skip,
      limit,
    },
  });
}
