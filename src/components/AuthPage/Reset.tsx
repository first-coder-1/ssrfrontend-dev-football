import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router";
import { observer, useLocalObservable } from "mobx-react-lite";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { AuthStore } from "../../store/AuthStore";
import { BaseTemplate } from "./BaseTemplate";
import PasswordStrength from "../../components/PasswordStrength";
import NavLink from "../shared/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import { useNavigate } from "@/hooks/useNavigate";

type Props = {
  auth: AuthStore;
};

export const Reset = observer(function (props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const {
    locale,
    query: { slug },
  } = useRouter();
  const navigate = useNavigate();
  const token = slug![1] as string;
  const model = useLocalObservable(() => ({
    password: "",
    changePassword: function (value: string) {
      this.password = value;
    },
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  return (
    <BaseTemplate
      title={intl.get("auth.reset")}
      lastError={auth.lastError}
      onSubmit={() =>
        auth.reset({ ...model, token: token! }).then(
          () => {
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
        name="password"
        label={intl.get("auth.new-password")}
        type="password"
        id="password"
        autoComplete="current-password"
        value={model.password}
        onChange={(e) => model.changePassword(e.target.value)}
        error={errors.hasOwnProperty("password")}
        helperText={errors.password}
      />
      <PasswordStrength password={model.password} />
      <FormControl margin="dense" fullWidth>
        <Button type="submit" variant="contained" color="primary" disabled={!model.password}>
          {intl.get("auth.reset")}
        </Button>
      </FormControl>
      <Grid container>
        <Grid item xs sm>
          <Typography component={NavLink} to={`/auth/login`}>
            {intl.get("auth.login")}
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
