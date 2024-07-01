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
          theme.palette.mode === "dark"
            ? theme.palette.grey[600]
            : theme.palette.grey[200]
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
  topscorers?: boolean;
  abroad?: boolean;
  borntoday?: boolean;
  cardscorers?: boolean;
};

export function AboutPlayers(props: Props): React.ReactElement {
  const { topscorers, abroad, borntoday, cardscorers } = props;
  const { classes } = useStyles();
  const intl = useIntl();
  return (
    <Card>
      <CardHeader
        title={
          <Grid container>
            <Grid item xs={12} md={7}>
              <Typography variant="h2">
                {intl.get("players-about.title")}
              </Typography>
            </Grid>
          </Grid>
        }
        disableTypography
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{ width: "100%", height: 120, overflow: "auto" }}
            className={classes.root}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  {topscorers && <>{intl.get("players-about.topscorers")}</>}
                  {cardscorers && <>{intl.get("players-about.cardscorers")}</>}
                  {abroad && <>{intl.get("players-about.abroad")}</>}
                  {borntoday && <>{intl.get("players-about.borntoday")}</>}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AboutPlayers;
