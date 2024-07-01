import Hidden from "@/components/Hidden/Hidden";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import React from "react";
import { makeStyles } from "tss-react/mui";
import NavItem from "./NavItem";
// import { NavItem } from "./NavItem";
// import { LanguageMenu } from "./LanguageMenu";
import { Logo, LogoSmall } from "@/components/Logo";
import { useIntl } from "@/hooks/useIntl";
import dynamic from "next/dynamic";
import { LanguageMenu } from "./LanguageMenu";
import { Search } from "./Search";
import Settings from "./Settings";
import { UserMenu } from "./UserMenu";
// import Settings from "./Settings";
// import { Logo, LogoSmall } from "../Logo";

const TeamsPopover = dynamic(() => import("./TeamsPopover"), { ssr: false });
const LeaguesPopover = dynamic(() => import("./LeaguesPopover"), { ssr: false });

const useStyles = makeStyles()((theme) => ({
  root: {
    boxShadow: `inset 0px -1px 0px ${
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "rgba(79, 79, 79, 0.08)"
    }`,
  },

  logo: {
    margin: theme.spacing(0, 3),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(0, 1),
    },
    [theme.breakpoints.down("sm")]: {
      width: 38,
      height: 38,
    },
  },

  language: {
    margin: theme.spacing(0, 1.5),
    backgroundColor: theme.palette.grey[50],
    minWidth: "auto",
  },

  spacer: {
    flex: "1 0 auto",
  },

  divider: {
    height: theme.spacing(3),
  },
}));

export function NavBar(): React.ReactElement {
  const { classes } = useStyles();
  const intl = useIntl();

  return (
    <Toolbar disableGutters className={classes.root}>
      <Link href={`/fixtures/all`}>
        <Hidden smDown>
          <Logo className={classes.logo} />
        </Hidden>
        <Hidden smUp>
          <LogoSmall className={classes.logo} />
        </Hidden>
      </Link>
      <Hidden mdDown>
        <NavItem to={`/fixtures`}>{intl.get("navbar.fixtures")}</NavItem>
        <LeaguesPopover />
        <TeamsPopover />
        <NavItem to={`/soccer/players/topscorers`}>{intl.get("navbar.players")}</NavItem>
      </Hidden>
      <div className={classes.spacer} />
      <Search />
      <Divider className={classes.divider} orientation="vertical" />
      <Settings />
      <Divider className={classes.divider} orientation="vertical" />
      <LanguageMenu />
      <Divider className={classes.divider} orientation="vertical" />
      <UserMenu />
    </Toolbar>
  );
}

export default NavBar;
