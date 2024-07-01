import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const useStyles = makeStyles()((theme) =>
  ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(8),
      },
    },

    form: {
      marginTop: theme.spacing(1),
      maxWidth: theme.spacing(50),
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
    },

    error: {
      marginTop: theme.spacing(2),
    }
  }));

type Props = {
  title: string,
  lastError?: string,
  onSubmit: () => void,
}

export function BaseTemplate(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes } = useStyles();
  const { title, lastError, onSubmit, children } = props;
  return (
    <div className={classes.paper}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }} component={Paper}>
        <Typography variant="h1">
          {title}
        </Typography>
        {lastError && <Typography color="error" className={classes.error}>{lastError}</Typography>}
        <form
          className={classes.form}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
        </form>
      </Box>
    </div>
  );
}
