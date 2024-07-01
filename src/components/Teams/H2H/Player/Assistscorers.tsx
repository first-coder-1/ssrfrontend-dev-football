import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { Assistscorer, getAssistscorersBySeasonAndTeam, Team } from "../../../../api";
import Scorers from "./Scorers";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  team: Team;
  seasonId: number;
};

export function Assistscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, seasonId } = props;
  const [loading, setLoading] = useState(true);
  const [assistscorers, setAssistscorers] = useState<Assistscorer[]>([]);
  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getAssistscorersBySeasonAndTeam(seasonId, team._id);
    promise
      .then(
        (res) => setAssistscorers(res.data),
        () => setAssistscorers([])
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [team._id, seasonId]);
  if (loading) {
    return <PlaceholderList size={50} />;
  }
  return (
    <Scorers
      team={team}
      scorers={assistscorers}
      columns={(className) => (
        <Typography className={className} title={intl.get("players.assists")}>
          {intl.get("assists-short")}
        </Typography>
      )}
      cells={(scorer, className) => <Typography className={className}>{scorer.assists}</Typography>}
    />
  );
}
