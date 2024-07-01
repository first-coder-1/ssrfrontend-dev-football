import React, { useMemo } from "react";
import { generatePath, matchPath } from "react-router";
// import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import MUIBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button, { ButtonProps } from "@mui/material/Button";
import Hidden from "@/components/Hidden/Hidden";
import HomeIcon from "@/components/icons/HomeIcon";
import sitemap, { isMatchPath, Item } from "@/sitemap";
import { ODDS_MODE, useMst } from "@/store";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import NavLink from "@/components/shared/NavLink/NavLink";
import { ORDER_MATCHES_BY } from "@/constants/enums";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: theme.spacing(6),
  },

  content: {
    display: "flex",
    alignItems: "center",
  },

  home: {
    verticalAlign: "text-top",
  },

  group: {
    marginLeft: theme.spacing(1),
  },

  breadcrumbs: {
    overflowX: "hidden",
    whiteSpace: "nowrap",
  },

  activeBreadcrumb: {
    color: theme.palette.primary.main,
    textDecoration: "none",

    ":hover": {
      textDecoration: "underline",
    },
  },

  ol: {
    flexWrap: "nowrap",
  },
}));

const Breadcrumbs = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const intl = useIntl();

  const location = useRouter();

  const items = useMemo(() => {
    let res: Item[] = [];
    const base = sitemap.find((item) => isMatchPath(item, location.pathname));
    if (base !== undefined) {
      res.push(base);
      if (base.children !== undefined) {
        const child = base.children.find((item) => isMatchPath(item, location.asPath));
        if (child !== undefined) {
          res.push(child);
        }
      }
    }

    return res;
  }, [location.asPath]);

  return (
    <MUIBreadcrumbs separator={isMobile ? "ᐧ" : "-"} classes={{ root: classes.breadcrumbs, ol: classes.ol }}>
      <Link href={`/`}>
        <HomeIcon color="primary" className={classes.home} />
      </Link>
      {items.map((item) => {
        if (item.children) {
          return (
            <NavLink
              key={item.title}
              to={generatePath(item.url, matchPath({ path: item.url }, location.asPath)!.params)}
              activeClassName={classes.activeBreadcrumb}
            >
              {intl.get(`navbar.${item.title}`)}
            </NavLink>
          );
        }
        return (
          <Typography key={item.title} variant="body2">
            {intl.get(`navbar.${item.title}`)}
          </Typography>
        );
      })}
    </MUIBreadcrumbs>
  );
};

const OddsSwitch = observer(() => {
  const { settings } = useMst();
  const intl = useIntl();

  return (
    <ButtonGroup size="small">
      <StyledButton
        variant="contained"
        color={settings.oddsMode === ODDS_MODE.ODDS ? "primary" : "secondary"}
        onClick={() => settings.changeOddsMode(ODDS_MODE.ODDS)}
      >
        {intl.get("settings.odds-modes-odds")}
      </StyledButton>
      <StyledButton
        variant="contained"
        color={settings.oddsMode === ODDS_MODE.PREDICTIONS ? "primary" : "secondary"}
        onClick={() => settings.changeOddsMode(ODDS_MODE.PREDICTIONS)}
      >
        {intl.get("settings.odds-modes-predictions")}
      </StyledButton>
    </ButtonGroup>
  );
});

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  "&.MuiButton-containedPrimary": {
    color: "white",
  },
  "&.MuiButton-containedSecondary": {
    color: theme.palette.primary.main,
  },
}));

export const Panel = observer(() => {
  const { classes } = useStyles();
  const { settings } = useMst();
  const intl = useIntl();
  const { asPath } = useRouter();

  return (
    <div className={classes.root}>
      <Breadcrumbs />
      <div className={classes.content}>
        {matchPath("/fixtures/:slugs", asPath) && !matchPath("/fixtures/odds", asPath) && (
          <>
            <Hidden mdDown>
              <Typography>{intl.get("settings.sort-by")}:</Typography>
            </Hidden>
            <ButtonGroup size="small" className={classes.group}>
              <StyledButton
                variant="contained"
                color={settings.orderMatchesBy === ORDER_MATCHES_BY.LEAGUE_NAME ? "primary" : "secondary"}
                onClick={() => settings.changeOrderMatchesBy(ORDER_MATCHES_BY.LEAGUE_NAME)}
              >
                {intl.get("settings.sort-by-league")}
              </StyledButton>
              <StyledButton
                variant="contained"
                color={settings.orderMatchesBy === ORDER_MATCHES_BY.MATCH_START_TIME ? "primary" : "secondary"}
                onClick={() => settings.changeOrderMatchesBy(ORDER_MATCHES_BY.MATCH_START_TIME)}
              >
                {intl.get("settings.sort-by-time")}
              </StyledButton>
            </ButtonGroup>
          </>
        )}

        {matchPath("fixtures/odds", asPath) && <OddsSwitch />}

        {matchPath("soccer/fixtures/:t1/:t2/:id/odds", asPath) && <OddsSwitch />}
      </div>
    </div>
  );
});
