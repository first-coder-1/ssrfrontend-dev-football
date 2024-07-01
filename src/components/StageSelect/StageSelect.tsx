import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '../icons/EditIcon';
import { Stage } from '../../api';
import Select from '../Select';

const useStyles = makeStyles()((theme) =>
  ({
    box: {
      display: 'flex',
      alignItems: 'center',
    },

    icon: {
      marginLeft: theme.spacing(1),
    }
  }));

type Props = {
  stages: Stage[],
  activeStage?: Stage,
  setActiveStage: (stage: Stage) => void,
  hideIcon?: boolean,
}

export function StageSelect(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { stages, activeStage, setActiveStage, hideIcon } = props;
  return (
    <Select
      label={(
        <Box className={classes.box}>
          {activeStage?.name}
          {!hideIcon && <EditIcon color="primary" fontSize="small" className={classes.icon}/>}
        </Box>
      )}
    >
      {onClose => stages.map(stage => (
        <MenuItem
          key={stage._id}
          selected={activeStage?._id === stage._id}
          disabled={!stage.has_fixtures}
          onClick={() => {
            setActiveStage(stage);
            onClose();
          }}
        >
          <ListItemText primary={stage.name}/>
        </MenuItem>
      ))}
    </Select>
  );
}

export default StageSelect;
