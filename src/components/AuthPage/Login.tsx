import React, { useState } from "react";
// import intl from 'react-intl-universal';
// import { useParams } from "react-router";
// import { Link } from 'react-router-dom';
import { observer, useLocalObservable } from "mobx-react-lite";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AuthStore } from "../../store/AuthStore";
import { BaseTemplate } from "./BaseTemplate";
import SocialButton from "../../components/SocialButton";
import FacebookButton from "./FacebookButton";
import GoogleButton from "./GoogleButton";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink";

type Props = {
  auth: AuthStore;
};

export const Login = observer(function (props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const model = useLocalObservable(() => ({
    username: "",
    password: "",
    changeUsername: function (value: string) {
      this.username = value;
    },
    changePassword: function (value: string) {
      this.password = value;
    },
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  return (
    <BaseTemplate
      title={intl.get("auth.login")}
      lastError={auth.lastError}
      onSubmit={() =>
        auth.login(model).then(
          () => setErrors({}),
          (err) => setErrors(err.response.data.errors)
        )
      }
    >
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label={intl.get("auth.username")}
        name="username"
        autoComplete="email"
        autoFocus
        value={model.username}
        onChange={(e) => model.changeUsername(e.target.value)}
        error={errors.hasOwnProperty("username")}
        helperText={errors.username}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label={intl.get("auth.password")}
        type="password"
        id="password"
        autoComplete="current-password"
        value={model.password}
        onChange={(e) => model.changePassword(e.target.value)}
        error={errors.hasOwnProperty("password")}
        helperText={errors.password}
      />
      <FormControl margin="dense" fullWidth>
        <Button type="submit" variant="contained" color="primary" disabled={!model.username || !model.password}>
          {intl.get("auth.login")}
        </Button>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SocialButton
            provider="facebook"
            appId={process.env.REACT_APP_FACEBOOK_APP_ID!}
            onLoginSuccess={(result: { token: { accessToken: string } }) => {
              auth.facebook(result.token);
            }}
            onLoginFailure={(result) => console.error(result)}
          >
            <FormControl margin="dense" fullWidth>
              <FacebookButton variant="contained">{intl.get("auth.facebook-login")}</FacebookButton>
            </FormControl>
          </SocialButton>
        </Grid>
        <Grid item xs={6}>
          <SocialButton
            provider="google"
            appId={process.env.REACT_APP_GOOGLE_APP_ID!}
            onLoginSuccess={(result: { token: { accessToken: string } }) => {
              auth.google(result.token);
            }}
            onLoginFailure={(result) => console.error(result)}
          >
            <FormControl margin="dense" fullWidth>
              <GoogleButton variant="contained">{intl.get("auth.google-login")}</GoogleButton>
            </FormControl>
          </SocialButton>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs sm>
          <Typography component={NavLink} to={`/auth/forgot`}>
            {intl.get("auth.forgot-question")}
          </Typography>
        </Grid>
        <Grid item xs sm="auto">
          <Typography component={NavLink} to={`/auth/signup`}>
            {intl.get("auth.signup-question")}
          </Typography>
        </Grid>
      </Grid>
    </BaseTemplate>
  );
});
