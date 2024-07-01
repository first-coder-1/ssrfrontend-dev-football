import React from "react";
import { makeStyles } from "tss-react/mui";
import { CSSObject } from "tss-react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Circle from "@/components/Circle";
import NavLink from "@/components/shared/NavLink";
import { useIsActiveNavBarTab } from "@/hooks/useActiveNavbarTab";
import { TStyleCls } from "@/utils/styling";

type TClsKeys = "circle" | "icon" | "root";

const useStyles = makeStyles<{ active: boolean }, TClsKeys>()((theme, _params, classes) => {
  const styles: TStyleCls<TClsKeys> = {
    root: {
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    circle: {
      marginRight: theme.spacing(1),
    },
    icon: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
  };

  if (_params.active) {
    styles.circle = {
      ...styles.circle,
      backgroundColor: "#EB5757",
      opacity: 0.5,
    };
    styles.icon.color = theme.palette.primary.main;
  }
  return styles;
});

type Props = {
  to: string;
  exact?: boolean;
  icon?: React.ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  forcedActive?: boolean;
};

export default function NavItem({
  to,
  exact,
  onClick,
  icon,
  children,
  forcedActive,
}: React.PropsWithChildren<Props>): JSX.Element {
  const computedRouteIsActive = useIsActiveNavBarTab(to);
  const active = forcedActive ?? computedRouteIsActive;

  const { classes } = useStyles({ active });
  return (
    <Link
      color="secondary"
      component={NavLink}
      to={to}
      end={exact}
      className={classes.root}
      onClick={onClick}
      sx={{
        margin: (theme) => theme.spacing(0, 3),
      }}
    >
      {icon ? <div className={classes.icon}>{icon}</div> : <Circle className={classes.circle} />}
      <Typography variant="subtitle1" component="span">
        {children}
      </Typography>
    </Link>
  );
}
