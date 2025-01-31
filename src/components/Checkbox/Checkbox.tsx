import React from 'react';
import { makeStyles } from 'tss-react/mui';
import CheckboxComponent, { CheckboxProps } from '@mui/material/Checkbox';

const useStyles = makeStyles<void, 'root'>()((theme, _params, classes) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: `inset 0 0 0 1px ${theme.palette.mode === 'dark' ? theme.palette.grey[200] : 'rgba(16,22,26,.2)'}, inset 0 -1px 0 ${theme.palette.mode === 'dark' ? theme.palette.grey[200] : 'rgba(16,22,26,.1)'}`,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
    [`.${classes.root}.Mui-focusVisible &`]: {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:disabled ~ &': {
      background: theme.palette.grey[700],
    },
  },
  checkedIcon: {
    backgroundColor: theme.palette.primary.main,
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export function Checkbox(props: CheckboxProps) {
  const { classes, cx } = useStyles();

  return (
    <CheckboxComponent
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={cx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
}

export default Checkbox;
