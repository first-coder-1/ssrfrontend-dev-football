import React from "react";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import Typography from "@mui/material/Typography";
import TabContainer from "@/components/TabContainer";
import TabbedHeader from "@/components/TabbedHeader";
// import SearchForm from "@/components/SearchForm";
import { useActiveTab } from "@/utils/getActiveTab";
import sitemap, { players, players as playersUrls } from "@/sitemap";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/router";
import MostExpensiveTransfers from "./MostExpensiveTransfers";
import { SearchForm } from "@/components/SearchForm/SearchForm";
import AboutPlayers from "@/components/PlayersPage/AboutPlayers";

const useStyles = makeStyles()((theme) => ({
  tab: {
    minWidth: theme.spacing(16),
  },
}));

export function PlayersPageLayout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles();
  // const active = useActiveTab(playersUrls);
  const navigate = useNavigate();
  const intl = useIntl();
  const { pathname } = useRouter();
  const tabName = pathname.slice(pathname.lastIndexOf("/") + 1);
  const activeTabProp = { [tabName]: true };

  const active = useActiveTab(players);

  const form = (
    <SearchForm
      query=""
      onSubmit={(model) => navigate(`../search/players/${encodeURIComponent(model.query)}`)}
      title={intl.get("search.players-form-title")}
      placeholder={intl.get("search.players-query-label")}
      full
    />
  );
  return (
    <>
      <TabbedHeader header={<Typography variant="h1">{intl.get("players.list")}</Typography>} active={active}>
        <Tab
          label={intl.get(`players.topscorers`)}
          value={0}
          component={NavLink}
          to="topscorers"
          className={classes.tab}
        />
        <Tab
          label={intl.get(`players.disciplinary`)}
          value={1}
          component={NavLink}
          to="cardscorers"
          className={classes.tab}
        />
        <Tab
          label={intl.get(`players.born-today`)}
          value={2}
          component={NavLink}
          to="born-today"
          className={classes.tab}
        />
        <Tab label={intl.get(`players.abroad`)} value={3} component={NavLink} to="abroad" className={classes.tab} />
        <TabContainer grow />
      </TabbedHeader>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            {children}
          </Grid>
          <Grid item xs={12} lg={3}>
            {form}
            <Hidden lgUp>
              <AboutPlayers {...activeTabProp} />
            </Hidden>
            <MostExpensiveTransfers />
          </Grid>
          <Grid item xs={12} lg={9}>
            <Hidden lgDown>
              <AboutPlayers {...activeTabProp} />
            </Hidden>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
