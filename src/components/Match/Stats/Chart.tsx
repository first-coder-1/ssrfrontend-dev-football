import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles, withStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Fixture, FixtureStats, getFixtureStats } from "../../../api";
import { Bar } from "./Bar";
import PlaceholderList from "../../../components/PlaceholderList";
import { observer } from "mobx-react-lite";
import { useMst } from "../../../store";
import { useIntl } from "@/hooks/useIntl";

const Possession = withStyles(LinearProgress, (theme) => ({
  root: {
    height: 26,
    borderRadius: 6,
  },
  colorPrimary: {
    backgroundColor: theme.palette.success.main,
  },
  bar: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: theme.palette.primary.main,
  },
}));

const useStyles = makeStyles()((theme) => ({
  possession: {
    flex: "1 0 auto",
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    lineHeight: "26px",
    width: "100%",
    padding: theme.spacing(0, 1),
    position: "absolute",
    top: 0,
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightBold!,
    textTransform: "uppercase",
    color: theme.palette.primary.contrastText,
  },

  name: {
    flex: 1,
    textAlign: "left",
    "&:last-child": {
      textAlign: "right",
    },
  },

  toggle: {
    height: theme.spacing(4),
    "& .MuiToggleButton-root": {
      lineHeight: 1.5,
    },
  },
}));

type Props = {
  fixture: Fixture;
  stats: FixtureStats;
};

export function Chart(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { fixture, stats: initialStats } = props;
  const { settings } = useMst();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FixtureStats | undefined>(initialStats);
  const [toggle, setToggle] = useState<"stats" | "stats_ht">("stats");

  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getFixtureStats(fixture._id);
    promise.then((res) => setData(res.data)).finally(() => setLoading(false));
    return cancel;
  }, [fixture]);

  if (loading) {
    return (
      <Paper>
        <PlaceholderList size={48} />
      </Paper>
    );
  }

  if (!data || data.stats.length < 2) {
    return null;
  }

  const stats = toggle === "stats_ht" && data.stats_ht ? data.stats_ht : data.stats;

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h2">{intl.get("match.stats-chart")}</Typography>
            <ToggleButtonGroup
              size="small"
              color="primary"
              value={toggle}
              exclusive
              onChange={(_, value) => setToggle(value)}
              className={classes.toggle}
            >
              <ToggleButton value="stats" disabled={!data.stats_ht}>
                {intl.get(isMobile ? "match.scores.ft" : "navbar.match")}
              </ToggleButton>
              <ToggleButton value="stats_ht" disabled={!data.stats_ht}>
                {intl.get(isMobile ? "match.scores.ht" : "teams.half-time")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        }
        disableTypography
      />
      <CardMedia>
        <Box>
          <Box sx={{ display: "flex" }}>
            <Hidden mdDown>
              <Typography variant="h5">{stats[0].possessiontime}%</Typography>
            </Hidden>
            <Typography variant="h5" align="center" className={classes.possession}>
              {intl.get("match.possession")}
            </Typography>
            <Hidden mdDown>
              <Typography variant="h5">{stats[1].possessiontime}%</Typography>
            </Hidden>
          </Box>
          <Box sx={{ position: "relative", mt: 0.5, mb: 0.5 }}>
            <Possession variant="determinate" value={stats[0].possessiontime} />
            <Box className={classes.inner}>
              <Hidden mdDown>
                <Typography variant="inherit">
                  {(!settings.originalNames && fixture.localteam.name_loc) || fixture.localteam.name}
                </Typography>
                <Typography variant="inherit">
                  {(!settings.originalNames && fixture.visitorteam.name_loc) || fixture.visitorteam.name}
                </Typography>
              </Hidden>
              <Hidden mdUp>
                <Typography variant="inherit">{stats[0].possessiontime}%</Typography>
                <Typography variant="inherit">{stats[1].possessiontime}%</Typography>
              </Hidden>
            </Box>
          </Box>
          <Hidden mdUp>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" className={classes.name}>
                {(!settings.originalNames && fixture.localteam.name_loc) || fixture.localteam.name}
              </Typography>
              <Typography variant="subtitle1" className={classes.name}>
                {(!settings.originalNames && fixture.visitorteam.name_loc) || fixture.visitorteam.name}
              </Typography>
            </Box>
          </Hidden>
          <Bar title={intl.get("match.goals")} local={stats[0].goals} visitor={stats[1].goals} />
          <Bar title={intl.get("match.corners")} local={stats[0].corners} visitor={stats[1].corners} />
          <Bar
            title={intl.get("match.shots-ongoal")}
            local={stats[0].shots?.ongoal || 0}
            visitor={stats[1].shots?.ongoal || 0}
          />
          <Bar
            title={intl.get("match.shots-total")}
            local={stats[0].shots?.total || 0}
            visitor={stats[1].shots?.total || 0}
          />
          <Bar title={intl.get("match.fouls")} local={stats[0].fouls} visitor={stats[1].fouls} />
          {stats[0].passes && stats[1].passes && (
            <Bar
              title={intl.get("match.passes")}
              local={stats[0].passes.percentage}
              visitor={stats[1].passes.percentage}
              percentage
            />
          )}
        </Box>
      </CardMedia>
    </Card>
  );
}

export default observer(Chart);
