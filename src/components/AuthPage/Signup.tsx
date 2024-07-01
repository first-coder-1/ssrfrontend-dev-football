import React, { useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "../../components/Checkbox";
import { useSearchParams } from "next/navigation";
import CountrySelect, { CountryProvider } from "../../components/CountrySelect";
import { AuthStore } from "../../store/AuthStore";
import { BaseTemplate } from "./BaseTemplate";
import SocialButton from "../../components/SocialButton/SocialButton";
import PasswordStrength from "../../components/PasswordStrength";
import FacebookButton from "./FacebookButton";
import GoogleButton from "./GoogleButton";
import { Alert, AlertSeverity } from "../../models/Alert";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import { useNavigate } from "@/hooks/useNavigate";
import NavLink from "../shared/NavLink";

type Props = {
  auth: AuthStore;
};

export const Signup = observer(function (props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const { locale } = useRouter();
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  const model = useLocalObservable(() => ({
    username: "",
    country: "",
    password: "",
    passwordRepeat: "",
    confirm: false,
    marketingDisabled: true,
    tos: false,
    privacy: false,
    changeUsername: function (value: string) {
      this.username = value;
    },
    changeCountry: function (value: string) {
      this.country = value;
    },
    changePassword: function (value: string) {
      this.password = value;
    },
    changePasswordRepeat: function (value: string) {
      this.passwordRepeat = value;
    },
    changeConfirm: function () {
      this.confirm = !this.confirm;
    },
    changeMarketing: function () {
      this.marketingDisabled = !this.marketingDisabled;
    },
    changeTOS: function () {
      this.tos = !this.tos;
    },
    changePrivacy: function () {
      this.privacy = !this.privacy;
    },
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <BaseTemplate
      title={intl.get("auth.signup")}
      lastError={auth.lastError}
      onSubmit={() =>
        auth.signup(model, searchParams.get("referral") ?? undefined).then(
          () => {
            auth.root.alerts.addAlert(new Alert(intl.get("auth.confirmation-sent"), AlertSeverity.success));
            setErrors({});
            navigate(`/auth/login`);
          },
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
      <PasswordStrength password={model.password} />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label={intl.get("auth.password-repeat")}
        type="password"
        id="password-repeat"
        autoComplete="current-password"
        value={model.passwordRepeat}
        onChange={(e) => model.changePasswordRepeat(e.target.value)}
        error={errors.hasOwnProperty("passwordRepeat")}
        helperText={errors.passwordRepeat}
      />
      <CountryProvider>
        <FormControl fullWidth>
          <Typography color="secondary" gutterBottom>
            {intl.get("search.country")}:
          </Typography>
          <CountrySelect
            value={model.country}
            onChange={(value) => model.changeCountry(value)}
            property="country_iso2"
            variant="outlined"
          />
        </FormControl>
      </CountryProvider>
      <FormControl fullWidth>
        <FormControlLabel
          value={model.confirm}
          onChange={() => model.changeConfirm()}
          control={<Checkbox color="primary" />}
          label={intl.get("auth.confirm-age")}
        />
      </FormControl>
      <FormControl fullWidth>
        <FormControlLabel
          value={!model.marketingDisabled}
          onChange={() => model.changeMarketing()}
          control={<Checkbox color="primary" />}
          label={intl.get("auth.confirm-marketing")}
        />
      </FormControl>
      <FormControl fullWidth margin="dense">
        <FormControlLabel
          value={model.tos}
          onChange={() => model.changeTOS()}
          control={<Checkbox color="primary" />}
          label={intl.getHTML("auth.form-tos-text", { locale: locale! })}
        />
      </FormControl>
      <FormControl fullWidth margin="dense">
        <FormControlLabel
          value={model.privacy}
          onChange={() => model.changePrivacy()}
          control={<Checkbox color="primary" />}
          label={intl.getHTML("auth.form-privacy-text", { locale: locale! })}
        />
      </FormControl>
      <FormControl margin="dense" fullWidth>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !model.username ||
            !model.country ||
            !model.password ||
            model.password !== model.passwordRepeat ||
            !model.confirm ||
            !model.tos ||
            !model.privacy
          }
        >
          {intl.get("auth.signup")}
        </Button>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SocialButton
            provider="facebook"
            appId={process.env.REACT_APP_FACEBOOK_APP_ID!}
            onLoginSuccess={(result: { token: { accessToken: string } }) => {
              auth.facebook(result.token, searchParams.get("referral") ?? undefined);
            }}
            onLoginFailure={(result) => console.error(result)}
          >
            <FormControl margin="dense" fullWidth>
              <FacebookButton variant="contained">{intl.get("auth.facebook-signup")}</FacebookButton>
            </FormControl>
          </SocialButton>
        </Grid>
        <Grid item xs={6}>
          <SocialButton
            provider="google"
            appId={process.env.REACT_APP_GOOGLE_APP_ID!}
            onLoginSuccess={(result: { token: { accessToken: string } }) => {
              auth.google(result.token, searchParams.get("referral") ?? undefined);
            }}
            onLoginFailure={(result) => console.error(result)}
          >
            <FormControl margin="dense" fullWidth>
              <GoogleButton variant="contained">{intl.get("auth.google-signup")}</GoogleButton>
            </FormControl>
          </SocialButton>
        </Grid>
      </Grid>
      <Typography align="right" component={NavLink} to={`/auth/login`}>
        {intl.get("auth.login-question")}
      </Typography>
    </BaseTemplate>
  );
});
