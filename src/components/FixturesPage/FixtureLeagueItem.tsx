import React, { startTransition, useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { addDays, endOfTomorrow, startOfYesterday } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { FavoritesStore, SettingsStore } from "../../store";
import { LeagueItem } from "./LeagueItem";
import FixtureItem from "./FixtureItem";
import Circle from "../../components/Circle";
import { FixtureLeagueModel } from "../../models/FixtureLeagueModel";
import { slugify } from "../../utils";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink";

const useStyles = makeStyles()((theme) => ({
  circle: {
    backgroundColor: theme.palette.success.main,
  },

  liveText: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(4),
  },
}));

type Props = {
  favorites: FavoritesStore;
  settings: SettingsStore;
  leagueModel: FixtureLeagueModel;
};

// TODO: esoccer conditions
//const re = /(8|10|12) mins play/;

export function FixtureLeagueItem(props: Props) {
  const intl = useIntl();
  const { classes } = useStyles();
  const { favorites, settings, leagueModel } = props;
  const start = Math.round(startOfYesterday().getTime() / 1000);
  const days = settings.extendedFavoritesTime ? 6 : 0;
  const end = Math.round(addDays(endOfTomorrow(), days).getTime() / 1000);

  // TODO: esoccer conditions
  //const matches = re.exec(leagueModel.league.name);
  const matchTime = 90;
  // const { locale } = useParams();
  const leagueLink = `/soccer/leagues/${slugify(leagueModel.league.name)}/${leagueModel.league._id}/tables`;
  return (
    <LeagueItem
      favorites={favorites}
      settings={settings}
      leagueModel={leagueModel}
      collapsableList={leagueModel.league.fixtures.map((fixture) => {
        const checked = favorites.fixtures.has(fixture._id);
        return (
          <FixtureItem
            key={fixture._id}
            checked={checked}
            disabled={!checked && (fixture.time.starting_at < start || fixture.time.starting_at > end)}
            fixture={fixture}
            matchTime={matchTime}
            settings={settings}
            onFavoriteChange={() => {
              startTransition(() => {
                if (checked) {
                  favorites.removeFixtures(fixture._id);
                } else {
                  favorites.addFixtures(fixture._id);
                }
              });
            }}
          />
        );
      })}
    >
      {() =>
        leagueModel.league.live_standings && (
          <>
            <Circle className={classes.circle} />
            <Typography
              variant="body2"
              color="secondary"
              className={classes.liveText}
              component={NavLink}
              to={leagueLink}
            >
              {intl.get("fixtures.live-standings")}
            </Typography>
          </>
        )
      }
    </LeagueItem>
  );
}

export default observer(FixtureLeagueItem);
