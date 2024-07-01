import React, { FC, ReactNode } from "react";
// import { useParams } from "react-router";
// import { NavLink, Navigate, Route, Routes } from "react-router-dom";
// import intl from "react-intl-universal";
import { observer } from "mobx-react-lite";
import { AxiosError } from "axios";
import { endOfTomorrow, startOfYesterday } from "date-fns";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import Alert from "@mui/material/Alert";
import TabbedHeader from "../../components/TabbedHeader";
import TabContainer from "../../components/TabContainer";
import { getFixture, Fixture, PartialLivescore } from "../../api";
import { useActiveTab } from "@/utils/getActiveTab";
import { match as matchUrls } from "../../sitemap";
import Summary from "@/components/Match/Summary";
import { isFinished, isLive, isPenalty, slugify } from "../../utils";
import { dateTz } from "../../utils/dateTz";
import StageTables, { StageTable } from "../../components/StageTables";
import Venue from "../../components/Venue";
import Odds from "@/components/Match/Odds";
import Stats from "@/components/Match/Stats";
import Videos from "@/components/Match/Videos";
import FixtureSelect from "@/components/Match/Summary/FixtureSelect";
import PlaceholderPage from "../../components/PlaceholderPage";
import { createH2HUrlComponent } from "../../utils/h2h";
import PlaceholderList from "../../components/PlaceholderList";
import DefaultHead from "../../components/DefaultHead";
import NotifiableSwitch from "../../components/NotifiableSwitch";
import { useMst } from "../../store";
import { Context } from "../../locales/LocaleProvider";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";
import Head from "next/head";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme: Theme) => ({
  header: {
    ...theme.textOverflow,
  },

  empty: {
    flex: "1 0 auto",
    minWidth: "auto",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  selectContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  mobileOnly: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  desktopOnly: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const dateFormat = "PPPP";

const start = Math.round(startOfYesterday().getTime() / 1000);
const end = Math.round(endOfTomorrow().getTime() / 1000);

type TMatchLayout = {
  children: ReactNode;
  fixture: Fixture | undefined | null;
};

export const MatchLayout: FC<TMatchLayout> = ({ children, fixture }) => {
  const { settings, favorites, auth } = useMst();
  const intl = useIntl();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const active = useActiveTab(matchUrls);

  const {
    query: { leftTeam, rightTeam, matchId },
  } = useRouter();

  if (fixture === null) {
    navigate("/404");
    return null;
  }

  if (fixture === undefined) {
    return null;
  }

  const checked = favorites.fixtures.has(fixture._id);
  const fixtureSelect = <FixtureSelect stageId={fixture.stage_id} fixtureId={fixture._id} />;
  const linkWithQuery = `/soccer/fixtures/${leftTeam}/${rightTeam}/${matchId}/`;

  return (
    <>
      {/* <DefaultHead
        params={{ localTeam: slugify(fixture.localteam.name), visitorTeam: slugify(fixture.visitorteam.name) }}
      /> */}

      <TabbedHeader
        header={
          <>
            <Typography variant="h1" className={classes.header}>
              {`${(!settings.originalNames && fixture.localteam.name_loc) || fixture.localteam.name} - ${
                (!settings.originalNames && fixture.visitorteam.name_loc) || fixture.visitorteam.name
              }`}
              {(isFinished(fixture.time.status) || isPenalty(fixture.time.status) || isLive(fixture.time.status)) &&
                ` (${fixture.scores.localteam_score} - ${fixture.scores.visitorteam_score})`}
            </Typography>
            <NotifiableSwitch
              checked={favorites.notifiableFixtures.has(fixture._id)}
              disabled={!checked && (fixture.time.starting_at < start || fixture.time.starting_at > end)}
              isLoggedIn={!!auth.user}
              onChange={(e) => {
                e.stopPropagation();
                if (favorites.notifiableFixtures.has(fixture._id)) {
                  favorites.removeNotifiableFixtures(fixture._id);
                } else {
                  favorites.addNotifiableFixtures(fixture._id);
                }
              }}
            />
          </>
        }
        footer={<Hidden mdUp>{fixtureSelect}</Hidden>}
        active={active}
      >
        <Tab label={intl.get(`match.summary`)} value={0} component={NavLink} to={linkWithQuery + "summary"} />
        <Tab
          label={intl.get(`teams.h2h.label`)}
          value={5}
          component={NavLink}
          to={`/soccer/teams/h2h${createH2HUrlComponent(
            fixture.localteam.name,
            fixture.localteam._id,
            fixture.visitorteam.name,
            fixture.visitorteam._id
          )}`}
        />
        {(fixture.has_stats || fixture.has_comments) && (
          <Tab label={intl.get(`match.stats`)} value={1} component={NavLink} to={linkWithQuery + "stats"} />
        )}
        {fixture.has_video && (
          <Tab label={intl.get(`match.videos`)} value={2} component={NavLink} to={linkWithQuery + "videos"} />
        )}
        {fixture.has_odds && settings.openOdds && (
          <Tab label={intl.get(`match.odds`)} value={4} component={NavLink} to={linkWithQuery + "odds"} />
        )}
        {fixture.venue && (
          <Tab label={intl.get(`match.venue`)} value={3} component={NavLink} to={linkWithQuery + "venue"} />
        )}
        <TabContainer grow />
        <TabContainer className={classes.selectContainer} label={fixtureSelect} />
      </TabbedHeader>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            {children}
          </Grid>
          <Grid item xs={12} md={3}>
            <Hidden lgDown>
              <StageTables
                stageId={
                  fixture.league?.is_cup && fixture.league.group_stage_id
                    ? fixture.league.group_stage_id
                    : fixture.stage_id
                }
              >
                {(standings, legend) =>
                  [fixture.localteam._id, fixture.visitorteam._id].map((teamId) => (
                    <StageTable
                      key={teamId}
                      teamId={teamId}
                      standings={standings}
                      legend={legend}
                      groupId={fixture.group.id}
                    />
                  ))
                }
              </StageTables>
            </Hidden>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
