import { createContext, useContext } from "react";
import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { SettingsStore } from "./SettingsStore";
import { FavoritesStore } from "./FavoritesStore";
import { AlertStore } from "./AlertStore";
import { AuthStore } from "./AuthStore";
import { isServer } from "@/utils/common";
import { IntermediateStore } from "./IntermediateStore";
import { FixturesStore } from "./FixturesStore";

type Nullable<T = undefined> = null | undefined | false | T;

// https://github.com/mobxjs/mobx-react-lite/blob/master/README.md#enablestaticrenderingenable-true
enableStaticRendering(isServer);

// https://mobx.js.org/configuration.html#configuration
// configure({
//   enforceActions: "always",
//   computedRequiresReaction: isBrowser,
//   reactionRequiresObservable: isBrowser,
//   observableRequiresReaction: isBrowser,
//   disableErrorBoundaries: false,
// });

export type TStoresMap = Omit<RootStore, "maintenance" | "maintenanceOn" | "init">;

export type TInitialStoreState = {
  initialStore?: Partial<Record<keyof TStoresMap, Partial<TStoresMap[keyof TStoresMap]>>>;
};

export class RootStore {
  public static instance?: RootStore;

  public settings: SettingsStore;
  public favorites: FavoritesStore;
  public alerts: AlertStore;
  public auth: AuthStore;
  public intermediate: IntermediateStore;
  public fixtures: FixturesStore;
  public maintenance = false;

  static getInstance(initialData?: object): RootStore {
    RootStore.instance = new RootStore(initialData);
    RootStore.instance.init();

    return RootStore.instance;
  }

  static makeInitialStoreStateForSSP(storeName: keyof TStoresMap, state: Partial<TStoresMap[keyof TStoresMap]>) {
    return { [storeName]: state };
  }

  constructor(initialData: any) {
    makeAutoObservable(
      this,
      {
        settings: false,
        favorites: false,
        alerts: false,
        auth: false,
        intermediate: false,
        fixtures: false,
      },
      { autoBind: true }
    );
    const { user, settings, favorites, intermediate } = initialData || {};
    this.auth = new AuthStore(this, user);
    this.settings = new SettingsStore(this, settings);
    this.favorites = new FavoritesStore(this, favorites);
    this.alerts = new AlertStore();
    this.intermediate = new IntermediateStore(this, intermediate);
    this.fixtures = new FixturesStore(this);
  }

  init() {
    this.auth.init();
    this.settings.init();
    this.favorites.init();
  }

  maintenanceOn() {
    this.maintenance = true;
  }
}
const RootStoreContext = createContext({} as ReturnType<typeof RootStore.getInstance>);

function initializeStore(cookiesData = {}, pageData = {}) {
  const _store = RootStore.getInstance({
    ...cookiesData,
    ...pageData,
  });
  return { store: _store };
}

export const StoreProvider: React.FC<React.PropsWithChildren<Record<string, any>>> = ({
  children,
  initialStoreFromCookies,
  initialStoreFromPage,
}) => {
  const { store } = initializeStore(initialStoreFromCookies, initialStoreFromPage);
  return (
    <>
      <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>
    </>
  );
};

export function useMst(): RootStore {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
