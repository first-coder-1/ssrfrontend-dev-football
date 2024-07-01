import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles()((theme) =>
  ({
    item: {
      padding: theme.spacing(2.5),
      '&:nth-of-type(4n), &:nth-of-type(4n-1)': {
        backgroundColor: theme.palette.grey[300],
      },
      [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '&:nth-of-type(odd)': {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(0.5),
        },
        '&:nth-of-type(even)': {
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(1),
        },
      },
    },

    title: {
      borderRight: `1px solid ${theme.palette.grey[400]}`,
    }
  }));

type Props = {
  title: string,
}

export function Row(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes, cx } = useStyles();
  const { title, children } = props;
  return <>
    <Grid item xs={12} md={4} className={cx(classes.item, classes.title)}>
      <Typography component="span">
        {title}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8} className={classes.item}>
      {children}
    </Grid>
  </>;
}
