import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import { TeamSeasonDoubleFixture } from '../../../../api';
import { FixtureGroup } from './FixtureGroup';
import Fixture from './Fixture';

const useStyles = makeStyles()(() =>
  ({
    root: {
      flexDirection: 'column',
    },

    treeMode: {
      justifyContent: 'space-around',
    }
  }));

type Props = {
  fixtures: Array<TeamSeasonDoubleFixture | undefined>,
  treeMode?: boolean,
}

function reducer(groups: Array<Array<TeamSeasonDoubleFixture | undefined>>, fixture: TeamSeasonDoubleFixture | undefined)  {
  const group = groups[groups.length - 1];
  if (group && group.length < 2) {
    group.push(fixture);
  } else {
    groups.push([fixture]);
  }
  return groups;
}

export function Stage(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { fixtures, treeMode } = props;
  return (
    <Grid container item xs={12} md={4} className={cx(classes.root, { [classes.treeMode]: treeMode })}>
      {treeMode ?
        fixtures.reduce<Array<Array<TeamSeasonDoubleFixture | undefined>>>(reducer, []).map((group, i) => (
          <FixtureGroup key={i} fixtures={group} treeMode={treeMode}/>
        ))
        :
        fixtures.filter(fixture => fixture).map((fixture) => (
          <Fixture key={fixture?._id} fixture={fixture}/>
        ))
      }
    </Grid>
  );
}
