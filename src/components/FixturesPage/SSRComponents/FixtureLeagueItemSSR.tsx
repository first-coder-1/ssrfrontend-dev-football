import React, { FC, startTransition, useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { addDays, endOfTomorrow, startOfYesterday } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { useMst } from "../../../store";
import FixtureItem from "../FixtureItem";
import Circle from "../../Circle";
import { FixtureLeagueModel } from "../../../models/FixtureLeagueModel";
import { slugify } from "../../../utils";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../../shared/NavLink";
import { FixtureLeague } from "@/api";
import { LeagueItemSSR } from "./LeagueItemSSR";
import { FixtureItemSSR } from "../FixtureItemSSR/FixtureItemSSR";

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
  fixtureLeague: FixtureLeague;
};

// TODO: esoccer conditions
//const re = /(8|10|12) mins play/;

export const FixtureLeagueItemSSR: FC<Props> = ({ fixtureLeague }) => {
  const intl = useIntl();
  const { classes } = useStyles();
  const { favorites, settings } = useMst();
  const start = Math.round(startOfYesterday().getTime() / 1000);
  const days = settings.extendedFavoritesTime ? 6 : 0;
  const end = Math.round(addDays(endOfTomorrow(), days).getTime() / 1000);

  // TODO: esoccer conditions
  //const matches = re.exec(leagueModel.league.name);
  const matchTime = 90;
  // const { locale } = useParams();
  const leagueLink = `/soccer/leagues/${slugify(fixtureLeague.name)}/${fixtureLeague._id}/tables`;
  return (
    <LeagueItemSSR
      favorites={favorites}
      settings={settings}
      fixtureLeague={fixtureLeague}
      collapsableList={fixtureLeague.fixtures.map((fixture) => {
        const checked = favorites.fixtures.has(fixture._id);
        return (
          <FixtureItemSSR
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
        fixtureLeague.live_standings && (
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
    </LeagueItemSSR>
  );
};

export default observer(FixtureLeagueItemSSR);
