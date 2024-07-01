import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import TeamImage from '../../../../components/TeamImage';
import { MyTeam } from '../../../../api';
import { useMst } from '../../../../store';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      display: 'flex',
      alignItems: 'center',
    },

    name: {
      ...theme.textOverflow,
    }
  }));

type Props = {
  team: MyTeam,
}

export function Team(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { team } = props;
  const { settings } = useMst();
  return (
    <div className={classes.root}>
      <TeamImage
        url={team.logo_path}
        name={(!settings.originalNames && team.name_loc) || team.name}
        variant="28x"
      />
      <Typography className={classes.name}>
        {(!settings.originalNames && team.name_loc) || team.name}
      </Typography>
    </div>
  );
}

export default observer(Team);
