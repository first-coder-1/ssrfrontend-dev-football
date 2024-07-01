import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const useStyles = makeStyles()((theme) =>
  ({
    title: {
      color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800],
      margin: theme.spacing(1, 0),
      textAlign: 'center',
    }
  }));

type Props = {
  title: string,
}

export function SingleTime(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { classes } = useStyles();
  const { title, children } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1" className={classes.title}>{title}</Typography>
      {children}
    </Box>
  );
}

export default SingleTime;
