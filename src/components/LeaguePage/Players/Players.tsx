import React, { useEffect, useMemo, useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Navigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { League, LeagueSeason, Topscorer } from "../../../api";
import TabPanel from "../../../components/TabPanel";
import Select from "../../../components/Select";
import { Topscorers } from "./Topscorers";
import { Assistscorers } from "./Assistscorers";
import { Cardscorers } from "./Cardscorers";
import { slugify } from "../../../utils";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  league: League;
  season: LeagueSeason;
  topscorers: Topscorer[];
};

const tabs = ["topscorers", "assistscorers", "cardscorers"];

export function Players(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { league, season, topscorers } = props;
  // const { locale } = useParams();
  const availableTabs = useMemo(() => tabs.filter((tab) => season[`has_${tab}` as keyof typeof season]), [season]);
  const [activeTab, setActiveTab] = useState(availableTabs[0]);
  useEffect(() => {
    setActiveTab(availableTabs[0]);
  }, [availableTabs]);

  // if (!season.has_topscorers && !season.has_assistscorers && !season.has_cardscorers) {
  //   return <Navigate to={`/soccer/leagues/${slugify(league.name)}/${league._id}/summary`} />;
  // }

  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.players")}
        titleTypographyProps={{
          variant: "h2",
        }}
        action={
          <Select label={intl.get(`leagues.players-${activeTab}`)}>
            {(onClose) =>
              availableTabs.map((tab) => (
                <MenuItem
                  key={tab}
                  selected={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);
                    onClose();
                  }}
                >
                  <ListItemText primary={intl.get(`leagues.players-${tab}`)} />
                </MenuItem>
              ))
            }
          </Select>
        }
      />
      <CardContent>
        <TabPanel index={tabs[0]} value={activeTab}>
          <Topscorers seasonId={season._id} topscorers={topscorers}/>
        </TabPanel>
        <TabPanel index={tabs[1]} value={activeTab}>
          <Assistscorers seasonId={season._id} />
        </TabPanel>
        <TabPanel index={tabs[2]} value={activeTab}>
          <Cardscorers seasonId={season._id} />
        </TabPanel>
      </CardContent>
    </Card>
  );
}

export default Players;
