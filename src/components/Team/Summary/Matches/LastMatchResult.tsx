import React, { useEffect, useState } from "react";

// import { useParams } from "react-router";

import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getTeamLastMatch, Fixture, Team } from "../../../../api";
import { asset, isLive, isPenalty, normalizeVenueImage, slugify } from "../../../../utils";
import TimeTz from "@/components/TimeTz";
import DateTz from "@/components/DateTz";
import MatchTeam from "@/components/MatchTeam";
import Times from "@/components/Times";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles<{ image?: string }>()((theme, { image }) => {
  const textShadow = image ? `${theme.palette.grey[900]} 1px 0 2px` : "none";
  return {
    root: theme.scrollbar as {},
    status: {
      color: image
        ? theme.palette.primary.contrastText
        : theme.palette.mode === "dark"
        ? theme.palette.grey[200]
        : theme.palette.grey[600],
      textShadow,
    },
    score: {
      color: image
        ? theme.palette.primary.contrastText
        : theme.palette.mode === "dark"
        ? theme.palette.grey[200]
        : theme.palette.grey[600],
      fontSize: 30,
      fontWeight: theme.typography.fontWeightBold,
      position: "relative",
      marginBottom: theme.spacing(4),
      textShadow,
    },
    venueContainer: {
      background: image ? `url("${asset(image)}") center / cover` : "none",
      backgroundBlendMode: "hard-light",
    },
    venue: {
      backdropFilter: "blur(6px)",
    },
    penalty: {
      position: "absolute",
      top: -8,
      left: -16,
      color: theme.palette.primary.main,
      fontSize: theme.spacing(2),
      fontWeight: theme.typography.fontWeightBold,
    },
    scores: {
      textShadow,
    },
    time: {
      color: theme.palette.success.main,
      position: "absolute",
      paddingLeft: theme.spacing(1),
    },
  };
});

type Props = {
  team: Team;
  lastMatch: Fixture;
};

export function LastMatchResult(props: Props): React.ReactElement {
  const intl = useIntl();
  // const { locale } = useParams();
  const { team, lastMatch } = props;
  const { settings } = useMst();
  const [loading, setLoading] = useState(false);
  const [fixture, setFixture] = useState<Fixture | undefined>(lastMatch);
  const venueImage = normalizeVenueImage(fixture?.venue?.image_path);
  const { classes } = useStyles({ image: venueImage });

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getTeamLastMatch(team._id);
    promise.then((res) => setFixture(res.data)).finally(() => setLoading(false));
    return cancel;
  }, [team]);

  if (loading) {
    return (
      <Box sx={{ width: 430 }}>
        <PlaceholderList size={50} />;
      </Box>
    );
  }
  return (
    <Box sx={{ width: 430, height: 580, overflow: "auto" }} className={classes.root}>
      {!!fixture && (
        <>
          <Box sx={{ height: 223, width: "100%" }} className={classes.venueContainer}>
            <Box sx={{ height: "100%", display: "flex", pr: 5, pl: 5, pt: 2.5, pb: 2.5 }} className={classes.venue}>
              <MatchTeam
                team={fixture.localteam}
                recentForm={fixture.standing.localteam?.recent_form}
                hasBackground={!!venueImage}
                size={100}
                winner={fixture.localteam._id === fixture.winner_team_id}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1 0 auto",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Typography
                  variant="h2"
                  className={classes.status}
                  component={NavLink}
                  to={`/soccer/fixtures/${slugify(fixture.localteam.name)}/${slugify(fixture.visitorteam.name)}/${
                    fixture._id
                  }/summary`}
                >
                  {intl.get(`fixtures.statuses.${fixture.time.status}`)}
                  {isLive(fixture.time.status) && (
                    <sup className={classes.time}>{(fixture.time.minute || 0) + (fixture.time.extra_minute || 0)}</sup>
                  )}
                </Typography>
                <Typography
                  className={classes.score}
                  component={NavLink}
                  to={`/soccer/fixtures/${slugify(fixture.localteam.name)}/${slugify(fixture.visitorteam.name)}/${
                    fixture._id
                  }/summary`}
                >
                  {isPenalty(fixture.time.status) && (
                    <span className={classes.penalty}>{intl.get("penalty-goals-short")}</span>
                  )}
                  {fixture.scores.localteam_score}
                  {isPenalty(fixture.time.status) && fixture.localteam._id === fixture.winner_team_id && "*"}
                  {" - "}
                  {isPenalty(fixture.time.status) && fixture.visitorteam._id === fixture.winner_team_id && "*"}
                  {fixture.scores.visitorteam_score}
                </Typography>
                <Box className={classes.scores}>
                  {fixture.scores.ht_score && (
                    <Typography variant="body2">
                      ({intl.get("match.scores.ht")} {fixture.scores.ht_score})
                    </Typography>
                  )}
                  {(!!fixture.scores.localteam_pen_score || !!fixture.scores.visitorteam_pen_score) && (
                    <Typography variant="body2">
                      ({intl.get("match.scores.pen")}{" "}
                      {`${fixture.scores.localteam_pen_score}-${fixture.scores.visitorteam_pen_score}`})
                    </Typography>
                  )}
                </Box>
              </Box>
              <MatchTeam
                team={fixture.visitorteam}
                recentForm={fixture.standing.visitorteam?.recent_form}
                hasBackground={!!venueImage}
                size={100}
                winner={fixture.visitorteam._id === fixture.winner_team_id}
              />
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="body1" align="center">
                <DateTz>{fixture.time.starting_at}</DateTz>
                {" - "}
                {fixture.league && (
                  <>
                    <Link
                      color="inherit"
                      component={NavLink}
                      to={
                        fixture.league_id
                          ? `/soccer/leagues/${slugify(fixture.league.name)}/${fixture.league_id}/summary`
                          : `/soccer/leagues`
                      }
                    >
                      {`${(!settings.originalNames && fixture.league.name_loc) || fixture.league.name}`}
                      {fixture.league.stage && !fixture.league.name.match(fixture.league.stage.name) && (
                        <> {fixture.league.stage.name.replace("Regular Season", "")}</>
                      )}
                    </Link>
                    {" - "}
                  </>
                )}
                <Typography
                  component="span"
                  variant="body1"
                  title={`${intl.get("teams.kick-off-time-long")}`}
                >{`${intl.get("teams.kick-off-time")}`}</Typography>{" "}
                <TimeTz>{fixture.time.starting_at}</TimeTz>
              </Typography>
              {fixture.venue && (
                <Typography variant="body1" align="center">
                  {`${intl.get("teams.venue")}: ${fixture.venue.name} (${fixture.venue.city})`}
                </Typography>
              )}
            </Box>
            <Times fixture={fixture} />
          </Box>
        </>
      )}
    </Box>
  );
}

export default observer(LastMatchResult);
