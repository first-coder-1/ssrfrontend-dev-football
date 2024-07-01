import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[500],
    }
  }));

type Props = {
  className?: string,
}

export function Circle(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.root, props.className)}/>;
}

export default Circle;
