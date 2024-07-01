import React, { useState } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Hidden from "@/components/Hidden/Hidden";
import FixtureList from "./FixtureList";
import { ActiveSeason, Team, TeamSeasonFixture } from "../../../../api";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { TTeamFixturesRes } from "@/pages/soccer/teams/h2h/[[...slug]]";

const useStyles = makeStyles()((theme) => ({
  hidden: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  leftTeam: Team;
  rightTeam: Team;
  leftSeasons: ActiveSeason[];
  rightSeasons: ActiveSeason[];
  leftTeamFixturesRes: TTeamFixturesRes;
  rightTeamFixturesRes: TTeamFixturesRes;
};

export function Matches({
  leftTeam,
  rightTeam,
  leftSeasons,
  rightSeasons,
  leftTeamFixturesRes,
  rightTeamFixturesRes,
}: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { settings } = useMst();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Card>
      <CardHeader
        title={intl.get("teams.h2h.matches")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Hidden smUp>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab value={0} label={(!settings.originalNames && leftTeam.name_loc) || leftTeam.name} />
            <Tab value={1} label={(!settings.originalNames && rightTeam.name_loc) || rightTeam.name} />
          </Tabs>
        </Hidden>
        <Grid container>
          <Grid item xs={12} md={6} className={cx({ [classes.hidden]: activeTab === 1 })}>
            <FixtureList bordered team={leftTeam} seasons={leftSeasons} fixtures={leftTeamFixturesRes} />
          </Grid>
          <Grid item xs={12} md={6} className={cx({ [classes.hidden]: activeTab === 0 })}>
            <FixtureList team={rightTeam} seasons={rightSeasons} fixtures={rightTeamFixturesRes} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default observer(Matches);
