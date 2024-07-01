import React from "react";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: theme.spacing(8),
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(0, 3),
    },
  },
}));

type Props = {
  prediction?: number;
  className?: string;
};

export function Prediction(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { prediction, className } = props;
  return (
    <Typography variant="body1" component="span" color="secondary" className={cx(classes.root, className)}>
      {prediction ? `${prediction.toFixed(2)}%` : "-"}
    </Typography>
  );
}

export default Prediction;
