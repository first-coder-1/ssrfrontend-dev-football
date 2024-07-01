import React from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
  national?: boolean;
};

export function AboutTeams(props: Props): React.ReactElement {
  const intl = useIntl();
  const { national } = props;
  const { classes } = useStyles();
  return (
    <Card>
      <CardHeader
        title={
          <Grid container>
            <Grid item xs={12} md={7}>
              <Typography variant="h2">{intl.get("teams-about.title")}</Typography>
            </Grid>
          </Grid>
        }
        disableTypography
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "100%", height: 120, overflow: "auto" }} className={classes.root}>
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
                    {national ? <>{intl.get("teams-about.national")}</> : <>{intl.get("teams-about.domestic")}</>}
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

export default AboutTeams;
