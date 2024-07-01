import { del, get, post } from "./base";
import { Account, UserResponse } from "./types";

export type LoginData = {
  username: string;
  password: string;
};

export type ConfirmData = {
  token: string;
};

export type ForgotData = {
  username: string;
};

export type ResetData = {
  token: string;
  password: string;
};

export type OAuthData = {
  accessToken: string;
};

export function login(data: LoginData) {
  return post<UserResponse>("/security/login", data);
}

export function signup(data: LoginData, referral?: string) {
  return post<UserResponse>("/security/signup", data, {
    params: {
      referral,
    },
  });
}

export function confirm(data: ConfirmData) {
  return post<{}>("/security/confirm", data);
}

export function forgot(data: ForgotData) {
  return post<{}>("/security/forgot", data);
}

export function reset(data: ResetData) {
  return post<{}>("/security/reset", data);
}

export function logout() {
  return post<{}>("/security/logout", {});
}

export function facebook(data: OAuthData, referral?: string) {
  return post<UserResponse>("/security/facebook", data, {
    params: {
      referral,
    },
  });
}

export function google(data: OAuthData, referral?: string) {
  return post<UserResponse>("/security/google", data, {
    params: {
      referral,
    },
  });
}

export function getAccount() {
  return get<Account>("/my");
}

export function deleteAccount() {
  return del<{}>("/my");
}
