import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) =>
  ({
    svg: {
      height: theme.spacing(10),
      width: theme.spacing(10),
      transform: 'rotate(-90deg)',
    },

    circle: {
      cx: theme.spacing(5),
      cy: theme.spacing(5),
      fill: 'transparent',
      stroke: theme.palette.background.paper,
    },

    central: {
      fill: theme.palette.grey[300],
    },

    middle: {
      stroke: theme.palette.grey[300],
      strokeWidth: 2,
      strokeDasharray: '2, 2',
    },

    filled: {
      strokeWidth: 6,
    },

    dashed: {
      strokeDasharray: '1, 2',
      strokeWidth: 3,
    },

    dot: {
      strokeLinecap: 'round',
      strokeWidth: 8,
    },

    primary: {
      stroke: theme.palette.primary.main,
    },

    secondary: {
      stroke: theme.palette.info.light,
    }
  }));

type Props = {
  value: number,
  color: 'primary' | 'secondary',
}

export function CircularDashedProgress(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { value, color } = props;
  const length = 2 * Math.PI * 36;
  const offset = length * value / 100;
  const colorClass = color === 'primary' ? classes.primary : classes.secondary;
  return (
    <svg className={classes.svg}>
      <circle r="24" className={cx(classes.circle, classes.central)}/>
      <circle r="30" className={cx(classes.circle, classes.middle)}/>
      <circle r="35" className={cx(classes.circle, classes.dashed, colorClass)}/>
      <circle r="36" strokeDasharray={`${length} ${length}`} strokeDashoffset={offset} className={cx(classes.circle, classes.filled)}/>
      {value < 100 && (
        <circle
          r="35"
          strokeDasharray={`0.1 ${2 * Math.PI * 35}`}
          strokeDashoffset={offset}
          className={cx(classes.circle, classes.dot, colorClass)}
        />
      )}
    </svg>
  );
}
