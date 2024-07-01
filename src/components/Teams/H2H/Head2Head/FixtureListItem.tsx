import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Hidden from "@/components/Hidden/Hidden";
import Grid from "@mui/material/Grid";
import ChevronDownIcon from "../../../../components/icons/ChevronDownIcon";
import ChevronUpIcon from "../../../../components/icons/ChevronUpIcon";
import { EventType, H2HFixture } from "../../../../api";
import DateTz from "../../../../components/DateTz";
import Circle from "../../../../components/Circle";
import FixtureCenter from "../../../../components/FixtureCenter";
import TeamLink from "../../../../components/TeamLink";
import Event from "./Event";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { TStyleCls } from "@/utils/styling";
import { Theme } from "@mui/material/styles";

const makeCircleLocalWinStyles = (theme: Theme) => ({
  [`& .kind-local`]: {
    backgroundColor: theme.palette.success.main,
  },
  [`& .kind-visitor`]: {
    backgroundColor: theme.palette.error.main,
  },
});

const makeCircleVisitorWinStyles = (theme: Theme) => ({
  [`& .kind-visitor`]: {
    backgroundColor: theme.palette.success.main,
  },
  [`& .kind-local`]: {
    backgroundColor: theme.palette.error.main,
  },
});

type TClsKeys =
  | "circle"
  | "sideColumn"
  | "chevron"
  | "centralColumn"
  | "goalsContainer"
  | "goals"
  | "mobile"
  | "mobileColumn"
  | "singleScore";

const useStyles = makeStyles<{ localWin: boolean; visitorWin: boolean }>()((theme, { localWin, visitorWin }) => {
  let styles: TStyleCls<TClsKeys> = {
    circle: {
      display: "flex",
      alignItems: "center",
      margin: theme.spacing(0, 3),
    },

    sideColumn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:first-of-type": {
        borderRight: `1px solid ${theme.palette.grey[500]}`,
      },
      [theme.breakpoints.up("md")]: {
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
        margin: theme.spacing(2, 0),
        minWidth: theme.spacing(11),
        minHeight: theme.spacing(3.5),
        "&:last-child": {
          borderLeft: `1px solid ${theme.palette.grey[500]}`,
        },
      },
      [theme.breakpoints.down("md")]: {
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
      },
    },

    chevron: {
      [theme.breakpoints.up("md")]: {
        minWidth: theme.spacing(8),
      },
      [theme.breakpoints.down("md")]: {
        minWidth: theme.spacing(4),
      },
    },

    centralColumn: {
      height: 60,
      flexGrow: 1,
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.down("md")]: {
        height: 64,
        flexDirection: "column",
      },
    },

    goalsContainer: {
      ...theme.scrollbar,
      overflowX: "auto",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[300] : "rgba(169, 242, 76, 0.25)",
    },

    goals: {
      flexWrap: "nowrap",
    },

    mobile: {
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: theme.spacing(1),
      "&:first-of-type": {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
      },
    },

    mobileColumn: {
      width: theme.spacing(4),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    singleScore: {
      height: "100%",
      backgroundColor: theme.palette.grey[300],
    },
  };

  if (localWin) {
    styles.mobileColumn = {
      ...styles.mobileColumn,
      ...makeCircleLocalWinStyles(theme),
    };
    styles.circle = {
      ...styles.circle,
      ...makeCircleLocalWinStyles(theme),
    };
  }
  if (visitorWin) {
    styles.mobileColumn = {
      ...styles.mobileColumn,
      ...makeCircleVisitorWinStyles(theme),
    };
    styles.circle = {
      ...styles.circle,
      ...makeCircleVisitorWinStyles(theme),
    };
  }
  return styles;
});

type Props = {
  fixture: H2HFixture;
};

const eventsTypes = [EventType.GOAL, EventType.PENALTY, EventType.YELLOW_CARD, EventType.RED_CARD];

export function FixtureListItem(props: Props): React.ReactElement {
  const { fixture } = props;
  const { settings } = useMst();
  const [open, setOpen] = useState(false);
  const hasGoals = fixture.events.length > 0;
  const localWin = fixture.localteam_score > fixture.visitorteam_score;
  const visitorWin = fixture.localteam_score < fixture.visitorteam_score;
  const { classes, cx } = useStyles({ localWin, visitorWin });
  return (
    <>
      <ListItem divider disableGutters button disableRipple onClick={() => setOpen(!open)} component="li" sx={{ p: 0 }}>
        <Box className={classes.sideColumn}>
          <Typography>
            <DateTz>{fixture.time.starting_at}</DateTz>
          </Typography>
        </Box>
        <Box className={classes.centralColumn}>
          <Hidden implementation="css" mdDown>
            <Box className={classes.circle}>
              <Circle className="kind-local" />
            </Box>
            <FixtureCenter fixture={fixture} />
            <Box className={classes.circle}>
              <Circle className="kind-visitor" />
            </Box>
          </Hidden>
          <Hidden implementation="css" mdUp>
            <Box className={classes.mobile}>
              <TeamLink
                id={fixture.localteam_id}
                name={fixture.localteam_name}
                winner={fixture.winner_team_id === fixture.localteam_id}
              >
                {(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
              </TeamLink>
              <Box className={classes.mobileColumn}>
                <Circle className="kind-local" />
              </Box>
              <Typography className={cx(classes.mobileColumn, classes.singleScore)}>
                {fixture.localteam_score}
              </Typography>
            </Box>
            <Box className={classes.mobile}>
              <TeamLink
                id={fixture.visitorteam_id}
                name={fixture.visitorteam_name}
                winner={fixture.winner_team_id === fixture.visitorteam_id}
              >
                {(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
              </TeamLink>
              <Box className={classes.mobileColumn}>
                <Circle className="kind-visitor" />
              </Box>
              <Typography className={cx(classes.mobileColumn, classes.singleScore)}>
                {fixture.visitorteam_score}
              </Typography>
            </Box>
          </Hidden>
        </Box>
        <Box className={cx(classes.sideColumn, classes.chevron)}>
          {hasGoals && (open ? <ChevronUpIcon color="action" /> : <ChevronDownIcon color="action" />)}
        </Box>
      </ListItem>
      {hasGoals && (
        <Collapse in={open} unmountOnExit component="li" className={classes.goalsContainer}>
          <Grid container spacing={2} className={classes.goals}>
            {fixture.events
              .filter((event) => eventsTypes.includes(event.type))
              .map((event) => (
                <Event key={event.id} fixture={fixture} event={event} />
              ))}
          </Grid>
        </Collapse>
      )}
    </>
  );
}

export default observer(FixtureListItem);
