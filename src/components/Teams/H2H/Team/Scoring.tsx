import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CircularDashedProgress } from '@/components/CircularDashedProgress/CircularDashedProgress';

const useStyles = makeStyles<void, 'stroke' | 'circle' | 'primary' | 'secondary'>()((theme, _params, classes) => ({
  root: {
    height: theme.spacing(14),
    margin: theme.spacing(2, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  value: {
    position: 'absolute',
    height: theme.spacing(10),
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    fontWeight: theme.typography.fontWeightMedium,
  },
  stroke: {
    width: 2,
    height: theme.spacing(2.5),
    backgroundColor: theme.palette.grey[300],
  },
  circle: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: '50%',
    display: 'none',
  },
  active: {
    [`& .${classes.stroke}, & .${classes.circle}`]: {
      display: 'block',
      [`&.${classes.primary}`]: {
        backgroundColor: theme.palette.primary.main,
      },
      [`&.${classes.secondary}`]: {
        backgroundColor: theme.palette.info.light,
      },
    },
  },
  full: {
    position: 'absolute',
    top: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  primary: {},
  secondary: {},
}));

type Props = {
  label: string,
  value: number,
  color: 'primary' | 'secondary',
}

export function Scoring(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { label, value, color } = props;
  const colorClass = color === 'primary' ? classes.primary : classes.secondary;
  return (
    <Box className={classes.root}>
      <Typography>{label}</Typography>
      <div className={cx(classes.full, { [classes.active]: value === 100 })}>
        <div className={cx(classes.circle, colorClass)}/>
        <div className={cx(classes.stroke, colorClass)}/>
      </div>
      <CircularDashedProgress value={value} color={color}/>
      <Box className={classes.value}>
        {value}%
      </Box>
    </Box>
  );
}
