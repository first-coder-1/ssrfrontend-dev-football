import React, { useMemo, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { ActiveSeason, LeagueType, Player } from "@/api";
import TabContainer from "@/components/TabContainer";
import TabPanel from "@/components/TabPanel";
import { MatchesTab } from "./MatchesTab";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  tab: {
    height: 50,
    backgroundColor: theme.palette.grey[300],
    borderRightColor: theme.palette.grey[500],
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },

  wide: {
    minWidth: theme.spacing(18),
  },
}));

type Props = {
  player: Player;
  seasons: ActiveSeason[];
};

export function Matches(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { player, seasons } = props;
  const [activeTab, setActiveTab] = useState<"all" | LeagueType>("all");

  const tabs = useMemo(() => {
    return seasons.reduce((map, season) => {
      if (map.has(season.league.type)) {
        map.get(season.league.type)!.push(season);
      } else {
        map.set(season.league.type, [season]);
      }
      return map;
    }, new Map());
  }, [seasons]);
  
  return (
    <Card>
      <CardHeader
        title={intl.get("players.matches")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <Tabs
            value={activeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            component="li"
          >
            <Tab
              value="all"
              onClick={() => setActiveTab("all")}
              label={intl.get("leagues.all")}
              className={classes.tab}
            />
            {Array.from(tabs.entries())
              .filter(([_, seasons]) => seasons.length > 0)
              .map(([type]) => (
                <Tab
                  key={type}
                  value={type}
                  onClick={() => setActiveTab(type)}
                  label={intl.get(`leagues.${type}`)}
                  className={cx(classes.tab, classes.wide)}
                />
              ))}
            <TabContainer grow className={classes.tab} />
          </Tabs>
        </List>
        <TabPanel index="all" value={activeTab}>
          <MatchesTab player={player} seasons={seasons} />
        </TabPanel>
        {Array.from(tabs.entries())
          .filter(([_, seasons]) => seasons.length > 0)
          .map(([type, seasons]) => (
            <TabPanel key={type} index={type} value={activeTab}>
              <MatchesTab player={player} seasons={seasons} type={type} />
            </TabPanel>
          ))}
      </CardContent>
    </Card>
  );
}

export default Matches;
