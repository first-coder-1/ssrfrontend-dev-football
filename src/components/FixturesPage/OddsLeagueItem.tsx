import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FixtureWithMarket, FixtureLeague, ODDS_FORMAT } from "../../api";
import { FavoritesStore, SettingsStore } from "../../store";
import { LeagueItem } from "./LeagueItem";
import OddsItem from "./OddsItem";
import { FixtureLeagueModel } from "../../models/FixtureLeagueModel";

const useStyles = makeStyles()((theme) => ({
  oddName: {
    margin: theme.spacing(0, 3),
    minWidth: theme.spacing(8),
    textAlign: "center",
  },
}));

type Props = {
  favorites: FavoritesStore;
  settings: SettingsStore;
  leagueModel: FixtureLeagueModel<FixtureLeague<FixtureWithMarket>>;
  format: ODDS_FORMAT;
};

export const OddsLeagueItem = observer(function (props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { favorites, settings, leagueModel, format } = props;
  return (
    <LeagueItem
      favorites={favorites}
      settings={settings}
      leagueModel={leagueModel}
      collapsableList={leagueModel.league.fixtures.map((fixture) => {
        const checked = favorites.fixtures.has(fixture._id);
        return (
          <OddsItem
            key={fixture._id}
            checked={checked}
            fixture={fixture}
            format={format}
            timeFormat={settings.timeFormat}
            settings={settings}
            onFavoriteChange={() => {
              if (checked) {
                favorites.removeFixtures(fixture._id);
              } else {
                favorites.addFixtures(fixture._id);
              }
            }}
          />
        );
      })}
    >
      {(open) =>
        open && (
          <Box sx={{ display: "flex", mr: 8.5 }}>
            <Typography className={classes.oddName}>1</Typography>
            <Typography className={classes.oddName}>X</Typography>
            <Typography className={classes.oddName}>2</Typography>
          </Box>
        )
      }
    </LeagueItem>
  );
});
