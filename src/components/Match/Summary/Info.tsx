import React from "react";
// import intl from 'react-intl-universal';
// import { useParams } from "react-router";
// import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Hidden from "@mui/material/Hidden";
import Link from "@mui/material/Link";
import { asset, isFinished, isLive, isPenalty, normalizeVenueImage, slugify } from "../../../utils";
import MatchTeam from "../../../components/MatchTeam";
import TimeTz from "../../../components/TimeTz";
import DateTz from "../../../components/DateTz";
import Times from "../../../components/Times";
import { Fixture } from "../../../api";
import TvStations from "./TvStations";
import CompareIcon from "../../../components/icons/CompareIcon";
import { createH2HUrlComponent } from "../../../utils/h2h";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";

const useStyles = makeStyles<{ image?: string }>()((theme, { image }) => {
  const textShadow = image ? `${theme.palette.grey[900]} 1px 0 2px` : "none";
  return {
    status: {
      [theme.breakpoints.up("md")]: {
        color: image
          ? theme.palette.primary.contrastText
          : theme.palette.mode === "dark"
          ? theme.palette.grey[200]
          : theme.palette.grey[600],
        textShadow,
      },
      [theme.breakpoints.down("md")]: {
        color: `${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[800]}`,
      },
    },
    score: {
      [theme.breakpoints.up("md")]: {
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
      [theme.breakpoints.down("md")]: {
        color: `${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[800]}`,
        fontSize: 30,
      },
    },
    venueContainer: {
      [theme.breakpoints.up("md")]: {
        background: image ? `url("${asset(image)}") center / cover` : "none",
        backgroundBlendMode: "hard-light",
      },
    },
    venue: {
      [theme.breakpoints.up("md")]: {
        backdropFilter: "blur(6px)",
        padding: theme.spacing(2.5, 5),
      },
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(3, 1),
      },
    },
    penalty: {
      position: "absolute",
      top: -8,
      left: -16,
      color: theme.palette.primary.main,
      fontSize: theme.spacing(2),
      fontWeight: theme.typography.fontWeightBold,
    },
    text: {
      [theme.breakpoints.up("md")]: {
        color: image
          ? theme.palette.primary.contrastText
          : theme.palette.mode === "dark"
          ? theme.palette.grey[200]
          : theme.palette.grey[600],
        textShadow,
      },
      [theme.breakpoints.down("md")]: {
        color: `${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[800]}`,
      },
    },
    time: {
      color: theme.palette.success.main,
      position: "absolute",
      paddingLeft: theme.spacing(1),
    },
    compare: {
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1,
      height: theme.spacing(4.5),
      width: theme.spacing(4.5),
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[100],
      color: theme.palette.mode === "dark" ? theme.palette.grey[50] : theme.palette.grey[800],
    },
  };
});

type Props = {
  fixture: Fixture;
};

export function Info(props: Props): React.ReactElement {
  const intl = useIntl();
  // const { locale } = useParams();
  const { fixture } = props;
  const { settings } = useMst();
  const venueImage = normalizeVenueImage(fixture?.venue?.image_path);
  const { classes } = useStyles({ image: venueImage });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const venueText = (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "center" }} className={classes.text}>
      <Typography variant="body2" align="center">
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
        <Typography component="span" variant="body2" title={`${intl.get("teams.kick-off-time-long")}`}>{`${intl.get(
          "teams.kick-off-time"
        )}`}</Typography>{" "}
        <TimeTz>{fixture.time.starting_at}</TimeTz>
      </Typography>
      {fixture.venue && (
        <Typography variant="body2" align="center">
          {`${intl.get("teams.venue")}: ${fixture.venue.name} (${fixture.venue.city})`}
        </Typography>
      )}
      {fixture.tvstations.length > 0 && <TvStations tvstations={fixture.tvstations} />}
    </Box>
  );
  return (
    <Card>
      <CardHeader
        title={intl.get("match.info")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Box sx={{ height: 256, width: "100%", position: "relative" }} className={classes.venueContainer}>
          <NavLink
            to={`/soccer/teams/h2h${createH2HUrlComponent(
              fixture.localteam.name,
              fixture.localteam._id,
              fixture.visitorteam.name,
              fixture.visitorteam._id
            )}`}
            className={classes.compare}
            // title={intl.get(`teams.h2h.label`)} // @TODO: add title to NavLink
          >
            <CompareIcon fontSize="large" />
          </NavLink>
          <Box sx={{ height: "100%", display: "flex" }} className={classes.venue}>
            <MatchTeam
              team={fixture.localteam}
              recentForm={fixture.standing.localteam?.recent_form}
              hasBackground={!!venueImage}
              size={isMobile ? 100 : 150}
              winner={fixture.localteam._id === fixture.winner_team_id}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: "1 0 72px",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography variant="h2" component="span" className={classes.status}>
                {intl.get(`fixtures.statuses.${fixture.time.status}`)}
                {isLive(fixture.time.status) && (
                  <sup className={classes.time}>
                    {(fixture.time.minute || 0) + (fixture.time.extra_minute || 0)}&apos;
                  </sup>
                )}
              </Typography>
              {(isFinished(fixture.time.status) || isPenalty(fixture.time.status) || isLive(fixture.time.status)) && (
                <Typography className={classes.score}>
                  {isPenalty(fixture.time.status) && (
                    <span className={classes.penalty}>{intl.get("penalty-goals-short")}</span>
                  )}
                  {fixture.scores.localteam_score}
                  {isPenalty(fixture.time.status) && fixture.localteam._id === fixture.winner_team_id && "*"}
                  {" - "}
                  {isPenalty(fixture.time.status) && fixture.visitorteam._id === fixture.winner_team_id && "*"}
                  {fixture.scores.visitorteam_score}
                </Typography>
              )}
              <Box className={classes.text}>
                {fixture.scores.ht_score && (
                  <Typography variant="body2" gutterBottom align="center">
                    ({intl.get("match.scores.ht")} {fixture.scores.ht_score})
                  </Typography>
                )}
                {(!!fixture.scores.localteam_pen_score || !!fixture.scores.visitorteam_pen_score) && (
                  <Typography variant="body2" align="center">
                    ({intl.get("match.scores.pen")}{" "}
                    {`${fixture.scores.localteam_pen_score}-${fixture.scores.visitorteam_pen_score}`})
                  </Typography>
                )}
              </Box>
              <Hidden mdDown>{venueText}</Hidden>
            </Box>
            <MatchTeam
              team={fixture.visitorteam}
              recentForm={fixture.standing.visitorteam?.recent_form}
              hasBackground={!!venueImage}
              size={isMobile ? 100 : 150}
              winner={fixture.visitorteam._id === fixture.winner_team_id}
            />
          </Box>
        </Box>
        <Hidden mdUp>{venueText}</Hidden>
        <Box sx={{ p: 2 }}>
          <Times fixture={fixture} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default observer(Info);
