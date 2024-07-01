import React, { useState, useEffect } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import { ActiveSeason, Team, Topscorer } from "@/api";
import GroupTabs, { ContainerSide } from "./GroupTabs";
import { Topscorers } from "./Topscorers";
import { Assistscorers } from "./Assistscorers";
import { Cardscorers } from "./Cardscorers";
import { SeasonSelects } from "../SeasonSelects";
import { SimpleTabs } from "../SimpleTabs";
import { useIntl } from "@/hooks/useIntl";
import { useActiveSeason } from "@/hooks/useActiveSeason";
import { getActiveSeason } from "@/utils/getActiveSeason";

const useStyles = makeStyles()((theme) => ({
  hiddenSide: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  bordered: {
    [theme.breakpoints.up("md")]: {
      borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
  },
}));

type Props = {
  leftTeam: Team;
  rightTeam: Team;
  commonSeasons: {
    leftSeasons: ActiveSeason[];
    rightSeasons: ActiveSeason[];
  };
  commonTopscorers: {
    leftTopscorers: Topscorer[];
    rightTopscorers: Topscorer[];
  };
};

export function Player({
  leftTeam,
  rightTeam,
  commonSeasons: { leftSeasons: initialLeftSeasons, rightSeasons: initialRightSeasons },
  commonTopscorers: { leftTopscorers, rightTopscorers },
}: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();

  const initialLeftActiveSeason = getActiveSeason(initialLeftSeasons, leftTeam.current_season_id);
  const initialRightActiveSeason = getActiveSeason(initialRightSeasons, rightTeam.current_season_id);

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

  const [activeSide, setActiveSide] = useState<ContainerSide>(ContainerSide.LEFT);

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.h2h.player")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <SeasonSelects
            leftSeasons={initialLeftSeasons}
            leftActiveSeason={leftActiveSeason}
            setLeftActiveSeason={setLeftActiveSeason}
            rightSeasons={initialRightSeasons}
            rightActiveSeason={rightActiveSeason}
            setRightActiveSeason={setRightActiveSeason}
            activeSide={activeSide}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Hidden mdUp>
            <GroupTabs
              leftTeam={leftTeam}
              rightTeam={rightTeam}
              activeSide={activeSide}
              setActiveSide={setActiveSide}
            />
          </Hidden>
          <SimpleTabs
            titles={[
              intl.get("teams.h2h.topscorers"),
              intl.get("teams.h2h.assists"),
              intl.get("teams.h2h.disciplinary"),
            ]}
            // eslint-disable-next-line react/no-children-prop
            children={[
              <Grid container key="topscorers">
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx(classes.bordered, {
                    [classes.hiddenSide]: activeSide !== ContainerSide.LEFT,
                  })}
                >
                  {leftActiveSeason?._id && (
                    <Topscorers team={leftTeam} seasonId={leftActiveSeason._id} topscorers={leftTopscorers} />
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx({
                    [classes.hiddenSide]: activeSide !== ContainerSide.RIGHT,
                  })}
                >
                  {rightActiveSeason?._id && (
                    <Topscorers team={rightTeam} seasonId={rightActiveSeason._id} topscorers={rightTopscorers} />
                  )}
                </Grid>
              </Grid>,
              <Grid container key="assists">
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx(classes.bordered, {
                    [classes.hiddenSide]: activeSide !== ContainerSide.LEFT,
                  })}
                >
                  {leftActiveSeason?._id && <Assistscorers team={leftTeam} seasonId={leftActiveSeason._id} />}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx({
                    [classes.hiddenSide]: activeSide !== ContainerSide.RIGHT,
                  })}
                >
                  {rightActiveSeason?._id && <Assistscorers team={rightTeam} seasonId={rightActiveSeason._id} />}
                </Grid>
              </Grid>,
              <Grid container key="disciplinary">
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx(classes.bordered, {
                    [classes.hiddenSide]: activeSide !== ContainerSide.LEFT,
                  })}
                >
                  {leftActiveSeason?._id && <Cardscorers team={leftTeam} seasonId={leftActiveSeason._id} />}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  className={cx({
                    [classes.hiddenSide]: activeSide !== ContainerSide.RIGHT,
                  })}
                >
                  {rightActiveSeason?._id && <Cardscorers team={rightTeam} seasonId={rightActiveSeason._id} />}
                </Grid>
              </Grid>,
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default Player;
