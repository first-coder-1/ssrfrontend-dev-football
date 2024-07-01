import React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import HeartFullIcon from '../icons/HeartFullIcon';
import HeartIcon from '../icons/HeartIcon';

type Props = {
  checked?: boolean,
  onChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export function FavoriteSwitch(props: Props): React.ReactElement {
  const theme = useTheme();
  const { checked, onChange } = props;
  return (
    <IconButton onClick={onChange}>
      {checked ?
        <HeartFullIcon htmlColor={theme.palette.primary.main}/>
        :
        <HeartIcon/>
      }
    </IconButton>
  );
}

export default FavoriteSwitch;
