import { BottomAdvertisement } from "@/components/BottomAdvertisement/BottomAdvertisement";
import { DfpProvider } from "@/components/DfpProvider/DfpProvider";
import Footer from "@/components/Footer/Footer";
import Hidden from "@/components/Hidden/Hidden";
import { RightAdvertisement } from "@/components/RightAdvertisement/RightAdvertisement";
import { SideBar } from "@/components/SideBar/SideBar";
import NavBar from "@/components/layout/NavBar";
import { useCurrentBreakpoint } from "@/hooks/useCurrentBreakpoint";
import { useDelayedInit } from "@/hooks/useDelayedInit";
import { useMst } from "@/store";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import SubNavBar from "../NavBar/SubNavBar";
import { Panel } from "./Panel";

// import NavBar from "../NavBar";
// import SubNavBar from "../NavBar/SubNavBar";
// import RightAdvertisement from "../RightAdvertisement";
// import BottomAdvertisement from "../BottomAdvertisement";
// import { Panel } from "./Panel";
// import LazyTopBar from "../TopBar";
// import PlaceholderPage from "../PlaceholderPage";
// import DfpProvider from "../DfpProvider";

const useStyles = makeStyles()((theme) => ({
  boxContainer: {
    minHeight: `calc(100% - ${theme.spacing(16)})`,
    display: "flex",
    alignItems: "stretch",
    flexWrap: "nowrap",
  },

  box: {
    display: "flex",
    flexDirection: "column",
    minHeight: `calc(100% - ${theme.spacing(6)})`,
  },

  sidebar: {
    width: theme.spacing(6),
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("md")]: {
      width: 0,
    },
  },

  content: {
    width: `calc(100% - ${theme.spacing(6)})`,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },

  container: {
    display: "flex",
    flex: "1 0 auto",
  },

  containerContent: {
    flex: `1 0 calc(100% - ${theme.spacing(23)})`,
    width: `calc(100% - ${theme.spacing(23)})`,
  },

  containerBottom: {
    flex: `0 0 ${theme.spacing(20)}`,
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(4),
  },
}));

function Layout(props: { children: React.ReactNode }): React.ReactElement {
  //
  // const location = useLocation();
  const { pathname } = useRouter();
  const { classes } = useStyles();
  const {
    settings: { changeWindowSize },
  } = useMst();

  const [show, setShow] = useState(false);

  const showAd = useMemo(() => !pathname.startsWith(`/pages/`), [pathname]);

  function unhandledrejectionHandler(error: PromiseRejectionEvent) {
    if (error.reason.toString() === "Cancel") {
      if (process.env.NODE_ENV === "development") {
        console.info("Promise was cancelled.");
      }
      error.preventDefault();
    }
    if (error.reason.toString().includes("Request failed with status code 404")) {
      if (process.env.NODE_ENV === "development") {
        console.info(error.reason.toString());
      }
      error.preventDefault();
    }
  }

  useEffect(() => {
    window.addEventListener("unhandledrejection", unhandledrejectionHandler);
    return () => {
      window.removeEventListener("unhandledrejection", unhandledrejectionHandler);
    };
  }, []);

  const bp = useCurrentBreakpoint();

  useEffect(() => {
    changeWindowSize(bp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bp]);

  useDelayedInit();

  return (
    <>
      {/* <LazyTopBar /> */}
      <AppBar color="secondary" elevation={0} position="relative">
        <NavBar />
      </AppBar>
      <div className={classes.boxContainer}>
        <div className={classes.sidebar}>
          <SideBar setShow={setShow} show={show} />
        </div>
        <div className={classes.content}>
          <AppBar color="secondary" elevation={0} position="relative">
            <SubNavBar />
          </AppBar>
          <div className={classes.box}>
            <Container maxWidth="xl" className={classes.container}>
              <DfpProvider>
                <div className={classes.containerContent}>
                  <Panel />
                  {props.children}
                  {showAd && <BottomAdvertisement />}
                </div>

                {showAd && (
                  <Hidden lgDown>
                    <div className={classes.containerBottom}>
                      <RightAdvertisement />
                    </div>
                  </Hidden>
                )}
              </DfpProvider>
            </Container>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
