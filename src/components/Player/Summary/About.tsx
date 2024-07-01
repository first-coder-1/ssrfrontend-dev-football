import React, { useContext, useState } from "react";

import { format } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { parse } from "../../../utils";
import { ActiveSeason, Player } from "../../../api";
// import { Context } from '../../../locales/LocaleProvider';
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import { useIntl } from "@/hooks/useIntl";
import { Context } from "@/locales/LocaleProvider";

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
  player: Player;
  seasons: ActiveSeason[];
};

export function About(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { player, seasons } = props;
  const [showMore, setShowMore] = useState(false);
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const { dateLocale } = useContext(Context);
  const birthdate = player.birthdate
    ? format(parse(player.birthdate, new Date(), "yyyy-MM-dd"), "MMM dd, yyyy", { locale: dateLocale })
    : "-";
  return (
    <Card>
      <CardHeader
        title={
          <Grid container>
            <Grid item xs={12} md={7}>
              <Typography variant="h2">
                {intl.get("player-about.about", {
                  playerName: player.display_name,
                })}
              </Typography>{" "}
            </Grid>
          </Grid>
        }
        disableTypography
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", height: 240, overflow: "auto" }} className={classes.root}>
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1 0 auto",
                    alignItems: "left",
                    justifyContent: "space-around",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <>
                      {intl.get("player-about.born", {
                        playerName: player.display_name,
                        teamName: player.team_name_loc || player.team_name || "~",
                        bornDate: birthdate[0].toUpperCase() + birthdate.substr(1),
                        height: player.height ? player.height.replace(" cm", "") : "~",
                        weight: player.weight ? player.weight.replace(" kg", "") : "~",
                        age: player.age || "~",
                      })}
                      <br />
                      <br />
                      {intl.get("player-about.main", {
                        playerName: player.display_name,
                        position: player.number || "~",
                      })}
                      <br />
                      <br />
                    </>
                    {player.has_career && (
                      <>
                        {intl.get("player-about.career", {
                          playerName: player.display_name,
                        })}
                        <br />
                        <br />
                      </>
                    )}
                  </Box>
                  {showMore && (
                    <Box display="flex">
                      {player.facts && (
                        <>
                          {player.facts.split("\n").map((str) => (
                            <>
                              {str}
                              <br />
                            </>
                          ))}{" "}
                          <br />
                          <br />
                        </>
                      )}

                      <>
                        {intl.get("player-about.lineup", {
                          playerName: player.display_name,
                          teamName: player.team_name_loc || player.team_name,
                        })}
                        <br />
                        <br />
                      </>
                      {seasons.length > 0 && (
                        <>
                          {intl.get("player-about.when", {
                            playerName: player.display_name,
                          })}
                          <br />
                          <br />
                        </>
                      )}
                      {player.has_trophies && (
                        <>
                          {intl.get("player-about.trophies", {
                            playerName: player.display_name,
                          })}
                          <br />
                          <br />
                        </>
                      )}
                      {player.has_sidelined && (
                        <>
                          {intl.get("player-about.sidelined", {
                            playerName: player.display_name,
                          })}
                          <br />
                          <br />
                        </>
                      )}
                    </Box>
                  )}
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box display="flex" justifyContent="center">
                      <Button color="primary" onClick={handleShowMore}>
                        {showMore ? intl.get("team-about.show-less") : intl.get("team-about.show-more")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default observer(About);
