import React from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import { StandingExtended, StandingLetter } from "../../../api";
import Standing from "../../../components/Standing";
import Checkbox from "../../../components/Checkbox";
import { Status } from "./Status";
import { StandingVariant } from "./VariantSelect";
import TeamImage from "../../../components/TeamImage";
import { createH2HUrlComponent } from "../../../utils/h2h";
import { slugify } from "../../../utils";
import { SettingsStore } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";

const useStyles = makeStyles<{ color?: string }>()((theme, { color }) => ({
  root: {
    height: 50,
    boxShadow: color ? `inset 4px 0px 0px ${color}` : "none",
  },

  position: {
    flex: "0 0 30px",
    [theme.breakpoints.down("md")]: {
      flex: "0 0 20px",
    },
  },

  team: {
    flex: "1 0 0%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflowX: "hidden",
  },

  nameContainer: {
    display: "flex",
    alignItems: "center",
    overflowX: "hidden",
  },

  name: {
    ...theme.textOverflow,
    overflowX: "hidden",
  },

  status: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  mp: {
    textAlign: "center",
    flex: `0 0 ${theme.spacing(4.5)}`,
    [theme.breakpoints.down("md")]: {
      flex: `0 0 ${theme.spacing(3)}`,
    },
  },

  live: {
    color: theme.palette.error.main,
  },

  column: {
    textAlign: "center",
    flex: `0 0 ${theme.spacing(4.5)}`,
    [theme.breakpoints.down("md")]: {
      flex: `0 0 ${theme.spacing(2.5)}`,
    },
  },

  form: {
    flex: "0 0 120px",
    [theme.breakpoints.down("md")]: {
      flex: "0 0 70px",
    },
  },

  h2h: {
    width: 44,
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  comparison: {
    padding: theme.spacing(1),
  },

  circle: {
    margin: theme.spacing(1),
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: "50%",
    backgroundColor: theme.palette.error.main,
  },
}));

type Props = {
  standings: StandingExtended[];
  standing: StandingExtended;
  comparison: number[];
  setComparison: (comparison: number[]) => void;
  color?: string;
  variant: StandingVariant;
  settings: SettingsStore;
};

export function StandingItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { standings, standing, comparison, setComparison, color, variant, settings } = props;
  const { classes, cx } = useStyles({ color });
  // const { locale } = useParams();
  const checked = comparison.includes(standing.team_id);
  const checkbox = (
    <Checkbox
      value={standing.team_id}
      checked={checked}
      disabled={!checked && comparison.length > 1}
      onChange={() => {
        if (checked) {
          setComparison(comparison.filter((num) => num !== standing.team_id));
        } else {
          setComparison(comparison.concat(standing.team_id).sort((a, b) => a - b));
        }
      }}
    />
  );
  return (
    <ListItem divider key={standing.position} className={classes.root}>
      <Typography className={classes.position}>{standing.position}</Typography>
      <Box className={classes.team}>
        <Box className={classes.nameContainer}>
          <TeamImage
            url={standing.team_logo_path}
            name={(!settings.originalNames && standing.team_name_loc) || standing.team_name}
            variant="24x"
          />
          <Typography
            // title={(!settings.originalNames && standing.team_name_loc) || standing.team_name} @TODO: make title for navlink
            className={classes.name}
            component={NavLink}
            to={`/soccer/teams/${slugify(standing.team_name)}/${standing.team_id}/summary`}
          >
            {(!settings.originalNames && standing.team_name_loc) || standing.team_name}
          </Typography>
          {standing.live && <div className={classes.circle} />}
        </Box>
        <Box className={classes.status}>
          {standing.status && ["up", "down"].includes(standing.status) && <Status up={standing.status === "up"} />}
        </Box>
      </Box>
      <Typography className={cx(classes.mp, { [classes.live]: standing.live })}>
        {standing[variant]?.games_played ?? 0}
      </Typography>
      <Typography className={cx(classes.column, { [classes.live]: standing.live })}>
        {standing[variant]?.won ?? 0}
      </Typography>
      <Typography className={cx(classes.column, { [classes.live]: standing.live })}>
        {standing[variant]?.draw ?? 0}
      </Typography>
      <Hidden mdDown>
        <Typography className={classes.column}>{standing[variant]?.lost ?? 0}</Typography>
        <Typography className={classes.column}>{standing[variant]?.goals_scored ?? 0}</Typography>
        <Typography className={classes.column}>{standing[variant]?.goals_against ?? 0}</Typography>
        <Typography className={classes.column}>{standing.total?.goal_difference ?? 0}</Typography>
        <Typography className={classes.column}>{standing.points}</Typography>
      </Hidden>
      <Box className={classes.form}>
        {(standing.recent_form.split("") as StandingLetter[]).slice(-5).map((letter, i) => (
          <Standing key={i} extended>
            {letter}
          </Standing>
        ))}
      </Box>
      <Box className={classes.h2h}>
        {comparison.length > 1 && comparison.includes(standing.team_id) ? (
          <Tooltip
            disableFocusListener
            disableTouchListener
            placement="right"
            arrow
            title={
              <Typography
                component={NavLink}
                to={`/soccer/teams/h2h${createH2HUrlComponent(
                  standings.find((standing) => standing.team_id === comparison[0])!.team_name,
                  comparison[0],
                  standings.find((standing) => standing.team_id === comparison[1])!.team_name,
                  comparison[1]
                )}`}
                color="inherit"
              >
                {intl.get("teams.h2h.compare")}
              </Typography>
            }
          >
            <span>{checkbox}</span>
          </Tooltip>
        ) : (
          checkbox
        )}
      </Box>
    </ListItem>
  );
}

export default observer(StandingItem);
