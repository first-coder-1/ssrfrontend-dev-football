import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { NavLink } from 'react-router-dom';
import { LeagueTrophy } from "@/api";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import { getTrophiesByLeague, League } from "../../../api";
import TeamImage from "../../../components/TeamImage";
import { slugify } from "../../../utils";
import PlaceholderList from "../../../components/PlaceholderList";
import NavLink from "@/components/shared/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  item: {
    height: 58,
  },

  year: {
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },

  slash: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  logo: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  runnerUp: {
    "&.MuiGrid-item": {
      paddingLeft: theme.spacing(0.5),
    },
  },
}));

type Props = {
  league: League;
  trophies: LeagueTrophy[];
};

type Trophy = {
  winner_logo_path?: string;
  runnerUp_logo_path?: string;
  winner?: string;
  runnerUp?: string;
  winner_id?: number;
  runnerUp_id?: number;
};

export function Trophies(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { league, trophies: initialTrophies } = props;
  // const { locale } = useParams();
  const [loading, setLoading] = useState(false);

  const trophiesMap = initialTrophies.reduce((map, trophies) => {
    trophies.trophies.forEach((trophy) => {
      trophy.seasons.forEach((season) => {
        const property = trophy.status === "Winner" ? "winner" : "runnerUp";
        const idProperty = `${property}_id` as "winner_id" | "runnerUp_id";
        const logoProperty = `${property}_logo_path` as "winner_logo_path" | "runnerUp_logo_path";
        if (map.has(season)) {
          const entry = map.get(season)!;
          entry[property] = trophies.name;
          entry[idProperty] = trophies._id;
          entry[logoProperty] = trophies.logo_path;
        } else {
          map.set(season, {
            [property]: trophies.name,
            [idProperty]: trophies._id,
            [logoProperty]: trophies.logo_path,
          });
        }
      });
    });

    return map;
  }, new Map<string, Trophy>());

  const [trophies, setTrophies] = useState<Map<string, Trophy>>(trophiesMap);

  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getTrophiesByLeague(league._id);
    promise
      .then(
        (res) => {
          const map = res.data.reduce((map, trophies) => {
            trophies.trophies.forEach((trophy) => {
              trophy.seasons.forEach((season) => {
                const property = trophy.status === "Winner" ? "winner" : "runnerUp";
                const idProperty = `${property}_id` as "winner_id" | "runnerUp_id";
                const logoProperty = `${property}_logo_path` as "winner_logo_path" | "runnerUp_logo_path";
                if (map.has(season)) {
                  const entry = map.get(season)!;
                  entry[property] = trophies.name;
                  entry[idProperty] = trophies._id;
                  entry[logoProperty] = trophies.logo_path;
                } else {
                  map.set(season, {
                    [property]: trophies.name,
                    [idProperty]: trophies._id,
                    [logoProperty]: trophies.logo_path,
                  });
                }
              });
            });

            return map;
          }, new Map<string, Trophy>());
          return setTrophies(
            new Map(
              Array.from(map.entries()).sort(([a], [b]) => {
                if (a < b) {
                  return 1;
                }
                if (a > b) {
                  return -1;
                }
                return 0;
              })
            )
          );
        },
        () => setTrophies(new Map())
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [league]);

  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.trophies")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <ListSubheader>
            <Grid container>
              <Grid item xs={3}>
                <Typography>{intl.get("leagues.season")}</Typography>
              </Grid>
              <Grid container item xs={9}>
                <Grid item xs={6}>
                  <Typography>{intl.get("leagues.winner")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{intl.get("leagues.runner-up")}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </ListSubheader>
          {loading ? (
            <PlaceholderList size={58} />
          ) : (
            Array.from(trophies.entries()).map(([season, entry]) => {
              const [start, end] = season.split("/");
              return (
                <ListItem divider key={season} className={classes.item}>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography component="span" className={classes.year}>
                        {start}
                      </Typography>
                      <Typography component="span" className={classes.slash}>
                        /
                      </Typography>
                      <Typography component="span" className={classes.year}>
                        {end}
                      </Typography>
                    </Grid>
                    <Grid container item xs={9} spacing={1}>
                      <Grid container item xs={6} alignItems="center">
                        {entry.winner_logo_path && (
                          <TeamImage
                            url={entry.winner_logo_path}
                            name={entry.winner!}
                            variant="24x"
                            className={classes.logo}
                          />
                        )}
                        <Typography
                          component={NavLink}
                          to={`/soccer/teams/${slugify(entry.winner)}/${entry.winner_id}/summary`}
                        >
                          {entry.winner}
                        </Typography>
                      </Grid>
                      <Grid container item xs={6} alignItems="center" className={classes.runnerUp}>
                        {entry.runnerUp_logo_path && (
                          <TeamImage
                            url={entry.runnerUp_logo_path}
                            name={entry.runnerUp!}
                            variant="24x"
                            className={classes.logo}
                          />
                        )}
                        <Typography
                          component={NavLink}
                          to={`/soccer/teams/${slugify(entry.runnerUp)}/${entry.runnerUp_id}/summary`}
                        >
                          {entry.runnerUp}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default Trophies;
