import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Team, Trophy } from "../../../api";
import TrophyList from "../../../components/TrophyList";
import { useTrophies } from "../../../hooks/useTrophies";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  team: Team;
  trophies: Map<string, Trophy[]>;
};

export function Trophies(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, trophies } = props;
  const [loading, setLoading] = useState(false);
  const map = useTrophies(team._id, setLoading, trophies);
  return (
    <Card>
      <CardHeader
        title={intl.get("teams.trophies")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>{loading ? <PlaceholderList size={50} /> : <TrophyList map={map} />}</CardContent>
    </Card>
  );
}

export default Trophies;
