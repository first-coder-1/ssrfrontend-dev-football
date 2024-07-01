import React from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Hidden from "@mui/material/Hidden";
import PenaltyCard from "../../../../components/PenaltyCard";
import Flag from "../../../../components/Flag";
import SoccerIcon from "../../../../components/icons/SoccerIcon";
import { EventType, FixtureEvent, LineupCoach, Lineups, ReducedTeam } from "../../../../api";
import TeamImage from "../../../../components/TeamImage";
import PlayerImage from "../../../../components/PlayerImage";
import { slugify } from "../../../../utils";
import { observer } from "mobx-react-lite";
import { useMst } from "../../../../store";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";

const useStyles = makeStyles()((theme) => ({
  root: {
    width: "100%",
    "&:first-of-type": {
      borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
  },

  subheader: {
    height: theme.spacing(6),
  },

  item: {
    height: theme.spacing(7.5),
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      height: theme.spacing(10),
      flexDirection: "column",
      "&:nth-of-type(even)": {
        backgroundColor: theme.palette.grey[300],
      },
    },
  },

  number: {
    backgroundColor: theme.palette.grey[300],
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(1),
  },

  flag: {
    margin: theme.spacing(0, 1.5),
  },

  box: {
    display: "flex",
    alignItems: "center",
  },

  stat: {
    display: "flex",
    miwWidth: theme.spacing(4),
    "& :first-of-type": {
      margin: theme.spacing(0, 0.5),
    },
  },
}));

type Props = {
  team: ReducedTeam;
  lineups: Lineups;
  events: FixtureEvent[];
  coach?: LineupCoach;
};

const eventsTypes = [EventType.GOAL, EventType.PENALTY, EventType.YELLOW_CARD, EventType.RED_CARD];

export function TeamList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, lineups, events, coach } = props;
  const { settings } = useMst();
  const { classes } = useStyles();
  const lineup = lineups.lineup.filter((lineup) => lineup.team_id === team._id);
  // const { locale } = useParams();
  return (
    <List disablePadding className={classes.root}>
      <ListItem className={classes.subheader}>
        <TeamImage url={team.logo_path} name={(!settings.originalNames && team.name_loc) || team.name} variant="24x" />
        <Typography
          variant="subtitle1"
          component={NavLink}
          to={`/soccer/teams/${slugify(team.name)}/${team._id}/summary`}
        >
          {(!settings.originalNames && team.name_loc) || team.name}
        </Typography>
      </ListItem>
      {lineup
        .filter((lineup) => lineup.player)
        .map((lineup) => (
          <ListItem key={lineup.player_id} divider className={classes.item}>
            <Hidden mdUp>
              <Box className={classes.box}>
                {lineup.player!.country_iso2 && <Flag country={lineup.player!.country_iso2} className={classes.flag} />}
                {lineup.number !== null && <span className={classes.number}>{lineup.number}</span>}
              </Box>
            </Hidden>
            <Box className={classes.box}>
              <Hidden mdDown>
                <span className={classes.number}>{lineup.number}</span>
                <PlayerImage
                  url={lineup.player!.image_path}
                  name={(!settings.originalNames && lineup.player_name_loc) || lineup.player_name}
                  variant="48x48"
                />
              </Hidden>
              <Typography
                component={NavLink}
                to={`/soccer/players/${slugify(lineup.player_name)}/${lineup.player_id}/summary`}
              >
                {lineup.captain && intl.get("match.captain-short") + " "}
                {(!settings.originalNames && lineup.player_name_loc) || lineup.player_name}
              </Typography>
            </Box>
            <Box className={classes.box}>
              {events
                .filter((event) => event.player_id === lineup.player_id && eventsTypes.includes(event.type))
                .map((event) => {
                  let icon: React.ReactElement;
                  switch (event.type) {
                    case EventType.YELLOW_CARD:
                      icon = <PenaltyCard />;
                      break;
                    case EventType.RED_CARD:
                      icon = <PenaltyCard red />;
                      break;
                    default:
                      icon = <SoccerIcon fontSize="small" color="action" viewBox="0 0 16 16" />;
                  }
                  return (
                    <Box key={event.id} className={classes.stat}>
                      {icon}
                      {event.minute + (event.extra_minute || 0)}&apos;
                    </Box>
                  );
                })}
              {lineup.player!.country_iso2 && (
                <Hidden mdDown>
                  <Flag country={lineup.player!.country_iso2} className={classes.flag} />
                </Hidden>
              )}
            </Box>
          </ListItem>
        ))}
      {coach && (
        <ListItem divider className={classes.item}>
          <Hidden mdUp>
            <Box className={classes.box}>
              {coach.country_iso2 && <Flag country={coach.country_iso2} className={classes.flag} />}
              <span className={classes.number}>{intl.get("teams.coach-short")}</span>
            </Box>
          </Hidden>
          <Box className={classes.box}>
            <Hidden mdDown>
              <span className={classes.number}>{intl.get("teams.coach-short")}</span>
              <PlayerImage url={coach.image_path} name={coach.common_name || coach.common_name} variant="48x48" />
            </Hidden>
            <Typography>{(!settings.originalNames && coach.common_name_loc) || coach.common_name}</Typography>
          </Box>
          <Box className={classes.box}>
            {coach.country_iso2 && (
              <Hidden mdDown>
                <Flag country={coach.country_iso2} className={classes.flag} />
              </Hidden>
            )}
          </Box>
        </ListItem>
      )}
    </List>
  );
}

export default observer(TeamList);
