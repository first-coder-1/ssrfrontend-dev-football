import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { getLeagueStats, League, LeagueStats } from "../../api";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  item: {
    paddingBottom: 0,
  },

  action: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

type Props = {
  league: League;
  initialStats?: LeagueStats;
};

export function Stats(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { league, initialStats } = props;
  const [stats, setStats] = useState<LeagueStats | undefined>(initialStats || undefined);

  useEffect(() => {
    const [promise, cancel] = getLeagueStats(league._id);
    promise.then(
      (res) => setStats(res.data),
      () => setStats(undefined)
    );
    return cancel;
  }, [league._id]);

  if (!stats) {
    return null;
  }

  const totalWon = stats.home_won + stats.away_won;
  
  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.stats.title")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardMedia>
        <Typography variant="subtitle1">{intl.get("leagues.stats.facts")}</Typography>
        <List disablePadding>
          <ListItem disableGutters className={classes.item}>
            <ListItemText primary={intl.get("leagues.stats.goals")} />
            <ListItemSecondaryAction className={classes.action}>
              <Typography>~ {stats.avg_overall_goals_per_season.toFixed(2)}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem disableGutters className={classes.item}>
            <ListItemText primary={intl.get("leagues.stats.avg-goals")} />
            <ListItemSecondaryAction className={classes.action}>
              <Typography>~ {stats.avg_goals_per_game.toFixed(2)}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem disableGutters className={classes.item}>
            <ListItemText primary={intl.get("leagues.stats.home-wins")} />
            <ListItemSecondaryAction className={classes.action}>
              <Typography>~ {totalWon > 0 ? ((stats.home_won / totalWon) * 100).toFixed(0) : 0}%</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem disableGutters className={classes.item}>
            <ListItemText primary={intl.get("leagues.stats.away-wins")} />
            <ListItemSecondaryAction className={classes.action}>
              <Typography>~ {totalWon > 0 ? ((stats.away_won / totalWon) * 100).toFixed(0) : 0}%</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          {stats.yellow_cards_per_season > 0 && (
            <ListItem disableGutters className={classes.item}>
              <ListItemText primary={intl.get("leagues.stats.yellow-cards")} />
              <ListItemSecondaryAction className={classes.action}>
                <Typography>~ {stats.yellow_cards_per_season}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )}
          {stats.red_cards_per_season > 0 && (
            <ListItem disableGutters className={classes.item}>
              <ListItemText primary={intl.get("leagues.stats.red-cards")} />
              <ListItemSecondaryAction className={classes.action}>
                <Typography>~ {stats.red_cards_per_season}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )}
          {stats.rounds_per_season > 0 && (
            <ListItem disableGutters className={classes.item}>
              <ListItemText primary={intl.get("leagues.stats.rounds")} />
              <ListItemSecondaryAction className={classes.action}>
                <Typography>~ {stats.rounds_per_season}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </CardMedia>
    </Card>
  );
}
