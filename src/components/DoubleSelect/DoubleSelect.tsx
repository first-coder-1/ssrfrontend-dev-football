import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) =>
  ({
    selects: {
      display: 'flex',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },

    select: {
      flex: '0 0 50%',
      height: 50,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      boxShadow: `inset 0px -4px 0px ${theme.palette.primary.main}`,
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },

    left: {
      '&:after': {
        content: '""',
        position: 'absolute',
        backgroundColor: theme.palette.grey[500],
        [theme.breakpoints.up('md')]: {
          right: 0,
          width: 1,
          height: '70%',
        },
        [theme.breakpoints.down('md')]: {
          bottom: 0,
          width: '94%',
          height: 1,
        },
      },
      [theme.breakpoints.up('md')]: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      [theme.breakpoints.down('md')]: {
        boxShadow: 'none',
      },
    },

    right: {
      [theme.breakpoints.up('md')]: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
    }
  }));

type Props = {
  children: (containerClassName: string, leftClassName: string, rightClassName: string) => React.ReactElement,
}

export function DoubleSelect(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  return props.children(classes.selects, cx(classes.select, classes.left), cx(classes.select, classes.right));
}

export default DoubleSelect;
