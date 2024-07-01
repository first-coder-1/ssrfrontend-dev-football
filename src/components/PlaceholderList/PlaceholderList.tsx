import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Skeleton from '@mui/material/Skeleton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const useStyles = makeStyles<{ size: number }>()((_, {size}) =>
  ({
    item: {
      height: size
    },

    skeleton: {
      height: size
    }
  }));

type Props = {
  size: number,
  length?: number,
  className?: string,
}

const DEFAULT_LENGTH = 10;

export function PlaceholderList(props: Props): React.ReactElement {
  const { size, length, className } = props;
  const { classes, cx } = useStyles({ size });
  return (
    <List disablePadding>
      {[...Array(length || DEFAULT_LENGTH).keys()].map((val) => (
        <ListItem key={`skeleton_${val}`} divider className={cx(className, classes.item)}>
          <ListItemText>
            <Skeleton width="100%" animation="wave" className={classes.skeleton}/>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default PlaceholderList;
