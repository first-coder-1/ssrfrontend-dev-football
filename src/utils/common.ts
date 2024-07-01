import { matchPath } from "react-router";

export const isBrowser = typeof window !== "undefined";
export const isServer = typeof window === "undefined";

export type Item = {
  title: string;
  url: string;
  path?: string[];
  children?: Item[];
};

export const isMatchPath = (item: Item, location: string) => {
  if (item.path !== undefined) {
    return item.path.some((path) => matchPath({ path }, location));
  }
  return matchPath({ path: item.url }, location);
};

export const isLocalhost = () =>
  Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
