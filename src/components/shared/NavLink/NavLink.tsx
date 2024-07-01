import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cl from "clsx";
import { makeStyles } from "tss-react/mui";

type Props = {
  activeClassName?: string;
  to: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  end?: boolean;
  className?: string;
};

const useStyles = makeStyles()((theme) => ({
  root: {
    boxShadow: "inset 0px -1px 0px rgba(79, 79, 79, 0.08)",
  },

  link: {
    textDecoration: "none",

    ":hover": {
      textDecoration: "underline",
    },
  },
}));

export const NavLink = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<Props>>(
  ({ activeClassName, className, to, children, ...rest }, ref) => {
    const { classes } = useStyles();
    const { asPath: pathname } = useRouter();
    const isActive = useMemo(() => pathname === to, [pathname, to]);

    return (
      <Link
        ref={ref}
        href={to}
        className={cl(classes.link, className, isActive && activeClassName)}
        aria-current={pathname === to ? "page" : undefined}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export default NavLink;
