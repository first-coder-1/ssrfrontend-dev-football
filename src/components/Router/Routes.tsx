import React, { FC } from "react";

type TRoutesProps = {
  children: JSX.Element | JSX.Element[] | (() => JSX.Element);
  pathname: string;
};

export const Routes: FC<TRoutesProps> = ({ children, pathname }) => {
  const childrenWithProps = React.Children.map(children, (child) => {

    if (React.isValidElement(child)) {
      return React.cloneElement<any>(child, { pathname });
    }

    return child;
  });
  
  return <>{childrenWithProps}</>;
};
