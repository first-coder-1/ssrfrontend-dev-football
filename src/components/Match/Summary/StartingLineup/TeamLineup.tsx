import React, { useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import { FixtureEvent, Lineups } from '../../../../api';
import { Formation } from './Formation';
import Player from './Player';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      width: '48%',
      display: 'flex',
      justifyContent: 'space-around',
      [theme.breakpoints.down('md')]: {
        width: '50%',
        transform: 'scale(0.9)',
      },
    },

    visitor: {
      flexDirection: 'row-reverse',
    }
  }));

type Props = {
  teamId: number,
  teamColor: string,
  lineups: Lineups,
  formation: string,
  events: FixtureEvent[],
}

export function TeamLineup(props: Props): React.ReactElement {
  const { teamId, teamColor, lineups, formation, events } = props;
  const { classes, cx } = useStyles();
  const className = cx(classes.root, { [classes.visitor]: lineups.visitorteam_id === teamId });
  const formations = useMemo(() => {
    const lineup = lineups.lineup.filter(lineup => lineup.team_id === teamId);
    const goalkeeper = lineup.findIndex(lineup => lineup.position === 'G');
    return [
      goalkeeper !== -1 ? [...lineup.splice(goalkeeper, 1)] : [],
      ...formation.split('-').map(parseFloat).map(num => lineup.splice(0, num)),
    ];
  }, [teamId, lineups, formation]);

  return (
    <Box className={className}>
      {formations.map((formation, i) => (
        <Formation key={i}>
          {formation.map(lineup => (
            <Player key={lineup.player_id} lineup={lineup} teamColor={teamColor} events={events}/>
          ))}
        </Formation>
      ))}
    </Box>
  );
}
