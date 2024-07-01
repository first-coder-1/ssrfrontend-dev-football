import React from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { isCancelled, isFinished, isLive, isPostponed, isScheduled } from "../../../utils";
import { Livescore } from "../../../api";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    width: theme.spacing(8),
    margin: theme.spacing(0, 3),
  },
}));

type Props = {
  time: Livescore["time"];
};

export function Time(props: Props): React.ReactElement {
  const intl = useIntl();
  const { time } = props;
  const { classes } = useStyles();
  let result: React.ReactNode;
  const live = isLive(time.status);
  const cancelled = isCancelled(time.status);
  const postponed = isPostponed(time.status);
  const finished = isFinished(time.status);
  const scheduled = isScheduled(time.status);
  switch (true) {
    case live:
      result = (time.minute || 0) + (time.added_time || 0) + (time.extra_minute || 0) + (time.injury_time || 0);
      if (
        time.minute &&
        time.minute <= 90 &&
        time.added_time === null &&
        time.extra_minute === null &&
        time.injury_time === null
      ) {
        result = `${result}\``;
      } else if (time.added_time !== null || time.extra_minute !== null || time.injury_time !== null) {
        result = `${result}+`;
      }
      break;
    case cancelled:
      result = intl.get("fixtures.status.cancelled");
      break;
    case postponed:
      result = intl.get("fixtures.status.postponed");
      break;
    case finished:
      result = intl.get("fixtures.status.finished");
      break;
    case scheduled:
      result = intl.get("fixtures.status.scheduled");
      break;
  }

  return (
    <Typography color={live ? "error" : "secondary"} className={classes.root}>
      {result}
    </Typography>
  );
}
