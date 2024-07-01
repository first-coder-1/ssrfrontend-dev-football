import React, { useMemo } from 'react';
import { Market, ODDS_FORMAT } from '../../../api';
import { ColumnCard } from './ColumnCard';

type Props = {
  market: Market,
  oddsFormat: ODDS_FORMAT,
}
export function ResultsCard(props: Props): React.ReactElement {
  const { market, oddsFormat } = props;
  const filtered = useMemo(() => {
    return {
      ...market,
      bookmaker: market.bookmaker.map(bookmaker => ({
        ...bookmaker,
        odds: {
          data: bookmaker.odds.data.filter(odd => odd.label.includes('Yes') && !odd.label.includes('/')),
        },
      })),
    } as Market;
  }, [market]);
  return <ColumnCard market={filtered} oddsFormat={oddsFormat}/>;
}
