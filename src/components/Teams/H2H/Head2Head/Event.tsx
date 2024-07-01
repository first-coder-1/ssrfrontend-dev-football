import React from "react";

import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PenaltyCard from "../../../../components/PenaltyCard";
import TimeTz from "../../../../components/TimeTz";
import SoccerIcon from "../../../../components/icons/SoccerIcon";
import { EventType, H2HEvent, H2HFixture } from "../../../../api";
import { slugify } from "../../../../utils";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import PlayerImage from "../../../../components/PlayerImage";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  goal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 150,
    flex: "0 0 254px",
    "&:last-of-type": {
      paddingRight: theme.spacing(1),
    },
  },

  playerContainer: {
    position: "relative",
    width: "100%",
    height: 100,
    display: "flex",
    padding: theme.spacing(1.2),
    alignItems: "center",
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.1)",
  },

  player: {
    height: theme.spacing(9),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: "1 0 0%",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
  },

  eventTime: {
    width: 45,
    height: 22,
    backgroundColor: theme.palette.grey[300],
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },

  arrow: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    width: 17,
    height: 17,
    bottom: -7,
    right: 110,
    transform: "matrix(0.71, -0.71, 0.7, 0.71, 0, 0)",
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.1)",
  },
}));

type Props = {
  fixture: H2HFixture;
  event: H2HEvent;
};

export function Event(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { fixture, event } = props;
  const { settings } = useMst();

  let icon: React.ReactElement;
  switch (event.type) {
    case EventType.YELLOW_CARD:
      icon = <PenaltyCard />;
      break;
    case EventType.RED_CARD:
      icon = <PenaltyCard red />;
      break;
    default:
      icon = <SoccerIcon fontSize="small" viewBox="0 0 16 16" />;
  }
  const player = event.player;
  const time = event.minute + (event.extra_minute || 0);
  return (
    <Grid item xs={"auto"} key={`${event.minute}-${event.extra_minute}-${event.result}`} className={classes.goal}>
      <Paper className={classes.playerContainer}>
        <PlayerImage
          url={player?.image_path || undefined}
          name={(!settings.originalNames && player?.common_name_loc) || (player?.common_name as string)}
          disableMargin
          variant="60x60"
        />
        <Box className={classes.player}>
          <Typography
            variant="h6"
            align="center"
            component={NavLink}
            to={
              player?.common_name && event.player_id
                ? `/soccer/players/${slugify(player?.common_name)}/${event.player_id}/summary`
                : `/soccer/players`
            }
          >
            {(!settings.originalNames && player?.common_name_loc) || player?.common_name}
          </Typography>
          <Typography align="center">
            {Number(event.team_id) === fixture.localteam_id
              ? (!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name
              : (!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
          </Typography>
          <Box className={classes.cards}>
            <Box className={classes.eventTime}>
              {icon}
              <Typography component="span">{time}</Typography>
            </Box>
          </Box>
        </Box>
        <div className={classes.arrow} />
      </Paper>
      <TimeTz>{fixture.time.starting_at + time * 60}</TimeTz>
    </Grid>
  );
}

export default observer(Event);
