import React from 'react';
import { Predictions as PredictionsType } from '../../../api';
import { ColumnCard } from './ColumnCard';
import { SelectCard } from './SelectCard';

type Props = {
  predictions?: PredictionsType,
}

export function Predictions(props: Props): React.ReactElement | null {
  const { predictions } = props;
  if (!predictions) {
    return null;
  }
  return (
    <>
      {predictions.home !== undefined && predictions.draw !== undefined && predictions.away !== undefined &&
        <ColumnCard
          columns={new Map([
            ['1', predictions.home],
            ['X', predictions.draw],
            ['2', predictions.away],
          ])}
          marketName="3Way Result"
        />
      }
      {predictions.btts !== undefined &&
        <ColumnCard
          columns={new Map([
            ['Yes', predictions.btts],
            ['No', 100 - predictions.btts],
          ])}
          marketName="Results/Both Teams To Score"
        />
      }
      {predictions.correct_score !== undefined &&
        <SelectCard
          values={new Map(Object.keys(predictions.correct_score).map(key => [key, predictions.correct_score![key]]))}
          marketName="Correct Score"
        />
      }
    </>
  );
}

export default Predictions;
