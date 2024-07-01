import React from 'react';
import Typography from '@mui/material/Typography';
import { BaseCard } from './BaseCard';
import Prediction from '../../../components/Prediction';

type Props = {
  columns: Map<string, number>,
  marketName: string,
}

export function ColumnCard(props: Props): React.ReactElement {
  const { columns, marketName } = props;
  return (
    <BaseCard
      marketName={marketName}
      columns={Array.from(columns.keys()).map(key => (
        <Typography key={key}>
          {key}
        </Typography>
      ))}
    >
      {Array.from(columns.entries()).map(([key, value]) => (
        <Prediction key={key} prediction={value}/>
      ))}
    </BaseCard>
  );
}
