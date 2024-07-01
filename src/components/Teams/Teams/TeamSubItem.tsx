import React, { useState } from "react";

// import { Link as RouterLink } from 'react-router-dom';

import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ChevronDownIcon from "../../../components/icons/ChevronDownIcon";
import ChevronUpIcon from "../../../components/icons/ChevronUpIcon";
import { slugify } from "../../../utils";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles<void, "name">()((theme, _params, classes) => ({
  root: {
    height: theme.spacing(6),
  },
  item: {
    backgroundColor: theme.palette.grey[300],
    padding: 0,
  },
  icon: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.main,
    marginLeft: theme.spacing(1),
  },
  team: {
    height: theme.spacing(6),
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(3),
    borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
    [`&:nth-of-type(4n) .${classes.name}`]: {
      borderRight: "none",
    },
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
      [`&:nth-of-type(2n) .${classes.name}`]: {
        borderRight: "none",
      },
    },
  },
  name: {
    width: "100%",
    borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
  },
}));

export type TeamEntry = { _id: number; name: string; name_loc?: string } | undefined;

type Props = {
  league_name: string | undefined;
  teams: TeamEntry[];
};

function arrayPad(arr: TeamEntry[], len: number, fill: string) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
}

export function TeamSubItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { league_name, teams } = props;
  const { settings } = useMst();

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const divider = isMobile ? 2 : 4;
  const length = Math.ceil(teams.length / divider) * divider;
  return (
    <>
      <ListItem divider button onClick={() => setOpen(!open)} className={cx(classes.root, classes.item)}>
        <ListItemIcon>
          <div className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary={league_name || intl.get("teams.other")} />
        <ListItemSecondaryAction onClick={() => setOpen(!open)}>
          {open ? <ChevronUpIcon color="action" /> : <ChevronDownIcon color="action" />}
        </ListItemSecondaryAction>
      </ListItem>
      {open && (
        <ListItem disableGutters className={classes.item}>
          <Grid container>
            {arrayPad(teams, length, "").map((team, i) => (
              <Grid key={team?._id || i} item xs={6} md={3} className={classes.team}>
                {team && (
                  <Typography
                    className={classes.name}
                    component={NavLink}
                    to={`/soccer/teams/${slugify(team.name)}/${team._id}/summary`}
                  >
                    {(!settings.originalNames && team.name_loc) || team.name}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </ListItem>
      )}
    </>
  );
}

export default observer(TeamSubItem);
