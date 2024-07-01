import React from 'react';
import { withStyles } from 'tss-react/mui';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LeftBar = withStyles(LinearProgress, (theme) =>
  ({
    root: {
      height: 8,
      flexGrow: 1,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
    },
    colorPrimary: {
      backgroundColor: theme.palette.secondary.main,
    },
    bar: {
      backgroundColor: theme.palette.action.active,
    },
  }));

const RightBar = withStyles(LinearProgress, (theme) =>
  ({
    root: {
      height: 8,
      flexGrow: 1,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    colorPrimary: {
      backgroundColor: theme.palette.action.active,
    },
    bar: {
      backgroundColor: theme.palette.primary.main,
    },
  }));

type Props = {
  title: string,
  local: number,
  visitor: number,
  percentage?: boolean,
}

export function Bar(props: Props): React.ReactElement {
  const { title, local, visitor, percentage } = props;
  const total = local + visitor;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="h5">{Math.round(local)}{percentage && '%'}</Typography>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h5">{Math.round(visitor)}{percentage && '%'}</Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <LeftBar variant="determinate" value={100 - (total ? Math.ceil(local / total * 100) : 0)}/>
        <RightBar variant="determinate" value={total ? Math.ceil(visitor / total * 100) : 0}/>
      </Box>
    </>
  );
}
