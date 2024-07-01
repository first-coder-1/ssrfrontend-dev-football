import React from 'react';
// import { useParams } from 'react-router';
import { makeStyles } from 'tss-react/mui';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReducedTeam, StandingLetter } from '../../api';
import Standing from '../Standing';
import { slugify } from '../../utils';
import TeamImage from '../TeamImage';
import { useMst } from '../../store';
import { observer } from 'mobx-react-lite';
import NavLink from '../shared/NavLink/NavLink';

const useStyles = makeStyles<{ hasBackground?: boolean }>()((theme, {hasBackground}) =>
  ({
    name: {
      textAlign: 'center',
      [theme.breakpoints.up('md')]: {
        color: hasBackground ? theme.palette.primary.contrastText : (theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[600]),
        textShadow: hasBackground ? `${theme.palette.grey[900]} 1px 0 2px` : 'none',
      },
      [theme.breakpoints.down('md')]: {
        color: `${theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800]}`,
      },
    },

    winner: {
      fontWeight: theme.typography.fontWeightBold,
    }
  }));

type Props = {
  team: ReducedTeam,
  recentForm?: string,
  hasBackground?: boolean,
  size: 100 | 150,
  winner?: boolean,
}

export function MatchTeam(props: Props): React.ReactElement {
  const { team, recentForm, hasBackground, size, winner } = props;
  const { settings } = useMst();
  const { classes, cx } = useStyles({ hasBackground });
  // const { locale } = useParams();
  const teamLink = `/soccer/teams/${slugify(team.name)}/${team._id}/summary`;

  return (
    <Box sx={{ display: 'flex', flex: 0, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link component={NavLink} to={teamLink}>
        <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center' }}>
          <TeamImage
            url={team.logo_path}
            name={(!settings.originalNames && team.name_loc) || team.name}
            variant={`${size}x` as '100x' | '150x'}
          />
        </Box>
      </Link>
      <Typography variant="subtitle1" className={cx(classes.name, { [classes.winner]: winner })} component={NavLink} to={teamLink}>
        {(!settings.originalNames && team.name_loc) || team.name}
      </Typography>
      <Box sx={{ display: 'flex' }}>
        {recentForm && (recentForm.split('') as StandingLetter[]).slice(-5).map((value, i) => (
          <Standing key={`${value}-${i}`}>{value}</Standing>
        ))}
      </Box>
    </Box>
  );
}

export default observer(MatchTeam);
