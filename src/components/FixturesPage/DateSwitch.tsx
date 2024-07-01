import React from "react";
import { matchPath } from "react-router";
import { addDays, format, subDays } from "date-fns";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "../../components/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../components/icons/ChevronRightIcon";
import { DatePicker } from "./DatePicker";
import { parse } from "../../utils";
import { useRouter } from "next/router";
import { useNavigate } from "@/hooks/useNavigate";
import { LocaleProvider } from "@/locales/LocaleProvider";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: theme.spacing(5),
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
  },
}));

export function DateSwitch(): React.ReactElement {
  const { classes } = useStyles();
  const navigate = useNavigate();
  // const params = useParams();
  const { asPath } = useRouter();
  let date = new Date();

  const match = matchPath("/fixtures/bydate/:date", asPath);

  if (match) {
    date = parse(match.params.date, new Date());
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => navigate(`/fixtures/bydate/${format(subDays(date, 1), "dd-MM-yyyy")}`)}>
        <ChevronLeftIcon color="action" />
      </IconButton>
      <DatePicker hideEndAdornment />
      <IconButton onClick={() => navigate(`/fixtures/bydate/${format(addDays(date, 1), "dd-MM-yyyy")}`)}>
        <ChevronRightIcon color="action" />
      </IconButton>
    </div>
  );
}
