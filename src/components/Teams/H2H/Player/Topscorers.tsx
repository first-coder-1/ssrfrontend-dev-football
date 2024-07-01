import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { getTopscorersBySeasonAndTeam, Team, Topscorer } from "../../../../api";
import Scorers from "./Scorers";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

type Props = {
  team: Team;
  seasonId: number;
  topscorers: Topscorer[];
};

export function Topscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, seasonId, topscorers: initialTopScorers } = props;
  const [loading, setLoading] = useState(false);
  const [topscorers, setTopscorers] = useState<Topscorer[]>(initialTopScorers);

  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getTopscorersBySeasonAndTeam(seasonId, team._id);
    promise
      .then(
        (res) => setTopscorers(res.data),
        () => setTopscorers([])
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
      scorers={topscorers}
      columns={(className) => (
        <>
          <Typography
            className={className}
            title={
              intl.get("fixtures.statuses.PEN_LIVE")[0] + intl.get("fixtures.statuses.PEN_LIVE").slice(1).toLowerCase()
            }
          >
            {intl.get("penalty-goals-short")}
          </Typography>
          <Typography className={className} title={intl.get("players.goals")}>
            {intl.get("goals-short")}
          </Typography>
        </>
      )}
      cells={(scorer, className) => (
        <>
          <Typography className={className}>{scorer.penalty_goals}</Typography>
          <Typography className={className}>{scorer.goals}</Typography>
        </>
      )}
    />
  );
}
