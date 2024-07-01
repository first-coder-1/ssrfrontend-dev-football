import React from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Team } from "../../../api";
import { useIntl } from "@/hooks/useIntl";

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
  leftTeam?: Team;
  rightTeam?: Team;
};

export function AboutH2H(props: Props): React.ReactElement {
  const intl = useIntl();
  const { leftTeam, rightTeam } = props;
  const { classes } = useStyles();
  const leftTeamCountryName = leftTeam?.country_iso2 ? `${intl.get(`countries.${leftTeam.country_iso2}`)}` : ``;
  const rightTeamCountryName = rightTeam?.country_iso2 ? `${intl.get(`countries.${rightTeam.country_iso2}`)}` : ``;
  return (
    <Card>
      <CardHeader
        title={
          <Grid container>
            <Grid item xs={12} md={7}>
              <Typography variant="h2">{intl.get("h2h-about.title")}</Typography>
            </Grid>
          </Grid>
        }
        disableTypography
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", height: 240, overflow: "auto" }} className={classes.root}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "left" }}>
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
                    {leftTeam && rightTeam ? (
                      <>
                        {leftTeam.national_team && rightTeam.national_team ? (
                          <>
                            {intl.get("h2h-about.main-national", {
                              teamNameA: leftTeam.name_loc || leftTeam.name,
                              teamNameB: rightTeam.name_loc || rightTeam.name,
                            })}
                            <br />
                            <br />
                          </>
                        ) : (
                          <>
                            {intl.get("h2h-about.main", {
                              teamNameA: leftTeam.name_loc || leftTeam.name,
                              teamNameB: rightTeam.name_loc || rightTeam.name,
                              countryA: leftTeamCountryName,
                              countryB: rightTeamCountryName,
                            })}
                            <br />
                            <br />
                          </>
                        )}
                        {intl.get("h2h-about.players")}
                        <br />
                        <br />
                        {intl.get("h2h-about.team")}
                        <br />
                        <br />
                      </>
                    ) : (
                      <>
                        {intl.get("h2h-about.empty")}
                        <br />
                        <br />
                        {intl.get("h2h-about.result")}
                      </>
                    )}
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

export default AboutH2H;
