import React, { FC, ReactNode, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import TabbedHeader from "@/components/TabbedHeader";
import FavoriteSwitch from "@/components/FavoriteSwitch";
import { useMst } from "../../store";
import { slugify } from "../../utils";
import TabContainer from "@/components/TabContainer";
import {
  getActiveLeagueSeason,
  getActiveSeason,
  getLeague,
  getLeagueSeasons,
  League,
  LeagueSeason,
  LeagueStats,
  Standings,
  StandingsExtended,
} from "../../api";
import { league as leagueUrls } from "../../sitemap";
import { SeasonSelect } from "@/components/LeaguePage/SeasonSelect";
import { Stats } from "@/components/LeaguePage/Stats";
import StageTables, { StageTable } from "@/components/StageTables";
import PlaceholderPage from "@/components/PlaceholderPage";
import PlaceholderList from "@/components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";
import NotifiableSwitch from "@/components/NotifiableSwitch";
import { HeaderBox } from "@/components/HeaderBox/HeaderBox";
import LeagueImage from "@/components/LeagueImage";
import DefaultHead from "@/components/DefaultHead";
import { useRouter } from "next/router";
import { Hidden } from "@mui/material";
import { useActiveTab } from "@/utils/getActiveTab";
// import Hidden from "@/components/Hidden/Hidden";

export type TLeagueLayoutData = {
  league: League;
  seasons: LeagueSeason[];
  standings?: Standings;
  stats?: LeagueStats;
};

type TLeaguePageProps = {
  children: ReactNode;
  layoutData?: TLeagueLayoutData;
};

const useStyles = makeStyles()((theme) => ({
  mobileOnly: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  tab: {
    minWidth: 120,
  },
}));

export const LeaguePageLayout: FC<TLeaguePageProps> = observer(({ children, layoutData }) => {
  const intl = useIntl();
  const { classes } = useStyles();
  // const active = useActiveTab(leagueUrls, undefined, getActiveTab(leagueUrls));
  const active = useActiveTab(leagueUrls);
  const { auth, favorites, settings } = useMst();

  const {
    query: { type, id },
  } = useRouter();

  useEffect(() => {
    const leagueId = parseInt(id! as string, 10);
    const [getLeagueFetch, getLeagueCancel] = getLeague(leagueId);
    const [getLeagueSeasonsFetch, getLeagueSeasonsCancel] = getLeagueSeasons(leagueId);

    setLoading(true);

    Promise.all([getLeagueFetch, getLeagueSeasonsFetch])
      .then(([leagueResponse, seasonsResponse]) => {
        const leagueData = leagueResponse.data;
        const seasonsData = seasonsResponse.data;
        setLeague(leagueData);
        setSeasons(seasonsData);
        setActiveSeason(getActiveLeagueSeason(seasonsData, leagueData.current_season_id));
        setLoading(false);
      })
      .catch(() => {
        setLeague(null);
        setSeasons([]);
        setLoading(false);
      });

    return () => {
      getLeagueCancel();
      getLeagueSeasonsCancel();
    };
  }, [id]);

  const getPathWithSavedQuery = (newPath: string) => {
    return `/soccer/leagues/${type}/${id}/${newPath}`;
  };

  const activeLeagueSeason = layoutData
    ? getActiveLeagueSeason(layoutData.seasons, layoutData.league.current_season_id)
    : undefined;

  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState<LeagueSeason[]>(layoutData?.seasons || []);
  const [league, setLeague] = useState<League | undefined | null>(layoutData?.league || undefined);
  const [activeSeason, setActiveSeason] = useState<LeagueSeason | undefined>(activeLeagueSeason);

  if (loading) {
    return <PlaceholderPage tabFooter={<PlaceholderList size={36} length={1} className={classes.mobileOnly} />} />;
  }

  if (!league) {
    return <>{children}</>;
  }

  //   const leagueTitleData = {
  //     name: (!settings.originalNames && league.name_loc) || league.name,
  //     country: league.country_iso2 ? `(${intl.get(`countries.${league.country_iso2}`)}) ` : ``,
  //   };

  return (
    <>
      {/* <DefaultHead params={{ name: slugify(league.name) }} /> */}
      <TabbedHeader
        header={
          <>
            <LeagueImage
              url={league?.logo_path}
              name={(!settings.originalNames && league?.name_loc) || league?.name}
              variant="28x"
            />
            <HeaderBox item={league} />
            <FavoriteSwitch
              checked={favorites.leagues.has(league._id)}
              onChange={(e) => {
                e.stopPropagation();
                if (favorites.leagues.has(league._id)) {
                  favorites.removeFavoriteLeague(league._id);
                } else {
                  favorites.addFavoriteLeague(league._id);
                }
              }}
            />
            <NotifiableSwitch
              checked={favorites.notifiableLeagues.has(league._id)}
              isLoggedIn={!!auth.user}
              onChange={(e) => {
                e.stopPropagation();
                if (favorites.notifiableLeagues.has(league._id)) {
                  favorites.removeNotifiableLeague(league._id);
                } else {
                  favorites.addNotifiableLeague(league._id);
                }
              }}
            />
          </>
        }
        footer={
          <Box className={classes.mobileOnly}>
            <SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} />
          </Box>
        }
        active={active}
      >
        <Tab
          label={intl.get(`leagues.summary`)}
          value={0}
          component={NavLink}
          to={getPathWithSavedQuery("summary")}
          className={classes.tab}
        />
        <Tab
          label={intl.get(`leagues.matches`)}
          value={1}
          component={NavLink}
          to={getPathWithSavedQuery("matches")}
          className={classes.tab}
        />
        {activeSeason && activeSeason.has_standings && (
          <Tab
            label={intl.get(`leagues.tables`)}
            value={2}
            component={NavLink}
            to={getPathWithSavedQuery("tables")}
            className={classes.tab}
          />
        )}
        {activeSeason &&
          (activeSeason.has_topscorers || activeSeason.has_assistscorers || activeSeason.has_cardscorers) && (
            <Tab
              label={intl.get(`leagues.players`)}
              value={3}
              component={NavLink}
              to={getPathWithSavedQuery("players")}
              className={classes.tab}
            />
          )}
        {league.has_transfers && !league.is_cup && (
          <Tab
            label={intl.get(`leagues.transfers`)}
            value={4}
            component={NavLink}
            to={getPathWithSavedQuery("transfers")}
            className={classes.tab}
          />
        )}
        {league.has_sidelined && (
          <Tab
            label={intl.get(`leagues.sidelined`)}
            value={5}
            component={NavLink}
            to={getPathWithSavedQuery("sidelined")}
            className={classes.tab}
          />
        )}
        {league.has_trophies && !league.is_cup && (
          <Tab
            label={intl.get(`leagues.trophies`)}
            value={6}
            component={NavLink}
            to={getPathWithSavedQuery("trophies")}
            className={classes.tab}
          />
        )}
        {league.has_venues && !league.is_cup && (
          <Tab
            label={intl.get(`leagues.venues`)}
            value={7}
            component={NavLink}
            to={getPathWithSavedQuery("venues")}
            className={classes.tab}
          />
        )}
        <TabContainer grow />
        <TabContainer
          label={<SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} />}
        />
      </TabbedHeader>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ mt: 4 }}>{children}</Box>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Hidden implementation="css" only={["sm", "md"]}>
            <StageTables stageId={activeSeason?.stage_id} standings={layoutData?.standings}>
              {(standings, legend) => (
                <Box sx={{ mt: { xs: 0, md: 4 } }}>
                  <StageTable standings={standings} legend={legend} count={10} />
                </Box>
              )}
            </StageTables>
          </Hidden>
          <Hidden implementation="css" lgDown>
            <Box sx={{ mt: 4 }}>
              <Stats initialStats={layoutData?.stats!} league={league} />
            </Box>
          </Hidden>
        </Grid>
      </Grid>
    </>
  );
});
