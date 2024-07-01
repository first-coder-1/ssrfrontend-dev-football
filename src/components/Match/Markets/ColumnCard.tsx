import React from "react";
import Typography from "@mui/material/Typography";
import { Market, ODDS_FORMAT } from "../../../api";
import { Odd } from "@/components/FixturesPage/OddsItem/Odd";
import { BaseCard } from "./BaseCard";

type Props = {
  market: Market;
  oddsFormat: ODDS_FORMAT;
};

export function ColumnCard(props: Props): React.ReactElement {
  const { market, oddsFormat } = props;
  const bookmaker = market.bookmaker[0];
  return (
    <BaseCard
      market={market}
      columns={bookmaker?.odds.data.map((odd) => <Typography key={odd.label}>{odd.label}</Typography>)}
    >
      {(bookmaker) =>
        bookmaker.odds.data.map((odd) => (
          <Odd
            key={odd.label}
            dp3={Number(odd.dp3)}
            dp3Prev={Number(odd.dp3_prev)}
            bookmakerId={bookmaker.id}
            eventId={odd.bookmaker_event_id}
            format={oddsFormat}
          />
        ))
      }
    </BaseCard>
  );
}
