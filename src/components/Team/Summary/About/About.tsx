import React from "react";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { ActiveSeason, Fixture, Team } from "@/api";
import AboutResult from "./AboutResult";
import { useIntl } from "@/hooks/useIntl";
// import intl from "react-intl-universal";

const useStyles = makeStyles()((theme) => ({
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
}));

type Props = {
  team: Team;
  seasons: ActiveSeason[];
  lastMatch: Fixture;
};

export function About(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { team, lastMatch } = props;

  return (
    <Card>
      <CardHeader
        title={intl.get("team-about.about", { teamName: team.name_loc || team.name })}
        titleTypographyProps={{
          variant: "h2",
        }}
        action={<></>}
        classes={{ action: classes.action }}
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <AboutResult lastMatch={lastMatch} team={team} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default About;
