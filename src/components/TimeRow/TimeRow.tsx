import React from 'react';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { EventType, FixtureEvent } from '../../api';
import { score, slugify } from '../../utils';
import ReplyIcon from '../icons/ReplyIcon';
import SoccerIcon from '../icons/SoccerIcon';
import PenaltyCard from '../PenaltyCard';
import NavLink from '../shared/NavLink/NavLink';

const useStyles = makeStyles()((theme) =>
  ({
    player: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },

    score: {
      minWidth: theme.spacing(4),
      margin: theme.spacing(0, 2),
      textAlign: 'center',
    }
  }));

type Props = {
  event: FixtureEvent,
  localteamId: number,
  visitorteamId: number,
  color: 'primary' | 'secondary' | 'action',
}

function TimeRow(props: React.PropsWithChildren<Props>) {
  const { classes } = useStyles();
  const { event, color, localteamId, visitorteamId, children } = props;
  // const { locale } = useParams();
  let icon: React.ReactElement | null = null;
  switch (event.type) {
    case EventType.GOAL:
    case EventType.OWN_GOAL:
    case EventType.PENALTY:
      icon = <SoccerIcon color={color} viewBox="0 0 18 18"/>;
      break;
    case EventType.RED_CARD:
    case EventType.YELLOW_CARD:
      icon = (
        <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>
          <PenaltyCard red={event.type === EventType.RED_CARD}/>
        </Box>
      );
      break;
    case EventType.SUBSTITUTION:
      icon = <ReplyIcon color="action"/>;
      break;
  }
  return (
    <Box
      key={event.id}
      id={`event_${event.id}`}
      sx={{ display: 'flex', mt: 1, mb: 1, alignItems: 'center', justifyContent: 'stretch', width: '100%' }}
    >
      <Box sx={{ display: 'flex', flex: '1 0 0%', alignItems: 'center', justifyContent: 'flex-end' }}>
        {localteamId === Number(event.team_id) && (
          <>
            <Tooltip
              title={event.related_player_name || ''}
              arrow
              placement="bottom-end"
              disableHoverListener={event.type !== EventType.SUBSTITUTION}
            >
              <>
                {children}
                {' '}
                <Typography
                  align="center"
                  className={classes.player}
                  component={NavLink}
                  to={event.player_name && event.player_id ?
                    `/soccer/players/${slugify(event.player_name)}/${event.player_id}/summary` :
                    `/soccer/players`
                  }
                >
                  {`${event.player_name ? event.player_name : ''} ${event.minute + (event.extra_minute || 0)}`}
                </Typography>
              </>
            </Tooltip>
            {' '}
            {icon}
          </>
        )}
      </Box>
      <Typography component="span" className={classes.score}>{score(event.result) || '-'}</Typography>
      <Box sx={{ display: 'flex', flex: '1 0 0%', alignItems: 'center', justifyContent: 'flex-start' }}>
        {visitorteamId === Number(event.team_id) && (
          <>
            {icon}
            {' '}
            <Tooltip
              title={event.related_player_name || ''}
              arrow
              placement="bottom-end"
              disableHoverListener={event.type !== EventType.SUBSTITUTION}
            >
              <>
                <Typography
                  align="center"
                  className={classes.player}
                  component={NavLink}
                  to={event.player_name && event.player_id ?
                    `/soccer/players/${slugify(event.player_name)}/${event.player_id}/summary` :
                    `/soccer/players`
                  }
                >
                  {`${event.player_name ? event.player_name : ''} ${event.minute + (event.extra_minute || 0)}`}
                </Typography>
                {' '}
                {children}
              </>
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
}

export default TimeRow;
