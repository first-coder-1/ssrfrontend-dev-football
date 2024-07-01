import { makeAutoObservable, observe, runInAction } from "mobx";
// import intl from "react-intl-universal";
import { isAfter, parseISO } from "date-fns";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@/models/User";
import {
  confirm,
  ConfirmData,
  deleteAccount,
  facebook,
  forgot,
  ForgotData,
  getAccount,
  google,
  login,
  LoginData,
  logout,
  OAuthData,
  reset,
  ResetData,
  signup,
} from "@/api/security";
import axios from "@/axios";
import { createDevice, deleteDevice, UserResponse } from "@/api";
import { RootStore } from "./RootStore";
import { PushNotifications } from "@/utils/pushNotifications";
import { isLocalhost } from "@/utils/common";
import { setCookie, deleteCookie } from "cookies-next";
import { getStoreInitialData } from "@/utils/cookies";

export class AuthStore {
  root: RootStore;

  user?: User = undefined;
  lastError?: string;
  referralCode: string | null = null;
  referralsByDate: Date | null = null;

  constructor(root: RootStore, initialData?: any) {
    makeAutoObservable(this, { root: false }, { autoBind: true });
    this.root = root;

    observe(this, () => this.save());
    observe(this, "user", () => this.updateToken());
    const json = getStoreInitialData(initialData, "user");
    if (
      json?.username &&
      json?.token &&
      json?.expiresAt * 1000 > new Date().getTime()
    ) {
      this.setUser(new User(json.username, json.token, json.expiresAt));
    }
  }

  get hasReferrals() {
    return this.referralsByDate && isAfter(this.referralsByDate, new Date());
  }

  clearData() {
    PushNotifications.getToken().then((token) => {
      if (token !== undefined) {
        const [promise] = deleteDevice(token);
        promise.then(
          () => console.log("Device is deleted"),
          (err) => console.error(err)
        );
      }
    });

    this.user = undefined;
    deleteCookie("user");
  }

  init() {
    axios.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearData();
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
    if (this.user) {
      this.retrieveAccount();
    }
  }

  save() {
    if (this.user) {
      const value = JSON.stringify({
        username: this.user.username,
        token: this.user.token,
        expiresAt: this.user.expiresAt,
      });
      setCookie("user", value);
    } else {
      this.clearData();
    }
  }

  updateToken() {
    axios.defaults.headers.common["X-Auth-Token"] = this.user?.token ?? "";

    if (!isLocalhost() && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then(async (registration) => {
        const token = await PushNotifications.getToken(registration);
        if (this.user != null && token !== undefined) {
          const [promise] = createDevice(token);
          promise.then(
            () => console.log("Device is created"),
            () => console.log("Device is already registered")
          );
        }
      });
    }
  }

  retrieveAccount() {
    const [promise] = getAccount();
    promise.then((response) => {
      runInAction(() => {
        const data = response.data;
        this.referralCode = data.referralCode;
        this.referralsByDate = data.referralsByDate
          ? parseISO(data.referralsByDate)
          : null;
      });
    });
  }

  onLoginFulfilled(res: AxiosResponse<UserResponse>) {
    this.setUser(
      new User(res.data.username, res.data.token, res.data.expires_at)
    );
    this.retrieveAccount();
  }

  onLoginRejected() {
    //TODO: this.setLastError(intl.get("auth.invalid-credentials"));
  }

  login(data: LoginData) {
    const [promise] = login(data);
    return promise.then(this.onLoginFulfilled);
  }

  signup(data: LoginData, referral?: string) {
    const [promise] = signup(data, referral);
    return promise;
  }

  confirm(data: ConfirmData) {
    const [promise] = confirm(data);
    return promise;
  }

  forgot(data: ForgotData) {
    const [promise] = forgot(data);
    return promise;
  }

  reset(data: ResetData) {
    const [promise] = reset(data);
    return promise;
  }

  logout() {
    const [promise] = logout();
    promise.finally(() => this.clearData());
  }

  facebook(data: OAuthData, referral?: string) {
    const [promise] = facebook(data, referral);
    promise.then(this.onLoginFulfilled, this.onLoginRejected);
  }

  google(data: OAuthData, referral?: string) {
    const [promise] = google(data, referral);
    promise.then(this.onLoginFulfilled, this.onLoginRejected);
  }

  delete() {
    const [promise] = deleteAccount();
    promise.then(this.clearData);
  }

  setUser(user: User) {
    this.user = user;
  }

  setLastError(error?: string) {
    this.lastError = error;
  }
}
