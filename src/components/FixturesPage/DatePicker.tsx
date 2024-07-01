import React, { useContext, startTransition, useEffect } from "react";
// import intl from 'react-intl-universal';
import { matchPath } from "react-router";
import { format } from "date-fns";
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import SortIcon from "../../components/icons/SortIcon";
import CalendarIcon from "../../components/icons/CalendarIcon";
import { Context } from "../../locales/LocaleProvider";
import { parse } from "../../utils";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/router";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  input: {
    width: theme.spacing(22),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    cursor: "pointer",
    "&:before, &:hover, &:after": {
      borderBottom: "0 !important",
    },
    "& > input": {
      textAlign: "center",
    },
  },
}));

type Props = {
  hideEndAdornment?: boolean;
};

export function DatePicker(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { hideEndAdornment } = props;
  const navigate = useNavigate();
  const { asPath, locale } = useRouter();
  let date = new Date();

  const match = matchPath("/fixtures/bydate/:date", asPath);

  if (match) {
    date = parse(match.params["date"] as string, new Date());
  }

  const { dateLocale } = useContext(Context);

  if (!dateLocale) {
    return null;
  }

  return (
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
        value={date}
        onChange={(date) => {
          startTransition(() => {
            if (date !== null) {
              navigate(`/fixtures/bydate/${typeof date === "string" ? date : format(date as Date, "dd-MM-yyyy")}`);
            }
          });
        }}
        minDate={new Date(2005, 1, 11)}
        maxDate={getMaxDate()}
        {...props}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              variant="standard"
              InputProps={{
                className: classes.input,
                startAdornment: (
                  <CalendarIcon
                    color="primary"
                    onClick={(e) =>
                      params.inputProps?.onClick &&
                      params.inputProps?.onClick(e as unknown as React.MouseEvent<HTMLInputElement>)
                    }
                  />
                ),
                endAdornment: hideEndAdornment ? undefined : (
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
  );
}

function getMaxDate() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 256);

  return newDate;
}
