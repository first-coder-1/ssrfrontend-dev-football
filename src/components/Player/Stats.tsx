import React, { useEffect, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import PlaceholderList from "@/components/PlaceholderList";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { getPlayerRatingHistory, getPlayerStats, Player, PlayerRatingHistory, PlayerStats } from "../../api";
import LeagueImage from "@/components/LeagueImage";
import { Line } from "./Line";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  league: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  boxes: {
    display: "flex",
    justifyContent: "space-around",
  },

  arrow: {
    color: theme.palette.grey[300],
  },

  tooltip: {
    padding: theme.spacing(0.4, 0.8),
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.grey[theme.palette.mode === "dark" ? 100 : 600],
  },

  popper: {
    zIndex: 0,
    marginBottom: theme.spacing(2.5),
  },

  tooltips: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 36,
  },

  line: {
    paddingTop: 0,
  },
}));

type Props = {
  player: Player;
  playerStats: PlayerStats;
  playerHistory: PlayerRatingHistory[];
};

export function Stats({ player, playerStats, playerHistory }: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PlayerStats | undefined>(playerStats);
  const [history, setHistory] = useState<PlayerRatingHistory[]>(() => playerHistory.slice(0, 5).reverse());
  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promiseStats, cancelStats] = getPlayerStats(player._id);
    const [promiseRating, cancelRating] = getPlayerRatingHistory(player._id);
    Promise.all([promiseStats, promiseRating])
      .then(
        ([resStats, resRating]) => {
          setStats(resStats.data);
          setHistory(resRating.data.slice(0, 5).reverse());
        },
        () => {
          setStats(undefined);
          setHistory([]);
        }
      )
      .finally(() => setLoading(false));
    return () => {
      cancelStats();
      cancelRating();
    };
  }, [player]);
  if (loading) {
    return <PlaceholderList size={40} />;
  }
  if (!stats) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={intl.get("players.stats")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List>
          <ListItem>
            <ListItemText primary={intl.get("players.goals")} />
            <ListItemSecondaryAction>
              <Typography variant="body2">~ {stats.goals}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={intl.get("players.assists")} />
            <ListItemSecondaryAction>
              <Typography variant="body2">~ {stats.assists}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={intl.get("players.appearences")} />
            <ListItemSecondaryAction>
              <Typography variant="body2">~ {stats.appearences}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary={intl.get("players.dribbles")} />
            <ListItemSecondaryAction>
              <Typography variant="body2">
                ~ {stats.dribbles_success} ({stats.dribbles_attempts})
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider={history.length > 1}>
            <ListItemText primary={intl.get("players.passes")} />
            <ListItemSecondaryAction>
              <Typography variant="body2">
                ~ {stats.passes_accuracy} ({stats.passes_total})
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          {history.length > 1 && (
            <>
              <ListItem divider>
                <ListItemText
                  primary={intl.get("players.seasons")}
                  primaryTypographyProps={{
                    variant: "h6",
                    align: "center",
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  disableTypography
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography>{intl.get("players.rating") + " ~"}</Typography>
                      &nbsp;
                      <Typography color="primary">
                        {(history.reduce((sum, item) => sum + item.rating, 0) / history.length).toFixed(1)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem className={classes.boxes}>
                {history.map((item) => (
                  <div key={item._id} className={classes.league}>
                    <LeagueImage url={item.league.logo_path} name={item.league.name} variant="22x22" disableMargin />
                    <Typography>
                      {item.name
                        .split("/")
                        .map((year) => year.substr(2))
                        .join("/")}
                    </Typography>
                  </div>
                ))}
              </ListItem>
              <ListItem className={cx(classes.boxes, classes.tooltips)}>
                {history.map((item) => (
                  <Tooltip
                    key={item._id}
                    title={item.rating}
                    placement="top"
                    open
                    arrow
                    classes={{ arrow: classes.arrow, tooltip: classes.tooltip, popper: classes.popper }}
                  >
                    <span />
                  </Tooltip>
                ))}
              </ListItem>
              <ListItem className={classes.line}>
                <ListItemText disableTypography>
                  <Line history={history} />
                </ListItemText>
              </ListItem>
            </>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
