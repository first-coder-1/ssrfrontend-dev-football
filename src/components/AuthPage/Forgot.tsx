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
import NavLink from "../shared/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/router";

type Props = {
  auth: AuthStore;
};

export const Forgot = observer(function (props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const { locale } = useRouter();
  const navigate = useNavigate();
  const model = useLocalObservable(() => ({
    username: "",
    changeUsername: function (value: string) {
      this.username = value;
    },
  }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  return (
    <BaseTemplate
      title={intl.get("auth.forgot")}
      lastError={auth.lastError}
      onSubmit={() => {
        auth.forgot(model).then(
          () => {
            setErrors({});
            navigate(`/auth/login`);
          },
          (err) => setErrors(err.response.data.errors)
        );
      }}
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
      <FormControl margin="dense" fullWidth>
        <Button type="submit" variant="contained" color="primary" disabled={!model.username}>
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
