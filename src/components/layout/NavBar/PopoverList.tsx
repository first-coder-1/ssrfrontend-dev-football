import React from "react";
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Asset from "@/components/Asset";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  root: {
    "&:not(:last-child)": {
      borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
  },

  item: {
    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
  },

  icon: {
    minWidth: theme.spacing(4),
    justifyContent: "center",
  },
}));

type Item = {
  id: number;
  url: string;
  title: string;
  asset: string;
};

type Props = {
  header: string;
  items: Item[];
  viewAllUrl: string;
  onClick?: () => void;
};

export function PopoverList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  return (
    <Grid item md className={classes.root}>
      <List disablePadding>
        <ListSubheader>
          <Typography variant="subtitle1">{props.header}</Typography>
        </ListSubheader>
        {props.items.map((item) => (
          <ListItem
            key={item.id}
            button
            //@TODO: remind about prop component={LinkRouter}
            component={NavLink}
            to={item.url}
            onClick={props.onClick}
            className={classes.item}
          >
            <ListItemIcon className={classes.icon}>
              <Asset src={item.asset} alt={item.title} variant="16x16" />
            </ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </ListItem>
        ))}
        <ListItem>
          <ListItemText>
            <Link
              //@TODO: remind about prop component={LinkRouter}
              to={props.viewAllUrl}
              onClick={props.onClick}
              component={NavLink}
            >
              {intl.get("view-all")}
            </Link>
          </ListItemText>
        </ListItem>
      </List>
    </Grid>
  );
}
