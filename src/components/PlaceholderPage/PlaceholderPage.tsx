import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PlaceholderList from '../PlaceholderList';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginTop: 30
    },

    tabs: {
      [theme.breakpoints.down('md')]: {
        height: 48,
      },
    },

    bottom: {
        marginTop: theme.spacing(4)
    }
  }));

type Props = {
  tabFooter?: React.ReactElement,
}

export function PlaceholderPage(props: Props): React.ReactElement {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Paper>
        <PlaceholderList size={64} length={1}/>
        <PlaceholderList size={68} length={1} className={classes.tabs}/>
        {props.tabFooter}
      </Paper>
      <div className={classes.bottom}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={9}>
            <Paper>
              <PlaceholderList size={50}/>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Paper>
              <PlaceholderList size={50}/>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PlaceholderPage;
