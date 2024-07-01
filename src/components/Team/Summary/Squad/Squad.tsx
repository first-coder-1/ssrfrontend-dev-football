import React, { useMemo, useState } from "react";

import { makeStyles } from "tss-react/mui";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Hidden from "@/components/Hidden/Hidden";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { PlayerShort, Squad as TSquad, Squads, Team } from "../../../../api";
import TabContainer from "../../../../components/TabContainer";
import SeasonSelect from "../../../../components/SeasonSelect";
import { useSeasons } from "../../../../hooks/useSeasons";
import { Current } from "./Current";
import { Stats } from "./Stats";
import { TeamSidelinedTable } from "../../TeamSidelinedTable";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  empty: {
    flex: "1 0 auto",
    minWidth: "auto",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  selectContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  scroller: {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}));

type Props = {
  team: Team;
  showSidelined?: boolean;
  squads: Squads<TSquad>;
  coach: PlayerShort;
};

export function Squad(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { team, showSidelined, squads, coach } = props;
  const [active, setActive] = useState(0);
  const options = useMemo(
    () => ({
      withSquads: active !== 2,
      withSidelined: active === 2,
    }),
    [active]
  );
  const [seasons, activeSeason, setActiveSeason] = useSeasons(team._id, team.current_season_id, options);

  const seasonSelect = (
    <SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} useSeasonName />
  );

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.squad")}
          titleTypographyProps={{
            variant: "h2",
          }}
          action={<Hidden mdUp>{seasonSelect}</Hidden>}
        />
        <CardContent>
          <Tabs
            value={active}
            onChange={(_, value) => setActive(value)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ scroller: active === 0 ? classes.scroller : undefined }}
          >
            <Tab label={intl.get(`teams.current`)} value={0} />
            <Tab label={intl.get(`teams.statistics`)} value={1} />
            {team.has_sidelined && showSidelined && <Tab label={intl.get(`teams.sidelined`)} value={2} />}
            <TabContainer grow />
            <TabContainer className={classes.selectContainer} label={seasonSelect} />
          </Tabs>
          {active === 1 && <Stats team={team} activeSeason={activeSeason} />}
          {showSidelined && active === 2 && <TeamSidelinedTable team={team} activeSeason={activeSeason} />}
        </CardContent>
      </Card>
      {active === 0 && <Current team={team} squads={squads} coach={coach} activeSeason={activeSeason} />}
    </>
  );
}

export default Squad;
