import React, { useEffect, useMemo, useState } from "react";
// import intl from 'react-intl-universal';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tabs from "@mui/material/Tabs";
import { League, LeagueSeason, TeamSeasonFixture } from "../../../api";
import FixtureList from "../../../components/FixtureList";
import RoundSelect from "../../../components/RoundSelect";
import { makeStyles } from "tss-react/mui";
import StageSelect from "../../../components/StageSelect";
import TabPanel from "../../../components/TabPanel";
import TabContainer from "../../../components/TabContainer";
import { useGroupKeys } from "../../../hooks/useGroupKeys";
import { GroupTab } from "../Summary/GroupTab";
import PlaceholderList from "../../../components/PlaceholderList";
import Pagination from "../../../components/Pagination";
import { useMatchesData } from "./useMatchesData";
import { useIntl } from "@/hooks/useIntl";
import { TLeagueMatchesData } from "@/pages/soccer/leagues/[type]/[id]/summary";

const useStyles = makeStyles()((theme) => ({
  select: {
    backgroundColor: theme.palette.grey[300],
  },

  tab: {
    minWidth: 50,
    height: 50,
    backgroundColor: theme.palette.grey[300],
  },
}));

type Props = {
  league: League;
  season?: LeagueSeason;
  matches: TLeagueMatchesData;
};

export function Matches(props: Props): React.ReactElement | null {
  const { classes } = useStyles();
  const intl = useIntl();
  const { league, season, matches } = props;

  const { stages, setActiveStage, activeStage, rounds, setActiveRound, activeRound, page, setPage, response, loading } =
    useMatchesData(league, season, matches);

  const map = useMemo(() => {
    return response.fixtures.reduce((map, fixture) => {
      const key = !fixture.group || Array.isArray(fixture.group) ? "A" : fixture.group.name.substr(6);
      if (map.has(key)) {
        map.get(key)!.push(fixture);
      } else {
        map.set(key, [fixture]);
      }
      return map;
    }, new Map<string, TeamSeasonFixture[]>());
  }, [response.fixtures]);

  const keys = useGroupKeys(map);
  const [activeTab, setActiveTab] = useState(keys[0] || "A");
  useEffect(() => setActiveTab(keys[0] || "A"), [keys]);

  if (!loading && !activeRound && !activeStage) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.matches")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          {((!league.is_cup && rounds.length > 1) || (league.is_cup && stages.length > 1)) && (
            <ListItem className={classes.select}>
              {!league.is_cup && rounds.length > 1 && (
                <RoundSelect rounds={rounds} activeRound={activeRound!} setActiveRound={setActiveRound} />
              )}
              {league.is_cup && stages.length > 1 && (
                <StageSelect stages={stages} activeStage={activeStage} setActiveStage={setActiveStage} />
              )}
            </ListItem>
          )}
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
          <PlaceholderList
            length={
              map.size > 1 ? undefined : league.is_cup ? league.total_fixtures_stage : league.total_fixtures_round
            }
            size={80}
          />
        ) : (
          Array.from(map.entries()).map(([group, fixtures]) => (
            <TabPanel key={group} index={group} value={activeTab}>
              <FixtureList fixtures={fixtures} showPositions={!league.is_cup} />
            </TabPanel>
          ))
        )}
        {response.min > 1 || response.max > 1 ? (
          <ListItem disableGutters>
            <Pagination pageMin={response.min} pageMax={response.max} currentPage={page} onPageChange={setPage} />
          </ListItem>
        ) : undefined}
      </CardContent>
    </Card>
  );
}

export default Matches;
