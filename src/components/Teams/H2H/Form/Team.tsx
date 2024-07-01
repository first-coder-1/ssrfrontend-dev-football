import React from 'react';
import { observer } from 'mobx-react-lite';
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteSwitch from '@/components/FavoriteSwitch';
import { ReducedTeam } from '../../../../api';
import TeamImage from '../../../../components/TeamImage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FavoritesStore, useMst } from '../../../../store';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: '0 0 200px',
      height: 260,
      [theme.breakpoints.down('md')]: {
        flex: '0 0 135px',
        height: 200,
      },
    }
  }));

type Props = {
  team: ReducedTeam | null,
  favorites: FavoritesStore,
  checked?: boolean,
  className?: string,
}

export function Team(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { team, favorites, checked, className } = props;
  const { settings } = useMst();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <Box className={cx(classes.root, className)}>
      {team &&
      <>
          <TeamImage
              url={team.logo_path}
              name={(!settings.originalNames && team.name_loc) || team.name}
              variant={isMobile ? '100x' : '150x'}
          />
          <Typography variant="h4">{(!settings.originalNames && team.name_loc) || team.name}</Typography>
          <FavoriteSwitch
              checked={checked}
              onChange={(e) => {
                e.stopPropagation();
                if (checked) {
                  favorites.removeFavoriteTeam(team._id);
                } else {
                  favorites.addFavoriteTeam(team._id);
                }
              }}
          />
      </>
      }
    </Box>
  );
}

export default observer(Team);
