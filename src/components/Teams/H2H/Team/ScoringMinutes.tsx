import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import { ScoringPeriod } from '../../../../api';
import { Scoring } from './Scoring';

const useStyles = makeStyles()((theme) =>
  ({
    item: {
      [theme.breakpoints.down('md')]: {
        borderBottom: `1px solid ${theme.palette.grey[500]}`,
        borderRight: `1px solid ${theme.palette.grey[500]}`,
      },
    }
  }));

type Props = {
  periods: ScoringPeriod[],
  color: 'primary' | 'secondary',
}

export function ScoringMinutes(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { periods, color } = props;
  return (
    <Grid container justifyContent="space-around">
      {periods.map(period => (
        <Grid item xs={6} md={4} key={period.minute} className={classes.item}>
          <Scoring label={period.minute} value={period.percentage} color={color}/>
        </Grid>
      ))}
    </Grid>
  );
}

export default ScoringMinutes;
