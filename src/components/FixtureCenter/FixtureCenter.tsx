import React from "react";

import { makeStyles } from "tss-react/mui";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { H2HFixture, TeamSeasonFixture } from "@/api";
import { isFinished, isLive, slugify } from "@/utils";
import TeamLink from "../TeamLink";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";
import { Link } from "@mui/material";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    flex: 1,
  },

  name: {
    flex: 1,
    [theme.breakpoints.up("md")]: {
      "&:first-of-type": {
        textAlign: "right",
      },
    },
  },

  score: {
    minWidth: theme.spacing(9),
    margin: theme.spacing(0, 2.5),
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(0, 1),
    },
  },

  medium: {
    fontWeight: theme.typography.fontWeightMedium,
  },

  primaryScore: {
    color: theme.palette.primary.main,
  },
}));

type Props = {
  fixture: TeamSeasonFixture | H2HFixture;
};

export function FixtureCenter(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { fixture } = props;
  const { settings } = useMst();
  const live = isLive(fixture.time.status);
  const finished = isFinished(fixture.time.status);
  const scheduled = !live && !finished;
  const fixtureLink = `/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
    fixture._id
  }/summary`;
  return (
    <Box className={classes.root}>
      <TeamLink
        id={fixture.localteam_id}
        name={fixture.localteam_name}
        winner={fixture.winner_team_id === fixture.localteam_id}
      >
        {(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
      </TeamLink>
      <Chip
        color="default"
        label={
          //@ts-ignore @TODO
          <Link color="secondary" component={NavLink} to={fixtureLink}>
            {scheduled
              ? intl.get(`fixtures.statuses.${fixture.time.status}`)
              : `${fixture.localteam_score} - ${fixture.visitorteam_score}`}
          </Link>
        }
        className={cx(classes.score, { [classes.primaryScore]: scheduled })}
      />
      <TeamLink
        id={fixture.visitorteam_id}
        name={fixture.visitorteam_name}
        winner={fixture.winner_team_id === fixture.visitorteam_id}
      >
        {(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
      </TeamLink>
    </Box>
  );
}

export default observer(FixtureCenter);
