import React from "react";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import PenaltyCard from "../../../components/PenaltyCard";
import { LivescoreStat } from "../../../api";
import NavLink from "@/components/shared/NavLink";
// import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles<void, "card">()((theme, _params, classes) => ({
  bold: {
    fontWeight: theme.typography.fontWeightBold!,
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  row: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      flex: 1,
    },
  },
  card: {
    marginLeft: theme.spacing(0.5),
  },
  ltr: {
    flexDirection: "row",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row-reverse",
    },
    [`& .${classes.card}`]: {
      marginLeft: 0,
      marginRight: theme.spacing(0.5),
    },
  },
}));

type Props = {
  isWinner: boolean;
  teamName: string;
  teamStat?: LivescoreStat;
  ltr?: boolean;
  link?: string;
};

const formatName = (item?: string) => (item !== undefined ? item.replace("Esports", "").trim() : "");

function FixtureTeam(props: Props) {
  const { classes, cx } = useStyles();
  const { isWinner, teamName, teamStat, ltr, link } = props;
  return (
    <div className={cx(classes.row, { [classes.ltr]: ltr })}>
      <Typography
        color="secondary"
        component={link ? NavLink : "a"}
        to={link}
        className={cx(classes.title, { [classes.bold]: isWinner })}
      >
        {formatName(teamName)}
      </Typography>
      {teamStat && teamStat.yellowcards > 0 && (
        <PenaltyCard className={classes.card}>{teamStat.yellowcards}</PenaltyCard>
      )}
      {teamStat && teamStat.redcards > 0 && (
        <PenaltyCard red className={classes.card}>
          {teamStat.redcards}
        </PenaltyCard>
      )}
    </div>
  );
}

export default FixtureTeam;
