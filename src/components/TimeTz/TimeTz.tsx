import React from 'react';
import { observer } from 'mobx-react-lite';
import { differenceInCalendarDays, startOfToday } from 'date-fns';
import { makeStyles } from 'tss-react/mui';
import { useMst } from '../../store';
import { TimeFormat } from '../../api';
import { utcToZonedTime, format } from '@/utils/dateTz'

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      position: 'relative',
      whiteSpace: 'nowrap',
    },

    sup: {
      position: 'absolute',
      top: theme.spacing(-1),
      fontSize: '0.8em',
    }
  }));

type Props = {
  children: number,
  disableDiff?: boolean,
  timeFormat?: TimeFormat,
}

export function TimeTz(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { settings: { timeZone, timeFormat }} = useMst();
  const today = startOfToday();
  const zonedDate = utcToZonedTime(props.children * 1000, timeZone);
  const diff = differenceInCalendarDays(zonedDate, today);
  return (
    <span className={classes.root}>
      {format(zonedDate, props.timeFormat ?? timeFormat, { timeZone })}
      {!props.disableDiff && Math.abs(diff) === 1 && <span className={classes.sup}>{diff > 0 && '+'}{diff}</span>}
    </span>
  );
}

export default observer(TimeTz);
