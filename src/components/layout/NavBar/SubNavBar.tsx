import React from "react";
// import { useParams } from 'react-router';
import { makeStyles } from "tss-react/mui";
import Toolbar from "@mui/material/Toolbar";
import SoccerIcon from "@/components/icons/SoccerIcon";
import NavItem from "./NavItem/NavItem";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    boxShadow: "inset 0px -1px 0px rgba(79, 79, 79, 0.08)",
  },

  button: {
    width: theme.spacing(6),
    padding: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  switch: {
    marginRight: theme.spacing(6),
  },
}));

export function SubNavBar(): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  return (
    <Toolbar disableGutters className={classes.root} variant="dense">
      <div className={classes.button} />
      <NavItem to={`/`} forcedActive icon={<SoccerIcon fontSize="inherit" color="inherit" viewBox="0 0 16 16" />}>
        {intl.get("navbar.soccer")}
      </NavItem>
    </Toolbar>
  );
}

export default SubNavBar;
