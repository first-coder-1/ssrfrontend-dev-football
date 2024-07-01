import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { TeamSeasonDoubleFixture } from '../../../../api';
import { sum } from '../../../../utils/number';
import { FixtureTeam } from './FixtureTeam';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../../store';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      height: 60,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: theme.palette.background.paper,
      boxShadow: `inset -3px 0px 0px ${theme.palette.grey[theme.palette.mode === 'dark' ? 200 : 600]}`,
      padding: theme.spacing(1, 2),
      margin: theme.spacing(1),
    },

    active: {
      boxShadow: `inset -3px 0px 0px ${theme.palette.primary.main}`,
    },

    treeMode: {
      margin: 0,
    }
  }));

type Props = {
  fixture: TeamSeasonDoubleFixture | undefined,
  treeMode?: boolean,
}

export function Fixture(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { fixture, treeMode } = props;
  const { settings } = useMst();
  if (!fixture) {
    return <div className={classes.root}/>;
  }
  const localSum = sum(fixture.localteam_scores);
  const visitorSum = sum(fixture.visitorteam_scores);
  return (
    <div className={cx(classes.root, classes.active, { [classes.treeMode]: treeMode })}>
      <FixtureTeam 
        logoPath={fixture.localteam_logo_path} 
        name={(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
        scores={fixture.localteam_scores}
        winner={localSum > visitorSum}
      />
      <FixtureTeam 
        logoPath={fixture.visitorteam_logo_path} 
        name={(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
        scores={fixture.visitorteam_scores}
        winner={visitorSum > localSum}
      />
    </div>
  );
}

export default observer(Fixture);
