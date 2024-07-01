import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const useStyles = makeStyles()((theme) =>
  ({
    square: {
      height: 4,
      width: 4,
      marginRight: 6,
      backgroundColor: theme.palette.primary.main,
    }
  }));

export function Subtitle(props: React.PropsWithChildren<{}>): React.ReactElement {
  const { classes } = useStyles();
  return (
    <Box sx={{ height: 40, display: 'flex', alignItems: 'center' }}>
      <span className={classes.square}/>
      <Typography variant="h5">
        {props.children}
      </Typography>
    </Box>
  );
}
