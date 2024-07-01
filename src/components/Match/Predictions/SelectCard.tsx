import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { BaseCard } from './BaseCard';
import Prediction from '../../../components/Prediction';

const useStyles = makeStyles()((theme) =>
  ({
    select: {
      '&.MuiSelect-outlined': {
        padding: theme.spacing(1, 2),
        width: theme.spacing(10),
      },
    }
  }));

type Props = {
  values: Map<string, number>,
  marketName: string,
}

export function SelectCard(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { values, marketName } = props;
  const keys = Array.from(values.keys());
  const [index, setIndex] = useState<string>(keys[0]);
  return (
    <BaseCard
      marketName={marketName}
      columns={(
        <Select
          value={index}
          onChange={e => setIndex(e.target.value as string)}
          variant="outlined"
          classes={{ select: classes.select }}
        >
          {keys?.map(key => (
            <MenuItem key={key} value={key}>{key}</MenuItem>
          ))}
        </Select>
      )}
    >
      {values.has(index) && <Prediction prediction={values.get(index)!}/>}
    </BaseCard>
  );
}
