import React from "react";
// import { useParams } from "react-router";
// import {NavLink} from 'react-router-dom';
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { fixtures as fixturesUrls } from "../../sitemap";
import TabContainer from "../../components/TabContainer";
import { useActiveTab } from "@/utils/getActiveTab";
import { DatePicker } from "./DatePicker";
import { FavoritesCounter } from "./FavoritesCounter";
import { useMst } from "../../store";
import NavLink from "../shared/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme) => ({
  datepickerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  datepicker: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: theme.spacing(22),
  },

  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    cursor: "pointer",
    "&:before, &:hover, &:after": {
      borderBottom: "0 !important",
    },
    "& > input": {
      textAlign: "center",
    },
  },
}));

export const Controls = observer(() => {
  const intl = useIntl();
  const { classes } = useStyles();
  // const { locale } = useParams();
  const { asPath } = useRouter();
  const { settings } = useMst();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const active = useActiveTab(fixturesUrls, asPath);

  return (
    <AppBar position="sticky" color="secondary" elevation={0}>
      <Tabs value={active} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
        <Tab label={intl.get(`fixtures.all${isMobile ? "-mobile" : ""}`)} component={NavLink} to={`/fixtures/all`} />
        <Tab label={intl.get(`fixtures.live${isMobile ? "-mobile" : ""}`)} component={NavLink} to={`/fixtures/live`} />
        <Tab label={<FavoritesCounter />} component={NavLink} to={`/fixtures/my`} />
        <Tab
          label={intl.get(`fixtures.finished${isMobile ? "-mobile" : ""}`)}
          component={NavLink}
          to={`/fixtures/fin`}
        />
        <Tab
          label={intl.get(`fixtures.scheduled${isMobile ? "-mobile" : ""}`)}
          component={NavLink}
          to={`/fixtures/sch`}
        />
        {settings.openOdds && (
          <Tab
            label={intl.get(`fixtures.odds${isMobile ? "-mobile" : ""}`)}
            component={NavLink}
            to={`/fixtures/odds`}
          />
        )}
        <TabContainer grow />
        <TabContainer className={classes.datepickerContainer} label={<DatePicker />} />
      </Tabs>
    </AppBar>
  );
});
