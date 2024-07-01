import React, { useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ActiveSeason, Stats, Team } from "../../../api";
import SeasonSelect from "../../../components/SeasonSelect";
import StatsTable from "../../../components/StatsTable";
import BorderLinearProgress from "./BorderLinearProgress";
import { useSeasons } from "../../../hooks/useSeasons";
import { useStats } from "../../../hooks/useStats";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";
import { useActiveSeason } from "@/hooks/useActiveSeason";

const useStyles = makeStyles()((theme) => ({
  select: {
    height: 50,
    boxShadow: `inset 0px -4px 0px ${theme.palette.primary.main}`,
  },

  item: {
    flexDirection: "column",
  },

  progress: {
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      left: theme.spacing(10),
      right: theme.spacing(9),
      margin: theme.spacing(0.5, 0),
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
}));

type Props = {
  team: Team;
  seasons: ActiveSeason[];
  stats: Stats;
  activeSeason: ActiveSeason;
};

export function Stats({
  seasons,
  team,
  stats: initialStats,
  activeSeason: initialActiveSeason,
}: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const options = useMemo(() => ({ withStats: true }), []);
  // const [seasons, activeSeason, setActiveSeason] = useSeasons(team._id, team.current_season_id, options);
  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, team.current_season_id, initialActiveSeason);
  const stats = useStats(team._id, activeSeason?._id, setLoading, initialStats); // added initial state
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.statistics")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <SeasonSelect
            activeSeason={activeSeason}
            setActiveSeason={setActiveSeason}
            seasons={seasons}
            useSeasonName
            className={classes.select}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title={intl.get("teams.general-statistics")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>{loading ? <PlaceholderList size={48} /> : stats && <StatsTable stats={stats} />}</CardContent>
      </Card>

      {!!stats?.scoring_minutes && !!stats?.scoring_minutes[0] && (
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: "flex" }}>
                <Typography variant="h2">{intl.get("teams.scoring-minutes")}</Typography>
                <Box sx={{ flex: "1 0 auto", alignItems: "center" }}>
                  <Typography variant="h3" align="center">
                    {team.name}
                  </Typography>
                </Box>
              </Box>
            }
            disableTypography
          />
          <CardContent>
            <Box sx={{ p: 1 }}>
              <List disablePadding>
                {stats.scoring_minutes[0].period.map((period) => (
                  <ListItem key={period.minute} className={classes.item}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography component="span">{period.minute}&apos;</Typography>
                      <Typography component="span">{period.percentage}%</Typography>
                    </Box>
                    <BorderLinearProgress
                      variant="determinate"
                      value={period.percentage}
                      className={classes.progress}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Stats;
