import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ActiveSeason, TeamSeasonFixture } from '@/api';
import SeasonFixtureTeam from './SeasonFixtureTeam';
// import {useParams} from "react-router";
import { slugify } from '@/utils';
import LeagueImage from '@/components/LeagueImage';
import { useMst } from '@/store';
import { observer } from 'mobx-react-lite';
import NavLink from '@/components/shared/NavLink/NavLink';

const useStyles = makeStyles()((theme) =>
  ({
    league: {
      width: theme.spacing(38.5),
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(35),
      },
    },

    leagueName: {
      fontWeight: theme.typography.fontWeightMedium,
    }
  }));

type Props = {
  season?: ActiveSeason,
  fixtures: TeamSeasonFixture[],
  teamId: number,
}

export function FixtureList(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { season, fixtures, teamId } = props;
  const { settings } = useMst();
  return (
    <>
      {season &&
        <Link color="secondary" component={NavLink} to={`/soccer/leagues/${slugify(season.league.name)}/${season.league.id}/summary`}>
            <Box sx={{ display: 'flex', pt: 2, pb: 2, alignItems: 'center' }} className={classes.league}>
                <LeagueImage
                    url={season.league.logo_path}
                    name={(!settings.originalNames && season.league.name_loc) || season.league.name}
                    variant="22x22"
                />
                <Typography className={classes.leagueName}>
                  {`${((!settings.originalNames && season.league.name_loc) || season.league.name)} (${(season.name)})`}
                </Typography>
            </Box>
        </Link>
      }
      {fixtures.map(fixture => (
        <SeasonFixtureTeam key={fixture._id} fixture={fixture} teamId={teamId} />
      ))}
    </>
  );
}

export default observer(FixtureList);
