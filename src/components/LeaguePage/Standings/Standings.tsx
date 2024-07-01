import React, { useEffect, useMemo, useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Navigate } from 'react-router-dom';
import { alpha, Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import {
  getStandingsByStageExtended,
  League,
  LeagueSeason,
  Stage,
  StandingExtended,
  StandingsExtended,
} from "../../../api";
import { StandingVariant, VariantSelect } from "./VariantSelect";
import { useStages } from "../../../hooks/useStages";
import StageSelect from "../../../components/StageSelect";
import { createLegend } from "../../../utils/createLegend";
import { useGroupKeys } from "../../../hooks/useGroupKeys";
import TabContainer from "../../../components/TabContainer";
import TabPanel from "../../../components/TabPanel";
import StandingItem from "./StandingItem";
import { GroupTab } from "../Summary/GroupTab";
import { slugify } from "../../../utils";
import PlaceholderList from "../../../components/PlaceholderList";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";

const useStyles = makeStyles()((theme) => ({
  item: {
    height: 50,
  },

  legend: {
    justifyContent: "center",
  },

  legendEntry: {
    padding: theme.spacing(0.5, 2.5),
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0.5, 1),
    },
  },

  legendIcon: {
    flex: `0 0 ${theme.spacing(1)}`,
    height: theme.spacing(1),
    borderRadius: 2,
    marginRight: theme.spacing(1),
  },

  position: {
    flex: "0 0 30px",
    [theme.breakpoints.down("md")]: {
      flex: "0 0 20px",
    },
  },

  name: {
    flex: "1 0 0%",
    display: "flex",
    alignItems: "center",
  },

  logo: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    marginRight: theme.spacing(1),
  },

  mp: {
    textAlign: "center",
    flex: `0 0 ${theme.spacing(4.5)}`,
    [theme.breakpoints.down("md")]: {
      flex: `0 0 ${theme.spacing(3)}`,
    },
  },

  column: {
    textAlign: "center",
    flex: `0 0 ${theme.spacing(4.5)}`,
    [theme.breakpoints.down("md")]: {
      flex: `0 0 ${theme.spacing(2.5)}`,
    },
  },

  form: {
    flex: "0 0 120px",
    [theme.breakpoints.down("md")]: {
      flex: "0 0 70px",
    },
  },

  h2h: {
    width: 44,
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  tab: {
    minWidth: 50,
    height: 50,
    backgroundColor: theme.palette.grey[300],
  },

  selects: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      justifyContent: "space-between",
    },
  },
}));

type Props = {
  league: League;
  season?: LeagueSeason;
  standings: StandingsExtended;
  stages: Stage[];
};

