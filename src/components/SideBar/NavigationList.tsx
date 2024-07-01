import React from "react";

import { makeStyles } from "tss-react/mui";
import Hidden from "@/components/Hidden/Hidden";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
// import { useParams } from "react-router";
import { Arrow } from "./Arrow";
import { useMst } from "../../store";
import NavLink from "../shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { observer } from "mobx-react-lite";

const useStyles = makeStyles()((theme) => ({
  item: {
    paddingLeft: theme.spacing(1.5),
    height: theme.spacing(5.5),
    "&.active .MuiTypography-root": {
      color: theme.palette.primary.main,
    },
  },
}));

type Props = {
  onClick: () => void;
};

export function NavigationList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { auth } = useMst();
  const { onClick } = props;
  return (
    <Hidden mdUp>
      <ListItem divider button className={classes.item} component={NavLink} to={`/fixtures`} onClick={onClick}>
        <ListItemText primary={<Typography variant="subtitle1">{intl.get("navbar.fixtures")}</Typography>} />
        <ListItemSecondaryAction>
          <Arrow />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem
        divider
        button
        className={classes.item}
        component={NavLink}
        to={`/soccer/leagues/domestic`}
        onClick={onClick}
      >
        <ListItemText primary={<Typography variant="subtitle1">{intl.get("navbar.competitions")}</Typography>} />
        <ListItemSecondaryAction>
          <Arrow />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem
        divider
        button
        className={classes.item}
        component={NavLink}
        to={`/soccer/teams/domestic`}
        onClick={onClick}
      >
        <ListItemText primary={<Typography variant="subtitle1">{intl.get("navbar.teams")}</Typography>} />
        <ListItemSecondaryAction>
          <Arrow />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem divider button className={classes.item} component={NavLink} to={`/soccer/players`} onClick={onClick}>
        <ListItemText primary={<Typography variant="subtitle1">{intl.get("navbar.players")}</Typography>} />
        <ListItemSecondaryAction>
          <Arrow />
        </ListItemSecondaryAction>
      </ListItem>
      {auth.user && (
        <ListItem divider button className={classes.item} component={NavLink} to={`/referrals`} onClick={onClick}>
          <ListItemText primary={<Typography variant="subtitle1">{intl.get("navbar.referrals")}</Typography>} />
          <ListItemSecondaryAction>
            <Arrow />
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </Hidden>
  );
}

export default observer(NavigationList);
