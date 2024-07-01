import React, { useMemo, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ChevronDownIcon from "../../../components/icons/ChevronDownIcon";
import ChevronUpIcon from "../../../components/icons/ChevronUpIcon";
import TeamSubItem, { TeamEntry } from "./TeamSubItem";
import { CountryTeams } from "../../../api";
import Flag from "../../../components/Flag";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(6),
  },
}));

type Props = {
  country: CountryTeams;
};

export function TeamItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { country } = props;
  const { settings } = useMst();
  const [open, setOpen] = useState(false);
  const leagues = useMemo(() => {
    return country.teams.reduce((map, team) => {
      const leagueName = (!settings.originalNames && team.league_name_loc) || team.league_name;
      if (map.has(leagueName)) {
        map.get(leagueName)!.push({ _id: team._id, name: team.name, name_loc: team.name_loc });
      } else {
        map.set(leagueName, [{ _id: team._id, name: team.name, name_loc: team.name_loc }]);
      }
      return map;
    }, new Map<string | undefined, TeamEntry[]>());
  }, [country, settings]);
  return (
    <>
      <ListItem divider button onClick={() => setOpen(!open)} className={classes.root}>
        <ListItemIcon>
          <Flag country={country.country_iso2 || "GB"} />
        </ListItemIcon>
        <ListItemText primary={intl.get(country.country_iso2 ? `countries.${country.country_iso2}` : "teams.other")} />
        <ListItemSecondaryAction onClick={() => setOpen(!open)}>
          {open ? <ChevronUpIcon color="action" /> : <ChevronDownIcon color="action" />}
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} unmountOnExit>
        <List disablePadding>
          {Array.from(leagues.entries()).map(([league_name, teams]) => (
            <TeamSubItem key={league_name || "other"} league_name={league_name} teams={teams} />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default observer(TeamItem);
