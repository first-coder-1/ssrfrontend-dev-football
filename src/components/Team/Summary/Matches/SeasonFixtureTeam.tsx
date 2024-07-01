import React from "react";

// import { useParams } from "react-router";

import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DateTz from "../../../../components/DateTz";
import { TeamSeasonFixture } from "../../../../api";
import { isFinished, slugify } from "../../../../utils";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    width: theme.spacing(38.5),
    margin: theme.spacing(0.2, 0),
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(35),
    },
  },

  box: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[100],
  },

  info: {
    width: theme.spacing(33.5),
    padding: theme.spacing(1.5, 1),
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(30),
    },
  },

  result: {
    width: theme.spacing(4),
    color: theme.palette.primary.contrastText,
    fontWeight: theme.typography.fontWeightMedium,
  },

  win: {
    backgroundColor: theme.palette.success.light,
  },

  lose: {
    backgroundColor: theme.palette.error.light,
  },

  draw: {
    backgroundColor: theme.palette.grey[500],
  },

  names: {
    borderLeft: `1px solid ${theme.palette.grey[500]}`,
  },

  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

type Props = {
  teamId: number;
  fixture: TeamSeasonFixture;
};

export function SeasonFixtureTeam(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { fixture, teamId } = props;
  const { settings } = useMst();
  const finished = isFinished(fixture.time.status);
  const win = finished && teamId === fixture.winner_team_id;
  const lose = finished && fixture.winner_team_id && teamId !== fixture.winner_team_id;
  const localWinner = fixture.localteam_id === fixture.winner_team_id;
  const visitorWinner = fixture.visitorteam_id === fixture.winner_team_id;

  const className = cx(
    classes.box,
    classes.result,
    win && classes.win,
    !!lose && classes.lose,
    finished && !win && !lose && classes.draw
  );
  let letter = "";
  if (finished) {
    if (win) {
      letter = "W";
    } else if (lose) {
      letter = "L";
    } else {
      letter = "D";
    }
  }

  // const { locale } = useParams();
  const fixtureLink = `/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
    fixture._id
  }/summary`;

  return (
    <Link color="secondary" component={NavLink} to={fixtureLink}>
      <Box sx={{ height: 60, display: "flex", justifyContent: "space-between" }} className={classes.root}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} className={cx(classes.box, classes.info)}>
          <Box sx={{ flex: 1 }}>
            <Typography align="center">
              <DateTz>{fixture.time.starting_at}</DateTz>
            </Typography>
            <Typography align="center">{intl.get(`fixtures.statuses.${fixture.time.status}`)}</Typography>
          </Box>
          <Box sx={{ flex: 2, pl: 1 }} className={classes.names}>
            <Typography className={cx({ [classes.bold]: localWinner })}>
              {(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
            </Typography>
            <Typography className={cx({ [classes.bold]: visitorWinner })}>
              {(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
            </Typography>
          </Box>
          <Box>
            <Typography align="right">{fixture.localteam_score}</Typography>
            <Typography align="right">{fixture.visitorteam_score}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={className}
          title={letter ? intl.get(`teams.statistic-long.${letter}`) : ""}
        >
          {letter ? intl.get(`teams.statistic.${letter}`) : ""}
        </Box>
      </Box>
    </Link>
  );
}

export default observer(SeasonFixtureTeam);
