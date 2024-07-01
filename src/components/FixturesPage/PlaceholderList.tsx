import React, { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: 64,
  },

  content: {
    display: "flex",
    justifyContent: "space-between",
  },

  end: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  endWidth: string;
  length?: number;
};

export function PlaceholderList(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { endWidth, length } = props;
  const array = useMemo(() => [...Array(length ?? 10).keys()].map(() => Math.random() * 10), [length]);
  return (
    <List disablePadding>
      {array.map((val) => (
        <ListItem key={`skeleton_${val}`} divider className={classes.root}>
          <ListItemText>
            <div className={classes.content}>
              <Skeleton width={`${val + 50}%`} height="30px" animation="wave" />
              <Skeleton width={endWidth} height="30px" animation="wave" className={classes.end} />
            </div>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
