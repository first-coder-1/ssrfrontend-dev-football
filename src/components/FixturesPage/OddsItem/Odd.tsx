import React from "react";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { ODDS_FORMAT } from "../../../api";
import { formatOdd } from "../../../utils";
import ArrowDownIcon from "../../../components/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../components/icons/ArrowUpIcon";

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(0, 3),
    },
  },
}));

type Props = {
  format: ODDS_FORMAT;
  dp3: number;
  dp3Prev?: number;
  bookmakerId?: number;
  eventId?: number;
  className?: string;
};

export function Odd(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { format, dp3, dp3Prev, bookmakerId, className } = props;
  const odd = formatOdd(dp3, format);
  return (
    <div className={cx(classes.root, className)}>
      {!!dp3Prev && dp3Prev !== dp3 && (
        <Tooltip title={formatOdd(dp3Prev, format)}>
          {dp3 < dp3Prev ? (
            <ArrowDownIcon color="error" fontSize="small" />
          ) : (
            <ArrowUpIcon color="success" fontSize="small" />
          )}
        </Tooltip>
      )}
      {bookmakerId ? (
        <Typography variant="body1" component="span" color="secondary">
          {odd}
        </Typography>
      ) : (
        <Typography variant="body1" component="span" color="secondary">
          {odd}
        </Typography>
      )}
    </div>
  );
}
