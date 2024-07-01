import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';

const useStyles = makeStyles()(() =>
  ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
    }
  }));

export function Formation(props: React.PropsWithChildren<{}>): React.ReactElement {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      {props.children}
    </Box>
  );
}
