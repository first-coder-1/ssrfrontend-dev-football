import React, { FC, startTransition, useState } from "react";
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import ListItem from "@mui/material/ListItem";
import ListItemIcon, { ListItemIconProps } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import { FavoritesStore, SettingsStore, useMst } from "@/store";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import ChevronUpIcon from "@/components/icons/ChevronUpIcon";
import Checkbox from "@/components/Checkbox";
import FavoriteSwitch from "@/components/FavoriteSwitch";
import Flag from "@/components/Flag";
import { FixtureLeagueModel } from "@/models/FixtureLeagueModel";
import { addDays, endOfTomorrow, startOfYesterday } from "date-fns";
import { useIntl } from "@/hooks/useIntl";
import { FixtureLeague } from "@/api";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(8),
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
  },

  box: {
    display: "flex",
    alignItems: "center",
  },

  titleContainer: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      justifyContent: "space-between",
    },
  },

  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("md")]: {
      fontWeight: theme.typography.fontWeightBold,
    },
  },

  action: {
    marginTop: theme.spacing(2),
    "& .MuiIconButton-root": {
      paddingRight: 0,
    },
  },
}));

const ListItemFlag = styled(ListItemIcon)<ListItemIconProps>(({ theme }) => ({
  height: theme.spacing(2.5),
  minWidth: theme.spacing(4),
}));

type Props = {
  favorites: FavoritesStore;
  settings: SettingsStore;
  fixtureLeague: FixtureLeague;
  collapsableList: React.ReactNode;
  children: (open: boolean) => React.ReactNode;
};

export const LeagueItemSSR: FC<Props> = observer((props) => {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { favorites, settings, fixtureLeague, collapsableList, children } = props;
  const league = fixtureLeague;
  const countryName = intl.get(`countries.${league.country.iso2.toUpperCase()}`);
  const start = Math.round(startOfYesterday().getTime() / 1000);
  const days = settings.extendedFavoritesTime ? 6 : 0;
  const end = Math.round(addDays(endOfTomorrow(), days).getTime() / 1000);
  const everyFixtures = league.fixtures.every((fixture) => favorites.fixtures.has(fixture._id));
  const open = league.live;
  return (
    <>
      <ListItem button disableRipple divider className={classes.root}>
        <ListItemIcon>
          <Checkbox
            checked={everyFixtures}
            disabled={
              !everyFixtures &&
              league.fixtures.some((fixture) => fixture.time.starting_at < start || fixture.time.starting_at > end)
            }
          />
        </ListItemIcon>
        <ListItemFlag>
          <Flag country={league.country.iso2} />
        </ListItemFlag>
        <ListItemText disableTypography className={classes.item}>
          <div className={cx(classes.box, classes.titleContainer)}>
            <Typography variant="body1" className={classes.title}>
              {countryName.toUpperCase()} {(!settings.originalNames && league.name_loc) || league.name}{" "}
              {league.stage && !league.name.match(league.stage.name) && (
                <>{league.stage.name.replace("Regular Season", "")}</>
              )}
            </Typography>
            <FavoriteSwitch
              checked={favorites.leagues.has(league._id)}
              onChange={(e) => {
                e.stopPropagation();
                startTransition(() => {
                  if (favorites.leagues.has(league._id)) {
                    favorites.removeFavoriteLeague(league._id);
                  } else {
                    favorites.addFavoriteLeague(league._id);
                  }
                });
              }}
            />
          </div>
          <Hidden mdDown implementation="css">
            <div className={classes.box}>
              {children(open)}
              <IconButton disableRipple>{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</IconButton>
            </div>
          </Hidden>
        </ListItemText>
      </ListItem>
      <Collapse in={open} timeout={0} unmountOnExit>
        <List disablePadding>{collapsableList}</List>
      </Collapse>
    </>
  );
});
