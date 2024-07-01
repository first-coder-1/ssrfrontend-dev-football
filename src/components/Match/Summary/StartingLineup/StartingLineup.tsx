import React, { useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Hidden from "@mui/material/Hidden";
import { Fixture, FixtureEvent, Lineups } from "@/api";
import { TeamLineup } from "./TeamLineup";
import TeamList from "./TeamList";
import { Field } from "./Field";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: "center",
  },

  lineup: {
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "200%",
      transitionProperty: "transform",
      transitionDuration: "0.5s",
    },
  },

  field: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: `5% 5%`,
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      padding: `2% 2%`,
    },
  },

  transform: {
    [theme.breakpoints.down("sm")]: {
      transform: "translateX(-50%)",
    },
  },
}));

type Props = {
  lineups: Lineups;
  fixture: Fixture;
  events: FixtureEvent[];
};

export function StartingLineup(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { fixture, lineups, events } = props;
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  if (lineups.lineup.length === 0 && !lineups.coaches.localteam_coach && !lineups.coaches.visitorteam_coach) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: "flex" }}>
            <Typography>{fixture.formations.localteam_formation}</Typography>
            <Typography variant="h3" className={classes.title}>
              {lineups.lineup.length > 0 ? intl.get("match.lineup") : intl.get("teams.squad")}
            </Typography>
            <Typography>{fixture.formations.visitorteam_formation}</Typography>
          </Box>
        }
        disableTypography
      />
      <CardContent>
        {lineups && (
          <>
            {fixture.formations.localteam_formation &&
              fixture.formations.visitorteam_formation &&
              lineups.lineup.length > 0 && (
                <>
                  <Hidden smUp>
                    <Tabs
                      value={activeTab}
                      onChange={(_, value) => setActiveTab(value)}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab label={fixture.localteam.name} />
                      <Tab label={fixture.visitorteam.name} />
                    </Tabs>
                  </Hidden>
                  <Box className={cx(classes.lineup, { [classes.transform]: activeTab === 1 })}>
                    <Field />
                    <Box className={classes.field}>
                      <TeamLineup
                        teamId={fixture.localteam._id}
                        teamColor={fixture.colors?.localteam?.color || theme.palette.info.main}
                        lineups={lineups}
                        formation={fixture.formations.localteam_formation}
                        events={events}
                      />
                      <TeamLineup
                        teamId={fixture.visitorteam._id}
                        teamColor={fixture.colors?.visitorteam?.color || theme.palette.warning.main}
                        lineups={lineups}
                        formation={fixture.formations.visitorteam_formation}
                        events={events}
                      />
                    </Box>
                  </Box>
                </>
              )}
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: "1 0 50%" }}>
                <TeamList
                  team={fixture.localteam}
                  lineups={lineups}
                  events={events}
                  coach={lineups.coaches.localteam_coach}
                />
              </Box>
              <Box sx={{ flex: "1 0 50%" }}>
                <TeamList
                  team={fixture.visitorteam}
                  lineups={lineups}
                  events={events}
                  coach={lineups.coaches.visitorteam_coach}
                />
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default StartingLineup;
