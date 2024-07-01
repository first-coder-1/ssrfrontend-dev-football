import { withStyles } from 'tss-react/mui';
import LinearProgress from '@mui/material/LinearProgress';

export default withStyles(LinearProgress, (theme) =>
  ({
    root: {
      height: theme.spacing(1),
      borderRadius: 6,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 500],
    },
    bar: {
      borderRadius: 6,
    },
  }));
