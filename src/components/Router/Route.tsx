import React, { FC } from "react";
import { matchPath } from "react-router";

type TRouteProps = {
  element: JSX.Element;
  path: string;
  pathname?: string;
};

export const Route: FC<TRouteProps> = ({ element, path, pathname }) => {
  const isMatchPath = pathname ? !!matchPath(path, pathname) : false;
  return <>{isMatchPath && element}</>;
};
