import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ODDS_FORMAT } from '../../api';
import { useIntl } from '@/hooks/useIntl';

const useStyles = makeStyles()((theme) =>
  ({
    text: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(2.5),
    },

    odds: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        justifyContent: 'space-between',
      },
    },

    button: {
      minWidth: theme.spacing(5),
      padding: theme.spacing(0.5, 1.5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5, 2),
      },
    }
  }));

type Props = {
  format: ODDS_FORMAT,
  onChange: (oddsFormat: ODDS_FORMAT) => void,
}

export function OddsFormatSwitch(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { format, onChange } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'stretch' : 'flex-end',
        marginRight: 1,
      }}
    >
      <Typography variant="body1" color="textSecondary" className={classes.text}>{intl.get('fixtures.switch-odds')}:</Typography>
      <Box sx={{ display: 'flex' }} className={classes.odds}>
        {Object.values(ODDS_FORMAT).map((oddsFormat) => (
          <Button
            key={oddsFormat}
            className={classes.button}
            color={oddsFormat === format ? 'primary' : 'secondary'}
            onClick={() => onChange(oddsFormat)}
          >
            {oddsFormat}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default OddsFormatSwitch;
