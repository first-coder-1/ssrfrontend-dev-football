import React from 'react';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

export function Injury(props: React.PropsWithChildren<{}>): React.ReactElement {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SvgIcon viewBox="0 0 15 15" fontSize="small">
        <rect x="0.5" y="0.5" width="14" height="14" rx="1.5" fill="white" stroke="#D9E5EB"/>
        <path d="M6 4C6 3.44772 6.44772 3 7 3H8C8.55228 3 9 3.44772 9 4V11C9 11.5523 8.55228 12 8 12H7C6.44772 12 6 11.5523 6 11V4Z" fill="#FC7C5F"/>
        <path d="M4 9C3.44772 9 3 8.55228 3 8V7C3 6.44772 3.44772 6 4 6H11C11.5523 6 12 6.44772 12 7V8C12 8.55228 11.5523 9 11 9H4Z" fill="#FC7C5F"/>
      </SvgIcon>
      &nbsp;
      <Typography>{props.children}</Typography>
    </Box>
  );
}

export default Injury;
