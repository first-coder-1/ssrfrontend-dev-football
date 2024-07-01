import React, { useEffect, useState } from "react";
// import intl from "react-intl-universal";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { getLeagueStats, League, LeagueSeason, LeagueStats } from "../../../api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme) => ({
  root: theme.scrollbar as {},
  content: {
    position: "relative",
    "&::after": {
      [theme.breakpoints.up("md")]: {
        position: "absolute",
        content: '""',
        left: "0px",
        bottom: "0px",
        height: theme.spacing(4),
        width: "100%",
        background: `linear-gradient(transparent, ${
          theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[200]
        })`,
        pointerEvents: "none",
      },
    },
  },
  item: {
    paddingBottom: 0,
  },

  action: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

type Props = {
  league: League;
  season?: LeagueSeason;
  leagueStats: LeagueStats;
};

export function AboutLeague(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { locale } = useRouter();
  const { classes } = useStyles();
  const { league, season, leagueStats } = props;
  const countryName = league.country_iso2 ? `${intl.get(`countries.${league.country_iso2}`)}` : ``;
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const [stats, setStats] = useState<LeagueStats | undefined>(leagueStats);

  useEffect(() => {
    const [promise, cancel] = getLeagueStats(league._id);
    promise.then(
      (res) => setStats(res.data),
      () => setStats(undefined)
    );
    return cancel;
  }, [league._id]);

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={intl.get("league-about.about", { leagueName: league.name_loc || league.name })}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", height: 240, overflow: "auto" }} className={classes.root}>
            <>
              <Box sx={{ p: 2 }}>
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: "1 0 auto",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      {league.is_cup ? (
                        <>
                          {intl.get("league-about.main-cup", {
                            leagueName: league.name_loc || league.name,
                            countryName: countryName,
                          })}
                          <br />
                          <br />
                          {intl.get("league-about.second-cup", { leagueName: league.name_loc || league.name })}
                          <br />
                          <br />
                          {intl.get("league-about.matches-cup")}
                          <br />
                          <br />
                          {intl.get("league-about.matches-live-cup")}
                          <br />
                          <br />
                          {intl.get("league-about.draw-cup")}
                          <br />
                          <br />
                        </>
                      ) : (
                        <>
                          {intl.get("league-about.main", {
                            leagueName: league.name_loc || league.name,
                            countryName: countryName,
                          })}
                          <br />
                          <br />
                          {intl.get("league-about.second", { leagueName: league.name_loc || league.name })}
                          <br />
                          <br />
                          {intl.get("league-about.matches")}
                          <br />
                          <br />
                          {intl.get("league-about.matches-live")}
                          <br />
                          <br />
                        </>
                      )}
                    </Box>

                    {showMore && (
                      <Box display="flex" justifyContent="flex-end">
                        {league.facts && (
                          <>
                            {league.facts.split("\n").map((str) => (
                              <>
                                {str}
                                <br />
                              </>
                            ))}{" "}
                            <br />
                            <br />
                          </>
                        )}
                        {season && season.has_standings && (
                          <>
                            {intl.get("league-about.standings")}
                            <br />
                            <br />
                          </>
                        )}
                        {season && (season.has_topscorers || season.has_assistscorers || season.has_cardscorers) && (
                          <>
                            {intl.get("league-about.players", { leagueName: league.name_loc || league.name })}
                            <br />
                            <br />
                          </>
                        )}
                        {league.has_sidelined && !league.is_cup && (
                          <>
                            {intl.get("league-about.sidelined", { leagueName: league.name_loc || league.name })}
                            <br />
                            <br />
                          </>
                        )}
                        {league.has_transfers && !league.is_cup && (
                          <>
                            {intl.get("league-about.transfers", { leagueName: league.name_loc || league.name })}
                            <br />
                            <br />
                          </>
                        )}
                        {league.has_trophies && !league.is_cup && (
                          <>
                            {intl.get("league-about.trophies")}
                            <br />
                            <br />
                          </>
                        )}
                        <>
                          {intl.get("league-about.last", { leagueName: league.name_loc || league.name })}
                          <br />
                          <br />
                        </>
                      </Box>
                    )}
                    <Box display="flex" justifyContent="flex-end">
                      <Button color="primary" onClick={handleShowMore}>
                        {showMore ? intl.get("team-about.show-less") : intl.get("team-about.show-more")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
