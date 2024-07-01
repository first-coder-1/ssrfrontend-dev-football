import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },

    dot: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[600],
      marginLeft: 2,
      marginRight: 2,
    }
  }));

export function Dots(): React.ReactElement {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.dot}/>
      <div className={classes.dot}/>
      <div className={classes.dot}/>
    </div>
  );
}
