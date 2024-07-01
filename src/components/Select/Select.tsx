import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import SortIcon  from '../icons/SortIcon';

const useStyles = makeStyles()(theme =>
  ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },

    rootMargin: {
        margin: theme.spacing(0, 1.5)
    },

    paper: {
      width: 'auto',
      padding: theme.spacing(0.5),
    },

    list: {
      maxHeight: theme.spacing(33),
    },

    icon: {
      verticalAlign: 'sub',
    }
  }));

type Props = {
  label: React.ReactNode,
  className?: string,
  children: (onClose: () => void) => React.ReactNode,
  startIcon?: React.ReactNode,
  enableMargin?: boolean,
}

export function Select({ className, label, children, startIcon, enableMargin }: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };
  return <>
    <Button
      color="secondary"
      onClick={onClick}
      startIcon={startIcon}
      endIcon={<SortIcon color="action" className={classes.icon}/>}
      className={cx(classes.root, enableMargin && classes.rootMargin, className)}
    >
      {label}
    </Button>

    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={anchorEl}
      keepMounted={false}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ className: classes.paper }}
      MenuListProps={{ className: classes.list }}
    >
      {children(onClose)}
    </Menu>
  </>;
}

export default Select;
