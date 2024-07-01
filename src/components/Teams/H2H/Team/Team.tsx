import React, { useState } from "react";

import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Hidden from "@/components/Hidden/Hidden";
import { useStats } from "../../../../hooks/useStats";
import { useSeasons } from "../../../../hooks/useSeasons";
import GroupTabs, { ContainerSide } from "../Player/GroupTabs";
import { SeasonSelects } from "../SeasonSelects";
import { SimpleTabs } from "../SimpleTabs";
import { ActiveSeason, Team as TeamType, getStatsByTeamAndSeason } from "../../../../api";
import StatsTable from "@/components/StatsTable";
import ScoringMinutes from "./ScoringMinutes";
import { Trophies } from "./Trophies";
import { useIntl } from "@/hooks/useIntl";
import { useActiveSeason } from "@/hooks/useActiveSeason";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { Stats as StatsType } from "@/api";

const useStyles = makeStyles()((theme) => ({
  left: {
    [theme.breakpoints.up("md")]: {
      borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
  },

  hiddenSide: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  leftTeam: TeamType;
  rightTeam: TeamType;
  commonSeasons: {
    leftSeasons: ActiveSeason[];
    rightSeasons: ActiveSeason[];
  };
  commonStats: {
    leftTeamStats: StatsType;
    rightTeamStats: StatsType;
  };
};

export function Team(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();

  const {
    leftTeam,
    rightTeam,
    commonSeasons: { leftSeasons: initialLeftSeasons, rightSeasons: initialRightSeasons },
    commonStats: { leftTeamStats, rightTeamStats },
  } = props;

  const [leftSeasons, setLeftSeasons] = useState(initialLeftSeasons); // state exists for future client logic implementing if it will be needed
  const [rightSeasons, setRightSeasons] = useState(initialRightSeasons); // state exists for future client logic implementing if it will be needed

  const initialLeftActiveSeason = getActiveSeason(leftSeasons, leftTeam.current_season_id);
  const initialRightActiveSeason = getActiveSeason(rightSeasons, rightTeam.current_season_id);

  const [leftActiveSeason, setLeftActiveSeason] = useActiveSeason(
    initialLeftSeasons,
    leftTeam.current_season_id,
    initialLeftActiveSeason
  );
  const [rightActiveSeason, setRightActiveSeason] = useActiveSeason(
    initialRightSeasons,
    rightTeam.current_season_id,
    initialRightActiveSeason
  );

  const [leftStats, setLeftStats] = useState(leftTeamStats);
  const [rightStats, setRightStats] = useState(rightTeamStats);

  const [activeSide, setActiveSide] = useState<ContainerSide>(ContainerSide.LEFT);

  useEffectWithoutFirstRender(() => {
    const [leftStatsPromise] = getStatsByTeamAndSeason(leftTeam._id, leftActiveSeason?._id!);
    leftStatsPromise.then((res) => setLeftStats(res.data));
    const [rightStatsPromise] = getStatsByTeamAndSeason(rightTeam._id, rightActiveSeason?._id!);
    rightStatsPromise.then((res) => setRightStats(res.data));
  }, [leftActiveSeason?._id, rightActiveSeason?._id]);

  const groupTabs = (
    <GroupTabs leftTeam={leftTeam} rightTeam={rightTeam} activeSide={activeSide} setActiveSide={setActiveSide} />
  );

  const leftProps = {
    item: true,
    xs: 12 as const,
    md: 6 as const,
    className: cx(classes.left, { [classes.hiddenSide]: activeSide !== ContainerSide.LEFT }),
  };

  const rightProps = {
    item: true,
    xs: 12 as const,
    md: 6 as const,
    className: cx({ [classes.hiddenSide]: activeSide !== ContainerSide.RIGHT }),
  };

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.h2h.team")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <SeasonSelects
            leftSeasons={leftSeasons}
            leftActiveSeason={leftActiveSeason}
            setLeftActiveSeason={setLeftActiveSeason}
            rightSeasons={rightSeasons}
            rightActiveSeason={rightActiveSeason}
            setRightActiveSeason={setRightActiveSeason}
            activeSide={activeSide}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Hidden mdUp>{groupTabs}</Hidden>
          <SimpleTabs
            titles={[
              intl.get("teams.h2h.general-statistics"),
              intl.get("teams.h2h.trophies"),
              intl.get("teams.h2h.scoring-minutes"),
            ]}
            // eslint-disable-next-line react/no-children-prop
            children={[
              <React.Fragment key="general-statistics">
                <Hidden mdDown>{groupTabs}</Hidden>
                <Grid container>
                  <Grid {...leftProps}>{leftStats && <StatsTable stats={leftStats} />}</Grid>
                  <Grid {...rightProps}>{rightStats && <StatsTable stats={rightStats} />}</Grid>
                </Grid>
              </React.Fragment>,
              <React.Fragment key="trophies">
                <Hidden mdDown>{groupTabs}</Hidden>
                <Grid container>
                  <Grid {...leftProps}>
                    <Trophies team={leftTeam} />
                  </Grid>
                  <Grid {...rightProps}>
                    <Trophies team={rightTeam} />
                  </Grid>
                </Grid>
              </React.Fragment>,
              <React.Fragment key="scoring-minutes">
                <Hidden mdDown>{groupTabs}</Hidden>
                <Grid container>
                  <Grid {...leftProps}>
                    {leftStats?.scoring_minutes && leftStats?.scoring_minutes[0] && (
                      <ScoringMinutes periods={leftStats?.scoring_minutes[0].period} color="primary" />
                    )}
                  </Grid>
                  <Grid {...rightProps}>
                    {rightStats?.scoring_minutes && rightStats?.scoring_minutes[0] && (
                      <ScoringMinutes periods={rightStats?.scoring_minutes[0].period} color="secondary" />
                    )}
                  </Grid>
                </Grid>
              </React.Fragment>,
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default Team;
