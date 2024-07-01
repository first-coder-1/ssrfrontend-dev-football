import React from 'react'
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      position: 'sticky',
      top: 0,
      left: 'auto',
      right: 0,
      overflowX: 'hidden',
      zIndex: theme.zIndex.appBar + 1,
      width: theme.spacing(6),
    }
  }));

export function SideBarLoader() {
  const { classes } = useStyles();
  
  return (
	  <div className={classes.root}/>
  )
}

export default SideBarLoader
