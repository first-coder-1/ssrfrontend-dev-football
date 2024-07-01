import React, { useState } from "react";

// import { useParams } from 'react-router';
// import { NavLink } from 'react-router-dom';
import NavLink from "@/components/shared/NavLink/NavLink";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import ChevronUpIcon from "@/components/icons/ChevronUpIcon";
import { CountryLeagues } from "@/api";
import Flag from "@/components/Flag";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(6),
  },

  subItem: {
    backgroundColor: theme.palette.grey[300],
    padding: 0,
  },

  icon: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.main,
    marginLeft: theme.spacing(2.5),
  },

  text: {
    maxWidth: "50%",
  },

  season: {
    width: "25%",
  },

  name: {
    width: "100%",
    borderLeft: `1px solid rgba(0, 0, 0, 0.12)`,
    paddingLeft: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      paddingLeft: theme.spacing(1.5),
    },
  },
}));

type Props = {
  country: CountryLeagues;
};

export function LeagueItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { country } = props;
  const { settings } = useMst();
  const [open, setOpen] = useState(false);
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
          {country.leagues.map((league) => (
            <ListItem key={league._id} divider className={cx(classes.root, classes.subItem)}>
              <ListItemIcon>
                <div className={classes.icon} />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography component={NavLink} to={`/soccer/leagues/${slugify(league.name)}/${league._id}/summary`}>
                    {(!settings.originalNames && league.name_loc) || league.name}
                  </Typography>
                }
                className={classes.text}
              />
              {league.season_name && (
                <ListItemSecondaryAction className={classes.season}>
                  <Typography className={classes.name}>{league.season_name}</Typography>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default observer(LeagueItem);
