import React from "react";

import { makeStyles } from "tss-react/mui";
import { StandingLetter } from "../../api";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    color: theme.palette.primary.contrastText,
    fontWeight: theme.typography.fontWeightMedium,
    margin: 1,
    textAlign: "center",
  },

  normal: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
  },

  extended: {
    width: 22,
    lineHeight: "22px",
    display: "inline-block",
    "&:first-of-type": {
      borderTopLeftRadius: theme.spacing(0.5),
      borderBottomLeftRadius: theme.spacing(0.5),
    },
    "&:last-child": {
      borderTopRightRadius: theme.spacing(0.5),
      borderBottomRightRadius: theme.spacing(0.5),
    },
    [theme.breakpoints.down("md")]: {
      width: 12,
    },
  },

  win: {
    backgroundColor: theme.palette.success.main,
  },

  lose: {
    backgroundColor: theme.palette.error.main,
  },

  draw: {
    backgroundColor: "#ffb700",
  },
}));

type Props = {
  children: StandingLetter;
  extended?: boolean;
};

export function Standing(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { children, extended } = props;
  const className = cx(classes.root, {
    [classes.normal]: !extended,
    [classes.extended]: extended,
    [classes.win]: children === "W",
    [classes.lose]: children === "L",
    [classes.draw]: children === "D",
  });
  return (
    <div className={className} title={intl.get(`teams.statistic-long.${props.children}`)}>
      {intl.get(`teams.statistic.${props.children}`)}
    </div>
  );
}

export default Standing;
