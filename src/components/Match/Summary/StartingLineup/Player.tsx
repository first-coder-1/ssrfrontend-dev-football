import React from 'react';
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import PenaltyCard from '../../../../components/PenaltyCard';
import SoccerIcon  from '../../../../components/icons/SoccerIcon';
import { EventType, FixtureEvent, Lineup } from '../../../../api';
import { Uniform } from './Uniform';
import { Substitution } from './Substitution';
import { slugify } from '../../../../utils';
import { useMst } from '../../../../store';
import { observer } from 'mobx-react-lite';
import NavLink from '@/components/shared/NavLink';
import { useIntl } from '@/hooks/useIntl';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      height: '20%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      [theme.breakpoints.down('md')]: {
        transform: 'scale(0.9)',
      },
      [theme.breakpoints.down('sm')]: {
        transform: 'scale(0.9)',
      },
    },

    stats: {
      display: 'flex',
      justifyContent: 'space-around',
      width: theme.spacing(10),
    },

    events: {
      display: 'flex',
      justifyContent: 'flex-end',
    },

    stat: {
      margin: `0 2px`,
    },

    name: {
      textAlign: 'center',
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.primary.contrastText,
    }
  }));

type Props = {
  lineup: Lineup,
  teamColor: string,
  events: FixtureEvent[],
}

const eventsTypes = [EventType.GOAL, EventType.PENALTY, EventType.YELLOW_CARD, EventType.RED_CARD];

export function Player(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const {lineup, teamColor, events} = props;
  const { settings } = useMst();
  const substitution = events.find(event => event.related_player_id === lineup.player_id && event.type === EventType.SUBSTITUTION);
  // const { locale } = useParams();
  return (
    <Box className={classes.root}>
      <Box className={classes.stats}>
        <Box title={substitution?.player_name || ''} className={classes.stat}>
          {substitution && <Substitution/>}
        </Box>
        <Box className={classes.events}>
          {events
            .filter(event => event.player_id === lineup.player_id && eventsTypes.includes(event.type))
            .map(event => {
              switch (event.type) {
                case EventType.YELLOW_CARD:
                  return (
                    <Box key={event.id} className={classes.stat}>
                      <PenaltyCard/>
                    </Box>
                  );
                case EventType.RED_CARD:
                  return (
                    <Box key={event.id} className={classes.stat}>
                      <PenaltyCard red/>
                    </Box>
                  );
                default:
                  return (
                    <Box key={event.id} className={classes.stat}>
                      <SoccerIcon fontSize="small" viewBox="0 0 16 16"/>
                    </Box>
                  );
              }
            })
          }
        </Box>
      </Box>
      <Uniform number={lineup.number} teamColor={teamColor}/>
      <Link
        color="inherit"
        component={NavLink}
        to={`/soccer/players/${slugify(lineup.player_name)}/${lineup.player_id}/summary`}
        className={classes.name}
      >
        {lineup.captain && intl.get('match.captain-short') + ' '}
        {(!settings.originalNames && lineup.player_name_loc) || lineup.player_name}
      </Link>
    </Box>
  );
}

export default observer(Player);
