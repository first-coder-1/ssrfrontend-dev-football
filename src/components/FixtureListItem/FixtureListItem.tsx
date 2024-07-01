import React, { useState } from "react";

import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ChevronUpIcon from "../icons/ChevronUpIcon";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import { isCancelled, isFinished, isLive, score, slugify } from "@/utils";
import { TeamSeasonFixture } from "@/api";
import FixtureCenter from "../FixtureCenter";
import TimeTz from "../TimeTz";
import Live from "../Live";
import TeamImage from "../TeamImage";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  avatar: {
    display: "flex",
    alignItems: "center",
  },

  sideColumn: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: theme.spacing(2, 0),
      minWidth: theme.spacing(11),
      minHeight: theme.spacing(3.5),
      "&:first-of-type": {
        borderRight: `1px solid ${theme.palette.grey[500]}`,
      },
      "&:last-child": {
        borderLeft: `1px solid ${theme.palette.grey[500]}`,
      },
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  centralColumn: {
    height: 60,
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
  },

  central: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    flex: 1,
  },

  name: {
    flex: 1,
    "&:first-of-type": {
      textAlign: "right",
    },
  },

  logo: {
    verticalAlign: "middle",
    "&:first-of-type": {
      marginLeft: theme.spacing(3),
    },
    "&:last-child": {
      marginRight: theme.spacing(3),
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  position: {
    width: theme.spacing(4),
    "&:first-of-type": {
      textAlign: "left",
    },
    "&:last-child": {
      textAlign: "right",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  score: {
    minWidth: theme.spacing(9),
    margin: theme.spacing(0, 2.5),
    fontWeight: theme.typography.fontWeightBold!,
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(0, 1),
    },
  },

  primaryScore: {
    color: theme.palette.primary.main,
  },

  goal: {
    backgroundColor: theme.palette.grey[300],
  },

  medium: {
    fontWeight: theme.typography.fontWeightMedium!,
  },
}));

type Props = {
  fixture: TeamSeasonFixture;
  showPositions?: boolean;
};

export function FixtureListItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { fixture, showPositions } = props;
  const { settings } = useMst();
  let left: React.ReactNode;
  if (isLive(fixture.time.status)) {
    left = <Live status={fixture.time.status} />;
  } else if (isFinished(fixture.time.status) || isCancelled(fixture.time.status)) {
    left = <Typography>{intl.get(`fixtures.statuses.${fixture.time.status}`)}</Typography>;
  } else {
    left = (
      <Typography>
        <TimeTz>{fixture.time.starting_at}</TimeTz>
      </Typography>
    );
  }
  const [open, setOpen] = useState(false);
  const hasGoals = fixture.goals.length > 0;
  const standings = fixture.standings;
  //
  return (
    <>
      <ListItem divider disableGutters button disableRipple onClick={() => setOpen(!open)}>
        <Box className={classes.sideColumn}>{left}</Box>
        <Box className={classes.centralColumn}>
          <Box className={classes.avatar}>
            <TeamImage
              url={fixture.localteam_logo_path}
              name={(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
              variant="32x"
              className={classes.logo}
              disableMargin
            />
            <Typography className={classes.position}>
              {standings?.localteam_position && showPositions && `#${standings?.localteam_position}`}
            </Typography>
          </Box>
          <FixtureCenter fixture={fixture} />
          <Box className={classes.avatar}>
            <Typography className={classes.position}>
              {standings?.visitorteam_position && showPositions && `#${standings?.visitorteam_position}`}
            </Typography>
            <TeamImage
              url={fixture.visitorteam_logo_path}
              name={(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
              variant="32x"
              className={classes.logo}
              disableMargin
            />
          </Box>
        </Box>
        <Box className={classes.sideColumn}>
          {hasGoals && (open ? <ChevronUpIcon color="action" /> : <ChevronDownIcon color="action" />)}
        </Box>
      </ListItem>
      {hasGoals && (
        <Collapse in={open} unmountOnExit>
          <List disablePadding>
            {fixture.goals.map((goal) => (
              <ListItem key={`${goal.minute}-${goal.extra_minute}-${goal.result}`} className={classes.goal}>
                <Box className={classes.central}>
                  <Typography
                    className={classes.name}
                    component={NavLink}
                    to={
                      goal.player_name && goal.player_id
                        ? `/soccer/players/${slugify(goal.player_name)}/${goal.player_id}/summary`
                        : `/soccer/players`
                    }
                  >
                    {fixture.localteam_id === Number(goal.team_id) &&
                      `${goal.player_name || ""} ${goal.minute + (goal.extra_minute || 0)}'`}
                  </Typography>
                  <Chip color="default" label={score(goal.result)} className={classes.score} />
                  <Typography
                    className={classes.name}
                    component={NavLink}
                    to={
                      goal.player_name && goal.player_id
                        ? `/soccer/players/${slugify(goal.player_name)}/${goal.player_id}/summary`
                        : `/soccer/players`
                    }
                  >
                    {fixture.visitorteam_id === Number(goal.team_id) &&
                      `${goal.player_name || ""} ${goal.minute + (goal.extra_minute || 0)}'`}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default observer(FixtureListItem);
