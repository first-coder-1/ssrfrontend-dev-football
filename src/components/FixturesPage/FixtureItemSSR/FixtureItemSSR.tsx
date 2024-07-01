import React from "react";
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Hidden from "@mui/material/Hidden";
import FormIcon from "../../icons/FormIcon";
import VideoIcon from "../../icons/VideoIcon";
import { isFinished, isLive, isPostponed, isScheduled, slugify } from "../../../utils";
import Checkbox from "../../Checkbox";
import { Livescore } from "../../../api";
import Live from "../../Live";
import TimeTz from "../../TimeTz";
import { SettingsStore } from "../../../store";
import { observer } from "mobx-react-lite";
import NavLink from "@/components/shared/NavLink";
import { Period } from "../FixtureItem/Period";
import { Time } from "../FixtureItem/Time";
import FixtureTeam from "../FixtureItem/FixtureTeam";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(5),
  },

  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
  },

  startTime: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 220px",
  },

  fixture: {
    display: "flex",
    alignItems: "center",
    flex: "5 0 auto",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: "0 1 150px",
  },

  primary: {
    color: theme.palette.primary.main,
  },

  secondary: {
    color: theme.palette.secondary.main,
  },

  score: {
    margin: theme.spacing(0, 2),
    width: 56,
    textAlign: "center",
  },

  htScore: {
    flex: `0 0 ${theme.spacing(10)}`,
  },

  form: {
    marginLeft: theme.spacing(0.7),
  },

  live: {
    marginLeft: theme.spacing(2),
  },

  minute: {
    color: theme.palette.success.main,
    marginRight: theme.spacing(2),
  },

  contentBig: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 0,
  },

  contentBigLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  contentBigRight: {
    display: "flex",
    alignItems: "center",
  },

  contentBigRightScore: {
    display: "flex",
    flexDirection: "column",
  },
}));

type Props = {
  checked?: boolean;
  disabled?: boolean;
  fixture: Livescore;
  onFavoriteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  matchTime: number;
  settings: SettingsStore;
};

export function FixtureItemSSR(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { checked, disabled, fixture, onFavoriteChange, matchTime, settings } = props;
  const scores = fixture.scores;
  // const { locale } = useParams();
  const localTeamLink = `/soccer/teams/${slugify(fixture.localteam_name)}/${fixture.localteam_id}/summary`;
  const visitorTeamLink = `/soccer/teams/${slugify(fixture.visitorteam_name)}/${fixture.visitorteam_id}/summary`;
  let fixtureLink = `/soccer/fixtures/all`;
  if (fixture.localteam_name && fixture.visitorteam_name) {
    fixtureLink = `/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
      fixture._id
    }/summary`;
  }

  const isLiveFlag = isLive(fixture.time.status);
  return (
    <ListItem divider className={classes.root}>
      <ListItemIcon>
        <Checkbox value={fixture._id} checked={checked} disabled={disabled} onChange={onFavoriteChange} />
      </ListItemIcon>
      <ListItemText disableTypography>
        <div className={classes.content}>
          <div className={classes.startTime}>
            <Typography variant="body1" color="secondary" component={NavLink} to={fixtureLink}>
              <TimeTz>{fixture.time.starting_at}</TimeTz>
            </Typography>
            <Time time={fixture.time} />
            {(isLiveFlag || isFinished(fixture.time.status)) && <Period time={fixture.time} matchTime={matchTime} />}
          </div>
          <div className={classes.fixture}>
            <FixtureTeam
              isWinner={fixture.winner_team_id === fixture.localteam_id}
              teamName={(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
              teamStat={fixture.stats.find((stat) => stat.team_id === fixture.localteam_id)}
              link={localTeamLink}
              ltr
            />
            <Chip
              size="small"
              label={
                <Link color="inherit" component={NavLink} to={fixtureLink}>
                  {isScheduled(fixture.time.status) || isPostponed(fixture.time.status)
                    ? " - "
                    : `${scores.localteam_score} - ${scores.visitorteam_score}`}
                </Link>
              }
              className={cx(classes.score, {
                [classes.primary]: scores.localteam_score !== scores.visitorteam_score,
                [classes.secondary]: scores.localteam_score === scores.visitorteam_score,
              })}
            />
            <FixtureTeam
              isWinner={fixture.winner_team_id === fixture.visitorteam_id}
              teamName={(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
              teamStat={fixture.stats.find((stat) => stat.team_id === fixture.visitorteam_id)}
              link={visitorTeamLink}
            />
          </div>
          <Typography color="secondary" className={classes.htScore}>
            {scores.ps_score || scores.ht_score ? `(${scores.ps_score || scores.ht_score})` : " "}
          </Typography>
          <div className={classes.actions}>
            {fixture.tvstations.length > 0 && (
              <Tooltip
                title={
                  <>
                    {fixture.tvstations.map((tvStation) => (
                      <Typography key={tvStation.tvstation} color="inherit">
                        {tvStation.tvstation}
                      </Typography>
                    ))}
                  </>
                }
                arrow
                placement="bottom-end"
              >
                <VideoIcon color="action" />
              </Tooltip>
            )}
            {fixture.lineup && <FormIcon color="action" className={classes.form} />}
            <Live status={fixture.time.status} className={classes.live} />
          </div>
        </div>
      </ListItemText>
    </ListItem>
  );
}

export default observer(FixtureItemSSR);
