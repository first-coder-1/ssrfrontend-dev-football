import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "../icons/MenuIcon";
import SideBarLoader from "./SideBarLoader";
import SideBar from "./SideBar";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "sticky",
    top: 0,
    left: "auto",
    right: 0,
    overflowX: "hidden",
    zIndex: theme.zIndex.appBar + 1,
    width: theme.spacing(6),
    padding: theme.spacing(1.5),
  },
}));

export function LazySideBar() {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [show, setShow] = useState(false);
  const toggleShow = useCallback(() => {
    setShow((val) => !val);
  }, []);

  const isRendered = useRef(!isMobile);

  useEffect(() => {
    if (show) {
      isRendered.current = true;
    }
  }, [show]);

  if (isRendered.current || show) {
    return (
      <Suspense fallback={<SideBarLoader />}>
        <SideBar show={show} setShow={setShow} />
      </Suspense>
    );
  }

  return (
    <IconButton onClick={toggleShow} className={classes.root}>
      <MenuIcon color="secondary" />
    </IconButton>
  );
}

export default LazySideBar;
