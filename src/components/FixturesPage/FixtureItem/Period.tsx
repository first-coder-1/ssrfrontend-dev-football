import React from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { Livescore, FixtureStatus } from "../../../api";
import Circle from "../../../components/Circle";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  circlePrimary: {
    backgroundColor: theme.palette.primary.main,
  },

  circleWarning: {
    backgroundColor: theme.palette.warning.main,
  },

  circleSuccess: {
    backgroundColor: theme.palette.success.main,
  },

  text: {
    marginLeft: theme.spacing(1),
    whiteSpace: "nowrap",
  },
}));

type Props = {
  time: Livescore["time"];
  matchTime: number;
};

export function Period(props: Props): React.ReactElement {
  const intl = useIntl();
  const { time, matchTime } = props;
  const { classes, cx } = useStyles();
  let period: string;
  const halfTime = matchTime / 2;
  if (time.minute !== null && time.minute <= halfTime) {
    period = intl.get(`fixtures.periods.1hf`);
  } else if (time.minute && time.minute > halfTime && !time.extra_minute) {
    period = intl.get(`fixtures.periods.2hf`);
  } else {
    period = intl.get(`fixtures.periods.ot`);
  }
  const className = cx({
    [classes.circlePrimary]: time.status === FixtureStatus.PEN_LIVE,
    [classes.circleSuccess]: time.status === FixtureStatus.LIVE,
    [classes.circleWarning]: [
      FixtureStatus.HT,
      FixtureStatus.FT,
      FixtureStatus.ET,
      FixtureStatus.AET,
      FixtureStatus.BREAK,
      FixtureStatus.FT_PEN,
    ].includes(time.status),
  });
  return (
    <>
      <Circle className={className} />
      <Typography color="secondary" className={classes.text}>
        {period}
      </Typography>
    </>
  );
}
