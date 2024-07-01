import React from 'react';
import { makeStyles } from 'tss-react/mui';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useIntl } from '@/hooks/useIntl';

const useStyles = makeStyles()((theme) =>
  ({
    strength: {
      fontWeight: theme.typography.fontWeightMedium,
    },

    weak: {
      color: theme.palette.error.main,
    },

    medium: {
      color: theme.palette.warning.main,
    },

    strong: {
      color: theme.palette.success.main,
    }
  }));

type Props = {
  password: string,
}

export function PasswordStrength(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { password } = props;
  if (password.length === 0) {
    return null;
  }
  const strength = password.length < 4 ? 'weak' : (password.length < 8 ? 'medium' : 'strong');
  return (
    <FormControl fullWidth>
      <FormLabel color="secondary">
        <Typography component="span">{intl.get('auth.password-strength')}:</Typography>
        &nbsp;
        <Typography component="span" className={cx(classes.strength, classes[strength])}>
          {intl.get(`auth.password-${strength}`)}
        </Typography>
      </FormLabel>
    </FormControl>
  );
}

export default PasswordStrength;
