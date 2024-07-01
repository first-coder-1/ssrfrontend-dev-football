import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CountrySelect, { CountryProvider } from "@/components/CountrySelect";
import LeagueSelect from "@/components/LeagueSelect";
import TeamSelect from "@/components/TeamSelect";
import { Team as TeamType } from "@/api";
import { useMst } from "@/store";
import Team from "./Team";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  container: {
    display: "flex",
    padding: theme.spacing(1.5, 3),
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      flexWrap: "wrap",
      padding: theme.spacing(1.5, 1),
      alignContent: "space-between",
    },
  },

  left: {
    [theme.breakpoints.down("sm")]: {
      order: 0,
    },
  },

  right: {
    [theme.breakpoints.down("sm")]: {
      order: 1,
    },
  },

  center: {
    flex: "0 0 270px",
    [theme.breakpoints.down("sm")]: {
      order: 2,
      flexGrow: 1,
      marginTop: theme.spacing(2),
    },
  },

  empty: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

type Props = {
  onSubmit: (leftTeam: string, rightTeam: string) => void;
  leftTeam: TeamType | null;
  rightTeam: TeamType | null;
};

export function Form(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { favorites } = useMst();
  const { leftTeam, rightTeam } = props;
  const initialState = {
    type: "domestic",
    leftCountry: "",
    rightCountry: "",
    leftLeague: "",
    rightLeague: "",
    leftTeam: "",
    rightTeam: "",
  };
  const [model, setModel] = useState(initialState);
  useEffect(() => {
    setModel({
      type: leftTeam?.national_team && rightTeam?.national_team ? "national" : "domestic",
      leftCountry: leftTeam?.country_id?.toString() || "",
      rightCountry: rightTeam?.country_id?.toString() || "",
      leftLeague: leftTeam?.league_id?.toString() || "",
      rightLeague: rightTeam?.league_id?.toString() || "",
      leftTeam: leftTeam ? `${leftTeam._id}:${leftTeam.name}` : "",
      rightTeam: rightTeam ? `${rightTeam._id}:${rightTeam.name}` : "",
    });
  }, [leftTeam, rightTeam]);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (model.leftTeam && model.rightTeam) {
      props.onSubmit(model.leftTeam, model.rightTeam);
    }
  };
  return (
    <Card>
      <CardHeader
        title={intl.get("teams.h2h.title")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Box className={classes.container}>
          <Team
            team={leftTeam}
            favorites={favorites}
            checked={leftTeam ? favorites.teams.has(leftTeam._id) : false}
            className={cx(classes.left, { [classes.empty]: !leftTeam })}
          />
          <Box className={classes.center}>
            <form onSubmit={onSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={model.type}
                      onChange={(e) =>
                        setModel({
                          ...model,
                          type: e.target.value as string,
                          leftCountry: "",
                          leftLeague: "",
                          leftTeam: "",
                          rightCountry: "",
                          rightLeague: "",
                          rightTeam: "",
                        })
                      }
                      placeholder={intl.get("teams.h2h.type-placeholder")}
                      variant="filled"
                      disableUnderline
                    >
                      {["domestic", "national"].map((type) => (
                        <MenuItem key={type} value={type}>
                          {intl.get(`teams.${type}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <CountryProvider>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth variant="filled">
                      <CountrySelect
                        national={model.type === "national"}
                        value={model.leftCountry}
                        onChange={(leftCountry) =>
                          setModel({
                            ...model,
                            leftCountry,
                            leftLeague: "",
                            leftTeam: "",
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth variant="filled">
                      <CountrySelect
                        national={model.type === "national"}
                        value={model.rightCountry}
                        onChange={(rightCountry) =>
                          setModel({
                            ...model,
                            rightCountry,
                            rightLeague: "",
                            rightTeam: "",
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                </CountryProvider>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth variant="filled">
                    <LeagueSelect
                      countryId={model.leftCountry}
                      type={model.type}
                      value={model.leftLeague}
                      onChange={(leftLeague) => setModel({ ...model, leftLeague, leftTeam: "" })}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth variant="filled">
                    <LeagueSelect
                      countryId={model.rightCountry}
                      type={model.type}
                      value={model.rightLeague}
                      onChange={(rightLeague) => setModel({ ...model, rightLeague, rightTeam: "" })}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth variant="filled">
                    <TeamSelect
                      leagueId={model.leftLeague}
                      value={model.leftTeam}
                      onChange={(leftTeam) =>
                        setModel({
                          ...model,
                          leftTeam,
                          rightTeam: model.rightTeam === leftTeam ? model.leftTeam : model.rightTeam,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth variant="filled">
                    <TeamSelect
                      leagueId={model.rightLeague}
                      value={model.rightTeam}
                      onChange={(rightTeam) =>
                        setModel({
                          ...model,
                          rightTeam,
                          leftTeam: model.leftTeam === rightTeam ? model.rightTeam : model.leftTeam,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" size="large" fullWidth>
                    {intl.get("teams.h2h.submit")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
          <Team
            team={rightTeam}
            favorites={favorites}
            checked={rightTeam ? favorites.teams.has(rightTeam._id) : false}
            className={cx(classes.right, { [classes.empty]: !rightTeam })}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default observer(Form);