export function Standings(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { league, season, standings: initialStandings, stages: initialStages } = props;
  const { settings } = useMst();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  const [comparison, setComparison] = useState<number[]>([]);

  const [stages, activeStage, setActiveStage] = useStages(
    season?._id,
    league.current_stage_id,
    true,
    true,
    initialStages
  );
  const [standings, setStandings] = useState<StandingsExtended | undefined>(initialStandings);
  const standingsArray: StandingExtended[] = useMemo(() => standings?.standings ?? [], [standings]);
  const [loading, setLoading] = useState(false);
  // const { locale } = useParams();

  useEffect(() => {
    if (activeStage) {
      setLoading(true);
      const [promise, cancel] = getStandingsByStageExtended(activeStage._id);
      promise
        .then(
          (res) => {
            setStandings(res.data);
          },
          () => setStandings(undefined)
        )
        .finally(() => setLoading(false));
      return cancel;
    }
  }, [activeStage]);

  useEffect(() => {
    const listener = ((event: CustomEvent) => {
      const detail = event.detail as StandingsExtended;
      if (detail.stage_id === activeStage?._id) {
        setStandings((standings) => {
          if (standings) {
            return {
              ...standings,
              standings: (detail.standings as StandingExtended[]).map((standing) => ({
                ...(standings.standings.find((item) => item.team_id === standing.team_id) ?? standing),
                position: standing.position,
                total: standing.total,
                result: standing.result,
                status: standing.status,
                overall: standing.overall,
                points: standing.points,
                recent_form: standing.recent_form,
                live: standing.live,
              })),
            };
          }
          return standings;
        });
      }
    }) as EventListener;
    window.addEventListener("live_standings", listener);
    return () => window.removeEventListener("live_standings", listener);
  }, [activeStage?._id]);

  const colors = [
    alpha(theme.palette.info.main, 0.5),
    alpha(theme.palette.primary.main, 0.5),
    alpha(theme.palette.success.main, 0.5),
    alpha(theme.palette.warning.main, 0.5),
    alpha(theme.palette.error.main, 0.5),
    alpha(theme.palette.action.active, 0.5),
  ];

  const legend = createLegend(standingsArray, colors, theme.palette.background.paper);

  const map = useMemo(() => {
    return standingsArray.reduce((map, standing) => {
      const key = !standing.group_name ? "A" : standing.group_name.substring(6);
      if (map.has(key)) {
        map.get(key)!.push(standing);
      } else {
        map.set(key, [standing]);
      }
      return map;
    }, new Map<string, StandingExtended[]>());
  }, [standingsArray]);

  const keys = useGroupKeys(map);

  const [activeTab, setActiveTab] = useState(keys[0] || "A");

  const [variant, setVariant] = useState<StandingVariant>(StandingVariant.OVERALL);

  useEffect(() => setActiveTab(keys[0] || "A"), [keys]);

  useEffect(() => {
    if (standingsArray.length === 0 && activeStage?._id && stages[0] && activeStage._id !== stages[0]._id) {
      setActiveStage(stages[0]);
    }
  }, [standingsArray.length, activeStage?._id, stages, setActiveStage]);

  if (season && !season.has_standings) {
    navigate(`/soccer/leagues/${slugify(league.name)}/${league._id}/summary`);
  }

  if ((stages.length === 0 || (stages.length === 1 && standingsArray.length === 0)) && !loading) {
    return null;
  }

  const selects = (
    <Box className={classes.selects}>
      {stages.length > 1 && (
        <StageSelect stages={stages} activeStage={activeStage} setActiveStage={setActiveStage} hideIcon />
      )}
      <VariantSelect variant={variant} setVariant={setVariant} />
    </Box>
  );

  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.tables")}
        titleTypographyProps={{
          variant: "h2",
        }}
        action={<Hidden mdDown>{selects}</Hidden>}
      />
      <CardContent>
        <List disablePadding>
          <Hidden mdUp>
            <ListItem divider>{selects}</ListItem>
          </Hidden>
          {map.size > 1 && (
            <Tabs
              value={activeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              component="li"
            >
              {keys.map((group) => (
                <GroupTab key={group} value={group} onClick={() => setActiveTab(group)} label={group} />
              ))}
              <TabContainer grow className={classes.tab} />
            </Tabs>
          )}
        </List>
        {loading ? (
          <PlaceholderList size={50} />
        ) : (
          Array.from(map.entries()).map(([group, groupStandings]) => (
            <TabPanel key={group} index={group} value={activeTab}>
              <List disablePadding>
                <ListItem divider className={classes.item}>
                  <Typography className={classes.position}>#</Typography>
                  <Typography className={classes.name}>{intl.get("leagues.name")}</Typography>
                  <Typography className={classes.mp} title={intl.get(`teams.matches-played.long`)}>
                    {intl.get(`teams.matches-played.short`)}
                  </Typography>
                  <Typography className={classes.column} title={intl.get(`teams.statistic.win`)}>
                    {intl.get(`teams.statistic.W`)}
                  </Typography>
                  <Typography className={classes.column} title={intl.get(`teams.statistic.draw`)}>
                    {intl.get(`teams.statistic.D`)}
                  </Typography>
                  <Hidden mdDown>
                    <Typography className={classes.column} title={intl.get(`teams.statistic.lost`)}>
                      {intl.get(`teams.statistic.L`)}
                    </Typography>
                    <Typography className={classes.column} title={intl.get(`teams.statistic.goals_for`)}>
                      {intl.get(`teams.statistic.goals_for-short`)}
                    </Typography>
                    <Typography className={classes.column} title={intl.get(`teams.statistic.goals_against`)}>
                      {intl.get(`teams.statistic.goals_against-short`)}
                    </Typography>
                    <Typography className={classes.column} title={intl.get(`teams.difference.long`)}>
                      {intl.get(`teams.difference.short`)}
                    </Typography>
                    <Typography className={classes.column} title={intl.get(`teams.points.long`)}>
                      {intl.get(`teams.points.short`)}
                    </Typography>
                  </Hidden>
                  <Typography className={classes.form}>
                    {intl.get(`leagues.last-5-matches${isMobile ? "-short" : ""}`)}
                  </Typography>
                  <Typography className={classes.h2h} title={intl.get(`teams.h2h.title`)}>
                    {intl.get(`teams.h2h.h2h-short`)}
                  </Typography>
                </ListItem>
                {groupStandings.map((standing) => (
                  <StandingItem
                    key={standing.position}
                    standings={standingsArray}
                    standing={standing}
                    comparison={comparison}
                    setComparison={setComparison}
                    color={standing.result ? legend.get(standing.result)?.color : undefined}
                    variant={variant}
                    settings={settings}
                  />
                ))}
                <ListItem className={classes.legend}>
                  <Grid container>
                    {Array.from(legend.entries()).map(([result, entry]) => (
                      <Grid item xs={6} sm={3} md key={result} className={classes.legendEntry}>
                        <div className={classes.legendIcon} style={{ backgroundColor: entry.color }} />
                        <Typography>{result}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </ListItem>
              </List>
            </TabPanel>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default observer(Standings);
