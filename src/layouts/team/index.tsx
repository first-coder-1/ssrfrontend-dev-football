import React, { FC } from "react";
import { Team } from "@/api";
import DefaultHead from "@/components/DefaultHead/DefaultHead";
import { matchPath, slugify } from "@/utils";
import FavoriteSwitch from "@/components/FavoriteSwitch/FavoriteSwitch";
import { HeaderBox } from "@/components/HeaderBox/HeaderBox";
import NotifiableSwitch from "@/components/NotifiableSwitch/NotifiableSwitch";
import TabContainer from "@/components/TabContainer/TabContainer";
import TabbedHeader from "@/components/TabbedHeader/TabbedHeader";
import { SeasonTeamMenu } from "@/components/Team/SeasonTeamMenu";
import TeamImage from "@/components/TeamImage/TeamImage";
import NavLink from "@/components/shared/NavLink/NavLink";
import { team as teamUrls } from "../../sitemap";
import { useActiveTab } from "@/utils/getActiveTab";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import Tab from "@mui/material/Tab";
import { Box, Grid, Hidden } from "@mui/material";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import StageTables from "@/components/StageTables/StageTables";
import { StageTable } from "@/components/StageTables/StageTable";
import { TrophiesTable } from "@/components/Team/TrophiesTable";
import { ColumnAdvertisement } from "@/components/ColumnAdvertisement/ColumnAdvertisement";
import { TopTable } from "./TopTable";
import { useRouter } from "next/router";

type TTeamLayoutProps = {
  team: Team;
  children: React.ReactNode;
};

const useStyles = makeStyles()((theme) => ({
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

  tab: {
    minWidth: 120,
  },
}));

export const TeamLayout: FC<TTeamLayoutProps> = observer(({ team, children }) => {
  const intl = useIntl();
  const { classes } = useStyles();
  const { auth, favorites, settings } = useMst();
  const active = useActiveTab(teamUrls);
  const router = useRouter();
  const {
    query: { kind, id },
  } = router;

  return (
    <>
      {/* <DefaultHead params={{ name: slugify(team.name) }} /> */}
      <TabbedHeader
        header={
          <>
            <TeamImage
              url={team?.logo_path}
              name={(!settings.originalNames && team?.name_loc) || team?.name}
              variant="28x"
            />
            <HeaderBox item={team} />
            <FavoriteSwitch
              checked={favorites.teams.has(team._id)}
              onChange={(e) => {
                e.stopPropagation();
                if (favorites.teams.has(team._id)) {
                  favorites.removeFavoriteTeam(team._id);
                } else {
                  favorites.addFavoriteTeam(team._id);
                }
              }}
            />
            <NotifiableSwitch
              checked={favorites.notifiableTeams.has(team._id)}
              isLoggedIn={!!auth.user}
              onChange={(e) => {
                e.stopPropagation();
                if (favorites.notifiableTeams.has(team._id)) {
                  favorites.removeNotifiableTeam(team._id);
                } else {
                  favorites.addNotifiableTeam(team._id);
                }
              }}
            />
          </>
        }
        footer={
          <Box className={classes.mobileOnly}>
            <SeasonTeamMenu team={team} />
          </Box>
        }
        active={active}
      >
        <Tab
          label={intl.get(`teams.summary`)}
          value={0}
          component={NavLink}
          to={`/soccer/teams/${kind}/${id}/summary`}
          className={classes.tab}
        />
        <Tab
          label={intl.get(`teams.matches`)}
          value={1}
          component={NavLink}
          to={`/soccer/teams/${kind}/${id}/matches`}
          className={classes.tab}
        />
        {team.has_squads && (
          <Tab
            label={intl.get(`teams.squad`)}
            value={2}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/squad`}
            className={classes.tab}
          />
        )}
        {team.has_sidelined && (
          <Tab
            label={intl.get(`teams.sidelined`)}
            value={3}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/sidelined`}
            className={classes.tab}
          />
        )}
        {team.has_stats && (
          <Tab
            label={intl.get(`teams.stats`)}
            value={4}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/stats`}
            className={classes.tab}
          />
        )}
        {team.has_transfers && (
          <Tab
            label={intl.get(`teams.transfers`)}
            value={5}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/transfers`}
            className={classes.tab}
          />
        )}
        {team.has_trophies && (
          <Tab
            label={intl.get(`teams.trophies`)}
            value={6}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/trophies`}
            className={classes.tab}
          />
        )}
        {team.venue && (
          <Tab
            label={intl.get(`teams.venue`)}
            value={7}
            component={NavLink}
            to={`/soccer/teams/${kind}/${id}/venue`}
            className={classes.tab}
          />
        )}
        <TabContainer grow />
        <TabContainer className={classes.selectContainer} label={<SeasonTeamMenu team={team} />} />
      </TabbedHeader>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            {children}
          </Grid>
          <Grid item xs={12} md={3}>
            <Hidden lgDown>
              <StageTables stageId={team.current_stage_id}>
                {(standings, legend) => <StageTable teamId={team._id} standings={standings} legend={legend} />}
              </StageTables>
              {team.has_trophies && matchPath({ path: "/soccer/teams/:kind/:id/trophies" }, router.pathname) && (
                <TrophiesTable team={team} />
              )}
              <ColumnAdvertisement />
              {matchPath({ path: "/soccer/teams/:kind/:id/summary" }, router.pathname) && (
                <TopTable national={team.national_team} />
              )}
            </Hidden>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});
