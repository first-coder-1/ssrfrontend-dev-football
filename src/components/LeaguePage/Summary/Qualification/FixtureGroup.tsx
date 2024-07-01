import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import { TeamSeasonDoubleFixture } from '../../../../api';
import Fixture from './Fixture';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      position: 'relative',
      flex: '1 0 140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      marginTop: 8,
      marginBottom: 8,
    },

    padding: {
      paddingRight: theme.spacing(5),
    },

    separator: {
      position: 'absolute',
      height: '50%',
      right: 0,
      width: theme.spacing(5),
      '& :nth-of-type(2n+1)': {
        borderRight: `1px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 200 : 600]}`,
      },
      '& :nth-of-type(1)': {
        borderTop: `1px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 200 : 600]}`,
      },
      '& :nth-of-type(2), & :nth-of-type(3)': {
        borderBottom: `1px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 200 : 600]}`,
      },
    }
  }));

type Props = {
  fixtures: Array<TeamSeasonDoubleFixture | undefined>,
  treeMode?: boolean,
}

export function FixtureGroup(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { fixtures, treeMode } = props;
  return (
    <div className={cx(classes.root, { [classes.padding]: treeMode })}>
      {fixtures.map((fixture, i) => (
        <Fixture key={fixture?._id || i} fixture={fixture} treeMode={treeMode}/>
      ))}
      {treeMode && fixtures.length > 1 &&
      <Grid container className={classes.separator}>
          <Grid item xs={6}/>
          <Grid item xs={6}/>
          <Grid item xs={6}/>
          <Grid item xs={6}/>
      </Grid>
      }
    </div>
  );
}
