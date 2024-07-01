import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles<void, 'yellow' | 'red'>()((theme, _params, classes) => ({
  root: {
    width: 11,
    height: 14,
    borderRadius: 2,
    textAlign: 'center',
    [`&.${classes.yellow}`]: {
      color: theme.palette.grey[800],
    },
    [`&.${classes.red}`]: {
      color: 'white',
    },
  },
  yellow: {
    backgroundColor: theme.palette.warning.main,
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}));

type Props = {
  red?: boolean,
  className?: string,
}

export function PenaltyCard(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes, cx } = useStyles();
  const { red, children } = props;
  const className = cx(
    props.className,
    classes.root,
    {
      [classes.yellow]: !red,
      [classes.red]: red
    }
  );
  return (
    <div className={className}>{children}</div>
  );
}

export default PenaltyCard;
