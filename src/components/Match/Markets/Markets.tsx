import React from 'react';
import { Market, ODDS_FORMAT } from '../../../api';
import { ColumnCard } from './ColumnCard';
import { SelectCard } from './SelectCard';
import { ResultsCard } from './ResultsCard';
import { TableCard } from './TableCard';
import { ODDS_MODE } from '../../../store';

type Props = {
  markets: Market[],
  oddsFormat: ODDS_FORMAT,
}

export function Markets(props: Props): React.ReactElement {
  const { markets, oddsFormat } = props;
  return (
    <>
      {markets
        .filter(market => market.bookmaker.some(bookmaker => bookmaker.odds.data.length > 0))
        .map(market => {
          let element: React.ReactElement | null;
          switch (market.name) {
            case 'Correct Score':
            case 'Exact Goals Number':
            case 'HT/FT':
              element = <SelectCard market={market} oddsFormat={oddsFormat}/>;
              break;
            case 'Results/Both Teams To Score':
              element = <ResultsCard market={market} oddsFormat={oddsFormat}/>;
              break;
            case 'Team Goalscorer':
              element = ODDS_MODE.ODDS ? <TableCard market={market} oddsFormat={oddsFormat}/> : null;
              break;
            default:
              element = <ColumnCard market={market} oddsFormat={oddsFormat}/>;
          }
          return (
            <React.Fragment key={market.id}>
              {element}
            </React.Fragment>
          );
        })}
    </>
  );
}

export default Markets;
