import React from 'react';
import { makeStyles } from 'tss-react/mui';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

const useStyles = makeStyles()((theme) =>
  ({
    box: {
      height: theme.spacing(8),
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
      },
    },

    scroller: {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },

    appBar: {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    }
  }));

type Props = {
  header?: React.ReactNode,
  footer?: React.ReactNode,
  active: number,
}

export function TabbedHeader(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes } = useStyles();
  return (
    <AppBar position="sticky" color="secondary" elevation={0} className={classes.appBar}>
      <Paper>
        <Box sx={{ pl: 3, pr: 3, display: 'flex', alignItems: 'center' }} className={classes.box}>
          {props.header}
        </Box>
        <Tabs
          value={props.active}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          classes={ props.footer ? {} : { scroller: classes.scroller }}
        >
          {props.children}
        </Tabs>
        {props.footer}
      </Paper>
    </AppBar>
  );
}

export default TabbedHeader;
