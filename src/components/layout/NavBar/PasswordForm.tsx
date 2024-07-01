import React, { useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { setPassword } from '@/api';
import { AuthStore } from '@/store/AuthStore';
import { Alert, AlertSeverity } from '@/models/Alert';
import PasswordStrength from '@/components/PasswordStrength';
import { useIntl } from '@/hooks/useIntl';

type Props = {
  auth: AuthStore,
}

export const PasswordForm = observer(function(props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const model = useLocalObservable(() => ({
    password: '',
    newPassword: '',
    changePassword: function (value: string) {
      this.password = value;
    },
    changeNewPassword: function (value: string) {
      this.newPassword = value;
    },
    reset: function() {
      this.password = '';
      this.newPassword = '';
    },
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const [promise] = setPassword(model);
        promise.then(
          () => {
            setErrors({});
            model.reset();
            auth.root.alerts.addAlert(new Alert(intl.get('auth.password-changed'), AlertSeverity.success));
          },
          err => setErrors(err.response.data.errors),
        );
      }}
    >
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label={intl.get('auth.password')}
        type="password"
        id="password"
        autoComplete="current-password"
        value={model.password}
        onChange={(e) => model.changePassword(e.target.value)}
        error={errors.hasOwnProperty('password')}
        helperText={errors.password}
      />
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="new-password"
        label={intl.get('auth.new-password')}
        type="password"
        id="new-password"
        autoComplete="new-password"
        value={model.newPassword}
        onChange={(e) => model.changeNewPassword(e.target.value)}
        error={errors.hasOwnProperty('newPassword')}
        helperText={errors.newPassword}
      />
      <PasswordStrength password={model.newPassword}/>
      <FormControl margin="dense" fullWidth>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!model.password || !model.newPassword}
        >
          {intl.get('auth.change-password')}
        </Button>
      </FormControl>
    </form>
  );
})
