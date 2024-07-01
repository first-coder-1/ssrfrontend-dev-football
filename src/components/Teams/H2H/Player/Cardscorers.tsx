import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { Cardscorer, getCardscorersBySeasonAndTeam, Team } from "../../../../api";
import Scorers from "./Scorers";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  team: Team;
  seasonId: number;
};

export function Cardscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, seasonId } = props;
  const [loading, setLoading] = useState(true);
  const [cardscorers, setCardscorers] = useState<Cardscorer[]>([]);
  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getCardscorersBySeasonAndTeam(seasonId, team._id);
    promise
      .then(
        (res) => setCardscorers(res.data),
        () => setCardscorers([])
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
      scorers={cardscorers}
      columns={(className) => (
        <>
          <Typography className={className} title={intl.get("leagues.stats.yellow-cards")}>
            {intl.get("yellowcards-short")}
          </Typography>
          <Typography className={className} title={intl.get("leagues.stats.red-cards")}>
            {intl.get("redcards-short")}
          </Typography>
        </>
      )}
      cells={(scorer, className) => (
        <>
          <Typography className={className}>{scorer.yellowcards}</Typography>
          <Typography className={className}>{scorer.redcards}</Typography>
        </>
      )}
    />
  );
}
