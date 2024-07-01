import React from "react";

// import { Link as RouterLink } from 'react-router-dom';
import { NavLink } from "../shared/NavLink/NavLink";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { slugify } from "../../utils";

const useStyles = makeStyles()((theme) => ({
  root: {
    flex: 1,
    "&:first-of-type": {
      textAlign: "right",
    },
  },

  medium: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

type Props = {
  id: number;
  name: string;
  winner?: boolean;
};

export function TeamLink(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes, cx } = useStyles();
  const { id, name, winner, children } = props;

  const className = cx(classes.root, { [classes.medium]: winner });
  const teamLink = `/soccer/teams/${slugify(name)}/${id}/summary`;
  return (
    <Typography
      className={className}
      component={NavLink}
      to={teamLink}
      sx={winner ? { fontWeight: (theme) => theme.typography.fontWeightMedium } : {}}
    >
      {children}
    </Typography>
  );
}

export default TeamLink;
