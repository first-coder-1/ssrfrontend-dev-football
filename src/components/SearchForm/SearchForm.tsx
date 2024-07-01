import React, { useContext, useEffect, useState } from "react";

import { observer, useLocalObservable } from "mobx-react-lite";
import { format } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CountrySelect, { CountryProvider } from "../CountrySelect";
import PositionSelect from "../PositionSelect";
import SearchIcon from "../icons/SearchIcon";
import SortIcon from "../icons/SortIcon";
import { Position } from "../../api";
import ExpressionSelect from "../ExpressionSelect";
// import { Context } from "@/locales/LocaleProvider";
import Slider from "../Slider";
import { useIntl } from "@/hooks/useIntl";
import { Context } from "@/locales/LocaleProvider";

const useStyles = makeStyles()(() => ({
  item: {
    minHeight: 50,
  },

  datepickerControl: {
    height: 40,
    display: "flex",
    justifyContent: "center",
  },

  datepicker: {
    "& .MuiFilledInput-input": {
      padding: 12,
    },
  },
}));

type Model = {
  query: string;
  birthcountry: string;
  nationality: string;
  position_id: Position | undefined;
  birthdate_expression: string;
  birthdate: string | undefined;
  height_min: number;
  height_max: number;
  weight_min: number;
  weight_max: number;
};

const MAX_HEIGHT = 210;
const MAX_WEIGHT = 110;

type Props = {
  query: string;
  onSubmit: (model: Model) => void;
  title: string;
  placeholder: string;
  full?: boolean;
};

export const SearchForm: React.FC<Props> = observer((props: Props) => {
  const intl = useIntl();
  const { classes } = useStyles();
  const { onSubmit, title, placeholder, full } = props;

  const model = useLocalObservable(() => ({
    query: "",
    birthcountry: "",
    nationality: "",
    position_id: undefined as Position | undefined,
    birthdate_expression: "",
    birthdate: new Date(),
    height_min: 100,
    height_max: MAX_HEIGHT,
    weight_min: 50,
    weight_max: MAX_WEIGHT,
    changeQuery: function (value: string) {
      this.query = value;
    },
    changeBirthcountry: function (value: string) {
      this.birthcountry = value;
    },
    changeNationality: function (value: string) {
      this.nationality = value;
    },
    changePositionId: function (value: Position | undefined) {
      this.position_id = value;
    },
    changeBirthdateExpression: function (value: string) {
      this.birthdate_expression = value;
    },
    changeBirthdate: function (value: Date) {
      this.birthdate = value;
    },
    changeHeight: function (min: number, max: number) {
      this.height_min = min;
      this.height_max = max;
    },
    changeWeight: function (min: number, max: number) {
      this.weight_min = min;
      this.weight_max = max;
    },
  }));
  useEffect(() => {
    model.changeQuery(props.query);
  }, [model, props.query]);

  const { dateLocale } = useContext(Context);
  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              ...model,
              birthdate: format(model.birthdate, "dd/MM/yyyy"),
            });
          }}
        >
          <List disablePadding>
            <ListSubheader className={classes.item}>
              <FormControl fullWidth>
                <Input
                  value={model.query}
                  onChange={(e) => {
                    model.changeQuery(e.target.value as string);
                  }}
                  placeholder={placeholder}
                  disableUnderline
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  }
                  inputProps={{
                    minLength: 3,
                  }}
                />
              </FormControl>
            </ListSubheader>
            {full && (
              <CountryProvider>
                <ListItem className={classes.item}>
                  <FormControl size="small" fullWidth variant="filled">
                    <Typography color="secondary" gutterBottom>
                      {intl.get("players.birthcountry")}
                    </Typography>
                    <CountrySelect
                      value={model.birthcountry}
                      onChange={(value) => model.changeBirthcountry(value)}
                      property="name"
                    />
                  </FormControl>
                </ListItem>
                <ListItem className={classes.item}>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <FormControl size="small" fullWidth variant="filled">
                        <Typography color="secondary" gutterBottom>
                          {intl.get("players.position")}
                        </Typography>
                        <PositionSelect value={model.position_id} onChange={(value) => model.changePositionId(value)} />
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl size="small" fullWidth variant="filled">
                        <Typography color="secondary" gutterBottom>
                          {intl.get("players.nationality")}
                        </Typography>
                        <CountrySelect
                          value={model.nationality}
                          onChange={(value) => model.changeNationality(value)}
                          property="name"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.item}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <FormControl size="small" fullWidth variant="filled">
                        <Typography color="secondary" gutterBottom>
                          {intl.get("players.birthdate")}
                        </Typography>
                        <ExpressionSelect
                          value={model.birthdate_expression}
                          onChange={(value) => model.changeBirthdateExpression(value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid container item xs={7} alignItems="flex-end">
                      <FormControl fullWidth variant="filled" className={classes.datepickerControl}>
                        <LocalizationProvider
                          localeText={{
                            okButtonLabel: intl.get("datepicker.ok"),
                            cancelButtonLabel: intl.get("datepicker.cancel"),
                            datePickerToolbarTitle: intl.get("datepicker.select"),
                          }}
                          dateAdapter={AdapterDateFns}
                          adapterLocale={dateLocale}
                        >
                          <MobileDatePicker
                            closeOnSelect={true}
                            value={model.birthdate}
                            onChange={(date) => (date ? model.changeBirthdate(date) : undefined)}
                            {...props}
                            slots={{
                              textField: (params) => (
                                <TextField
                                  {...params}
                                  variant="filled"
                                  className={classes.datepicker}
                                  InputProps={{
                                    disableUnderline: true,
                                    endAdornment: (
                                      <SortIcon
                                        color="action"
                                        onClick={(e) =>
                                          params.inputProps?.onClick &&
                                          params.inputProps?.onClick(e as unknown as React.MouseEvent<HTMLInputElement>)
                                        }
                                      />
                                    ),
                                  }}
                                />
                              ),
                            }}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem className={classes.item}>
                  <FormControl size="small" fullWidth variant="filled">
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="secondary" gutterBottom>
                        {intl.get("players.height")}
                      </Typography>
                      <Typography color="secondary" gutterBottom>
                        {`${model.height_min} ${intl.get("cm")} - ${model.height_max} ${intl.get("cm")}`}
                      </Typography>
                    </Box>
                    <Slider
                      minValue={model.height_min}
                      maxValue={model.height_max}
                      min={50}
                      max={MAX_HEIGHT}
                      onChange={([min, max]) => model.changeHeight(min, max)}
                    />
                  </FormControl>
                </ListItem>
                <ListItem className={classes.item}>
                  <FormControl size="small" fullWidth variant="filled">
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="secondary" gutterBottom>
                        {intl.get("players.weight")}
                      </Typography>
                      <Typography color="secondary" gutterBottom>
                        {`${model.weight_min} ${intl.get("kg")} - ${model.weight_max} ${intl.get("kg")}`}
                      </Typography>
                    </Box>
                    <Slider
                      minValue={model.weight_min}
                      maxValue={model.weight_max}
                      min={30}
                      max={MAX_WEIGHT}
                      onChange={([min, max]) => model.changeWeight(min, max)}
                    />
                  </FormControl>
                </ListItem>
              </CountryProvider>
            )}
            <ListItem className={classes.item}>
              <Button
                disabled={model.query.length < 3}
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                fullWidth
              >
                {intl.get("search.form-submit")}
              </Button>
            </ListItem>
          </List>
        </form>
      </CardContent>
    </Card>
  );
});
