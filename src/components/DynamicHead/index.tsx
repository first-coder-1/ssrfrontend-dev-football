import React, { FC } from "react";
import { matchPath } from "react-router";

type THeads = { path: string; head: React.ReactNode }[];
type TProps = {
  pathname: string;
  heads: THeads;
};

export const DynamicHead: FC<TProps> = ({ pathname, heads }) => {
  const defineBody = (pathname: string) => {
    const result = heads.find((val) => {
      return !!matchPath(val.path, pathname);
    })?.head;
    return result;
  };

  return <>{defineBody(pathname)}</>;
};
