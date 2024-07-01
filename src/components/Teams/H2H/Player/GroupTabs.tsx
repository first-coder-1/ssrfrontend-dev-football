import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Team } from '../../../../api';
import TeamImage from '../../../../components/TeamImage';
import { useMst } from '../../../../store';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles()((theme) =>
  ({
    indicator: {
      display: 'none',
    },

    tab: {
      '&.MuiTab-root, &.MuiTab-root.Mui-selected': {
        boxShadow: `inset 0px -1px 0px ${theme.palette.grey[500]}`,
        height: theme.spacing(7.5),
        [theme.breakpoints.up('md')]: {
          pointerEvents: 'none',
        },
        [theme.breakpoints.down('md')]: {
          '& .MuiTab-wrapper': {
            opacity: 0.3,
          },
          '&.Mui-selected .MuiTab-wrapper': {
            opacity: 1,
          },
        },
      },
    },

    tabContent: {
      display: 'flex',
      alignItems: 'center',
    },

    text: {
      opacity: 1,
    }
  }));

export enum ContainerSide {
  LEFT = 'left',
  RIGHT = 'right',
}

type Props = {
  activeSide: ContainerSide,
  setActiveSide: (side: ContainerSide) => void,
  leftTeam: Team,
  rightTeam: Team,
}

export function GroupTabs(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { leftTeam, rightTeam, activeSide, setActiveSide } = props;
  const { settings } = useMst();
  return (
    <Tabs
      value={activeSide}
      onChange={(_, value) => setActiveSide(value)}
      variant="fullWidth"
      classes={{ indicator: classes.indicator }}
    >
      <Tab
        label={(
          <Box className={classes.tabContent}>
            <TeamImage
              url={leftTeam.logo_path}
              name={(!settings.originalNames && leftTeam.name_loc) || leftTeam.name}
              variant="24x"
            />
            <Typography variant="h5">{(!settings.originalNames && leftTeam.name_loc) || leftTeam.name}</Typography>
          </Box>
        )}
        value={ContainerSide.LEFT}
        className={classes.tab}
        classes={{ textColorInherit: classes.text }}
      />
      <Tab
        label={(
          <Box className={classes.tabContent}>
            <TeamImage
              url={rightTeam.logo_path}
              name={(!settings.originalNames && rightTeam.name_loc) || rightTeam.name}
              variant="24x"
            />
            <Typography variant="h5">{(!settings.originalNames && rightTeam.name_loc) || rightTeam.name}</Typography>
          </Box>
        )}
        value={ContainerSide.RIGHT}
        className={classes.tab}
        classes={{ textColorInherit: classes.text }}
      />
    </Tabs>
  );
}

export default observer(GroupTabs);
