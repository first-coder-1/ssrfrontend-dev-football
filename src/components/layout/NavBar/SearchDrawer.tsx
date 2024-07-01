import React from "react";
import { makeStyles } from "tss-react/mui";
import Hidden from "@/components/Hidden/Hidden";
import Drawer from "@mui/material/Drawer";
import SearchBox from "./SearchBox";

const useStyles = makeStyles()(() => ({
  drawer: {
    height: 50,
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}
export default function SearchDrawer({ visible, onClose }: IProps) {
  const { classes } = useStyles();

  return (
    <>
      <Hidden mdUp>
        <Drawer anchor="top" open={visible} onClose={onClose} classes={{ paper: classes.drawer }}>
          <SearchBox onClose={onClose} />
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <SearchBox onClose={onClose} />
      </Hidden>
    </>
  );
}
