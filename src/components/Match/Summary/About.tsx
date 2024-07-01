import React, { useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Fixture } from "../../../api";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import { dateTz, format, utcToZonedTime } from "../../../utils/dateTz";
import { isFinished } from "../../../utils";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles<{ image?: string }>()((theme, { image }) => {
  const textShadow = image ? `${theme.palette.grey[900]} 1px 0 2px` : "none";
  return {
    root: theme.scrollbar as {},
    status: {
      color: image
        ? theme.palette.primary.contrastText
        : theme.palette.mode === "dark"
        ? theme.palette.grey[200]
        : theme.palette.grey[600],
      textShadow,
    },
    time: {
      color: theme.palette.success.main,
      position: "absolute",
      paddingLeft: theme.spacing(1),
    },
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

    action: {
      display: "flex",
    },

    selects: {
      [theme.breakpoints.down("md")]: {
        height: theme.spacing(4),
        width: "100%",
      },
    },
  };
});

type Props = {
  fixture: Fixture;
};

export function About(props: Props): React.ReactElement {
  const intl = useIntl();
  const { fixture } = props;
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const venueName = fixture.venue?.name ? fixture.venue?.name : "Stadium (~)";
  const { settings } = useMst();
  const { classes } = useStyles({});
  return (
    <Card>
      <CardHeader
        title={intl.get("match-about.about")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", height: 240, overflow: "auto" }} className={classes.root}>
            {!!fixture && (
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
                        {isFinished(fixture.time.status) && fixture.league && (
                          <>
                            {intl.get("match-about.finished", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                              leagueName: fixture.league.name_loc || fixture.league.name || "~",
                              time: format(
                                utcToZonedTime(fixture.time.starting_at * 1000, "UTC"),
                                settings.timeFormat ?? settings.timeFormat,
                                { timeZone: "UTC" }
                              ),
                              date: dateTz(fixture.time.starting_at, "UTC"),
                              localTeamScore: fixture.scores.localteam_score,
                              visitorTeamScore: fixture.scores.visitorteam_score,
                              venue: venueName,
                            })}
                            <br />
                            <br />
                          </>
                        )}
                        {!isFinished(fixture.time.status) && fixture.league && (
                          <>
                            {intl.get("match-about.other", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                              leagueName: fixture.league.name_loc || fixture.league.name || "~",
                              time: format(
                                utcToZonedTime(fixture.time.starting_at * 1000, "UTC"),
                                settings.timeFormat ?? settings.timeFormat,
                                { timeZone: "UTC" }
                              ),
                              date: dateTz(fixture.time.starting_at, "UTC"),
                              venue: venueName,
                            })}
                            <br />
                            <br />
                          </>
                        )}
                        <>
                          {intl.get("match-about.h2h", {
                            localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                            visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                          })}
                          <br />
                          <br />
                        </>
                        <>
                          {intl.get("match-about.livescore", {
                            localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                            visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                          })}
                          <br />
                          <br />
                        </>
                      </Box>

                      {showMore && (
                        <Box display="flex" justifyContent="flex-end">
                          <>
                            {"1. "}
                            {intl.get("match-about.one")}
                            <br />
                            {"2. "}
                            {intl.get("match-about.two")}
                            <br />
                            {"3. "}
                            {intl.get("match-about.three")}
                            <br />
                            {"4. "}
                            {intl.get("match-about.four")}
                            <br />
                            {fixture.league && (
                              <>
                                {"5. "}
                                {intl.get("match-about.five", {
                                  leagueName: fixture.league.name_loc || fixture.league.name || "~",
                                })}
                                <br />
                                <br />
                              </>
                            )}
                          </>
                          <>
                            {intl.get("match-about.predict", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                            })}
                            <br />
                            <br />
                          </>
                          <>
                            {intl.get("match-about.watch", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || "~",
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || "~",
                            })}
                            <br />
                            <br />
                          </>
                          <>
                            {intl.get("match-about.event")}
                            <br />
                          </>
                          <>
                            {intl.get("match-about.name", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || `~`,
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || `~`,
                            })}
                            <br />
                          </>
                          <>
                            {intl.get("match-about.date", {
                              date: dateTz(fixture.time.starting_at, "UTC"),
                            })}
                            <br />
                          </>
                          <>
                            {intl.get("match-about.time", {
                              time: format(
                                utcToZonedTime(fixture.time.starting_at * 1000, "UTC"),
                                settings.timeFormat ?? settings.timeFormat,
                                { timeZone: "UTC" }
                              ),
                            })}
                            <br />
                          </>

                          <>
                            {intl.get("match-about.venue", {
                              venue: venueName,
                            })}
                            <br />
                            <br />
                          </>
                          <>
                            {intl.get("match-about.details")}
                            <br />
                          </>
                          <>
                            {intl.get("match-about.localteam", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || `~`,
                            })}
                            <br />
                          </>
                          <>
                            {intl.get("match-about.visitorteam", {
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || `~`,
                            })}
                            <br />
                            <br />
                          </>
                          <>
                            {intl.get("match-about.app", {
                              localTeamName: fixture.localteam.name_loc || fixture.localteam.name || `~`,
                              visitorTeamName: fixture.visitorteam.name_loc || fixture.visitorteam.name || `~`,
                            })}
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
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default observer(About);
