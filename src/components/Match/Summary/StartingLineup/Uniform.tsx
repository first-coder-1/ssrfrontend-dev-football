import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import { invertHexColor } from '@/utils';

const useStyles = makeStyles<{ color: string }>()((theme, {color}) =>
  ({
    root: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
    },

    number: {
      position: 'absolute',
      top: 11,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.getContrastText(color),
      textAlign: 'center',
    }
  }));

type Props = {
  number: string | number | null,
  teamColor: string,
}

export function Uniform(props: Props): React.ReactElement {
  const { number, teamColor } = props;
  const rectColor = invertHexColor(teamColor);
  const { classes } = useStyles({ color: rectColor });
  return (
    <Box className={classes.root}>
      <svg width="45" height="37" viewBox="0 0 45 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.00006 7.47703C7.61406 3.9253 13.2603 4.28454 18.8518 1.22436C21.8511 1.88346 24.0842 1.62 26.1483 1.15332C32.4815 4.07766 38.0496 4.54671 44 7.54805C43.5054 10.682 42.4163 13.3902 40.5997 15.5771C38.3957 14.3923 36.3104 13.9215 34.295 13.8718L34.1533 35.1879C25.4703 36.8099 18.1111 36.1091 10.9175 35.1168L10.8467 13.9428C8.31365 13.869 6.38651 14.8079 4.40026 15.6481C2.48991 13.0357 1.59739 10.2774 1 7.47699L1.00006 7.47703Z" fill={teamColor} stroke="black"/>
        <path d="M2 7.15332C2.65004 10.083 3.78559 12.8189 6 15.1533" stroke="black"/>
        <path d="M11 34.2179C18.6668 35.3525 26.3332 35.5962 34 34.1533" stroke="black"/>
        <path d="M19.0043 1.15332C18.9469 1.84784 19.4299 4.95738 22.4973 5.14649C25.4989 5.33147 26.0871 1.70004 25.9903 1.23189" stroke="black"/>
        <path d="M17.0022 2.34675C16.9358 2.91883 18.3346 6.06565 22.3458 6.15178C26.4331 6.23965 28.1071 2.53894 27.9947 2.15332" stroke="black"/>
        <path d="M11.0672 4.15332C11.7272 6.94747 12.8194 10.2273 11 14.1533" stroke="black"/>
        <path d="M19 2.27331C21.3606 3.60087 23.4464 3.31613 26 2.15332" stroke="black"/>
        <path d="M33.9328 4.15332C33.2728 6.94746 32.1806 10.2273 34 14.1533" stroke="black"/>
        <path d="M43 7.15332C42.5125 10.083 41.6608 12.8189 40 15.1533" stroke="black"/>
        <rect x="14" y="10.1533" width="18" height="17" rx="8.5" fill={rectColor} stroke="white"/>
      </svg>
      {number !== null &&
      <span className={classes.number}>
        {number}
      </span>
      }
    </Box>
  );
}
