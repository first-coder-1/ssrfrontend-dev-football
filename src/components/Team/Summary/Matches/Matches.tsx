import React, { useState } from "react";

import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Hidden from "@/components/Hidden/Hidden";
import { SeasonFixturesPaginated } from "./SeasonFixturesPaginated";
import { ActiveSeason, Fixture, Side, Team, TeamSeasonFixture } from "../../../../api";
import LastMatchResult from "./LastMatchResult";
import SeasonSelect from "../../../../components/SeasonSelect";
import SideSelect from "../../../../components/SideSelect";
import { SeasonFixtures } from "./SeasonFixtures";
import { useActiveSeason } from "../../../../hooks/useActiveSeason";
import { useIntl } from "@/hooks/useIntl";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { TSeasonFixturesRes } from "@/pages/soccer/teams/[kind]/[id]/summary";

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
  seasonFixturesRes: TSeasonFixturesRes;
  lastMatch: Fixture;
};

export function Matches(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { team, seasons, seasonFixturesRes, lastMatch } = props;
  const initialActiveSeason = getActiveSeason(seasons, team.current_season_id);
  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, team.current_season_id, initialActiveSeason);

  const [side, setSide] = useState<Side | undefined>();
  const seasonSelect = <SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} />;
  const sideSelect = <SideSelect activeSide={side} setSide={setSide} />;
  return (
    <Card>
      <CardHeader
        title={intl.get("teams.matches")}
        titleTypographyProps={{
          variant: "h2",
        }}
        action={
          <>
            <Hidden mdDown>
              <Box>{seasonSelect}</Box>
              <Box>{sideSelect}</Box>
            </Hidden>
          </>
        }
        classes={{ action: classes.action }}
      />
      <CardContent className={classes.content}>
        <Box sx={{ display: "flex" }}>
          <Hidden mdDown implementation="css">
            <LastMatchResult lastMatch={lastMatch} team={team} />
            <SeasonFixtures
              seasonFixturesRes={seasonFixturesRes}
              key={`${team._id}-${activeSeason?._id}`}
              teamId={team._id}
              season={activeSeason}
              side={side}
            />
          </Hidden>
          <Hidden mdUp implementation="css">
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }} className={classes.selects}>
                {seasonSelect}
                {sideSelect}
              </Box>
              <SeasonFixturesPaginated
                seasonFixturesRes={seasonFixturesRes}
                key={`${team._id}-${activeSeason?._id}-${side}`}
                teamId={team._id}
                season={activeSeason}
                side={side}
              />
            </Box>
          </Hidden>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Matches;
