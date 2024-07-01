import React from "react";
import { format, fromUnixTime } from "date-fns";
// import { useParams } from "react-router";
// import { Link as RouterLink } from 'react-router-dom';
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import Link from "@mui/material/Link";
import { FixtureWithMarket, ODDS_FORMAT, TimeFormat } from "../../../api";
import { oddPrediction, slugify } from "../../../utils";
import Checkbox from "../../../components/Checkbox";
import Live from "../../../components/Live";
import { Odd } from "./Odd";
import { ODDS_MODE, SettingsStore } from "../../../store";
import Prediction from "@/components/Prediction";
import NavLink from "@/components/shared/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      height: theme.spacing(15),
    },
  },

  itemText: {
    height: "100%",
  },

  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },

  time: {
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.down("md")]: {
      flex: 1,
    },
  },

  localteam: {
    flex: 1,
    whiteSpace: "nowrap",
    marginRight: theme.spacing(1),
  },

  visitorteam: {
    flex: 2,
  },

  preview: {
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(0, 3),
    },
  },

  right: {
    [theme.breakpoints.down("md")]: {
      textAlign: "right",
      marginLeft: theme.spacing(2),
    },
  },

  live: {
    marginLeft: theme.spacing(2),
    width: theme.spacing(12.5),
    textAlign: "right",
  },

  link: {
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

type Props = {
  checked?: boolean;
  fixture: FixtureWithMarket;
  onFavoriteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  format: ODDS_FORMAT;
  timeFormat: TimeFormat;
  settings: SettingsStore;
};

export function OddsItem(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { checked, fixture, onFavoriteChange, format: oddsFormat, timeFormat, settings } = props;
  const bookmaker = fixture.market.bookmaker[0];
  const odds = bookmaker?.odds || [];
  const time = (
    <Typography
      variant="body1"
      color="secondary"
      className={classes.time}
      component={NavLink}
      to={`/soccer/fixtures/${slugify(fixture.localteam_name)}/${slugify(fixture.visitorteam_name)}/${
        fixture._id
      }/odds`}
    >
      {format(fromUnixTime(fixture.time.starting_at), timeFormat)}
    </Typography>
  );
  const localTeam = (
    <Typography
      color="secondary"
      className={cx(classes.localteam, { [classes.bold]: fixture.winner_team_id === fixture.localteam_id })}
      component={NavLink}
      to={`/soccer/teams/${slugify(fixture.localteam_name)}/${fixture.localteam_id}/summary`}
    >
      {(!settings.originalNames && fixture.localteam_name_loc) || fixture.localteam_name}
    </Typography>
  );
  const visitorTeam = (
    <Typography
      color="secondary"
      className={cx(classes.visitorteam, { [classes.bold]: fixture.winner_team_id === fixture.visitorteam_id })}
      component={NavLink}
      to={`/soccer/teams/${slugify(fixture.visitorteam_name)}/${fixture.visitorteam_id}/summary`}
    >
      {(!settings.originalNames && fixture.visitorteam_name_loc) || fixture.visitorteam_name}
    </Typography>
  );
  let preview = (
    <Chip
      label={bookmaker?.name || intl.get("fixtures.preview")}
      color="secondary"
      size="small"
      className={classes.preview}
    />
  );
  if (bookmaker?.id) {
    preview = (
      <Link href={`${process.env.REACT_APP_BASE_URL}/bookmaker/${bookmaker?.id}`} className={classes.link}>
        {preview}
      </Link>
    );
  }
  const live = (
    <div className={classes.live}>
      <Live status={fixture.time.status} />
    </div>
  );
  return (
    <ListItem divider className={classes.root}>
      <ListItemIcon>
        <Checkbox checked={checked} onChange={onFavoriteChange} />
      </ListItemIcon>
      <ListItemText disableTypography className={classes.itemText}>
        <Hidden mdDown>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "stretch" }}>
            {time}
            {localTeam}
            {visitorTeam}
            {settings.oddsMode === ODDS_MODE.ODDS ? (
              <>
                {preview}
                {odds.map((odd) => (
                  <Odd
                    key={odd.label}
                    dp3={Number(odd.dp3)}
                    dp3Prev={Number(odd.dp3_prev)}
                    bookmakerId={bookmaker?.id}
                    eventId={odd.bookmaker_event_id}
                    format={oddsFormat}
                  />
                ))}
              </>
            ) : (
              odds.map((odd) => (
                <Prediction
                  key={odd.label}
                  prediction={fixture.predictions ? oddPrediction(odd.label, fixture.predictions) : undefined}
                />
              ))
            )}
            {live}
          </Box>
        </Hidden>
        <Hidden mdUp>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            {odds.map((odd) => (
              <Box key={odd.label} sx={{ display: "flex" }}>
                {odd.label === "1" && time}
                {odd.label === "X" && localTeam}
                {odd.label === "2" && visitorTeam}
                <Typography>{odd.label}</Typography>
                {settings.oddsMode === ODDS_MODE.ODDS ? (
                  <Odd
                    dp3={Number(odd.dp3)}
                    dp3Prev={Number(odd.dp3_prev)}
                    bookmakerId={bookmaker?.id}
                    eventId={odd.bookmaker_event_id}
                    format={oddsFormat}
                    className={classes.right}
                  />
                ) : (
                  <Prediction
                    prediction={fixture.predictions ? oddPrediction(odd.label, fixture.predictions) : undefined}
                    className={classes.right}
                  />
                )}
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {preview}
              {live}
            </Box>
          </Box>
        </Hidden>
      </ListItemText>
    </ListItem>
  );
}

export default observer(OddsItem);
