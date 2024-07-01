import { withStyles } from 'tss-react/mui';
import Tab from '@mui/material/Tab';

export const GroupTab = withStyles(Tab, (theme) =>
  ({
    root: {
      minWidth: 50,
      height: 50,
      backgroundColor: theme.palette.grey[300],
      borderRightColor: theme.palette.grey[500],
    },
    textColorSecondary: {
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
  }));
