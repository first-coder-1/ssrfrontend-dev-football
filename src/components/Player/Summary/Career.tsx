import React, { useEffect, useMemo, useState } from "react";

// import { Link as RouterLink } from 'react-router-dom';
// RouterLink problem resolved with custom NavLink component
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Hidden from "@/components/Hidden/Hidden";
import AssistIcon from "@/components/icons/AssistIcon";
import BookmarkFullIcon from "@/components/icons/BookmarkFullIcon";
import ReplyIcon from "@/components/icons/ReplyIcon";
import SchemaIcon from "@/components/icons/SchemaIcon";
import SoccerIcon from "@/components/icons/SoccerIcon";
import TimeIcon from "@/components/icons/TimeIcon";
import UserIcon from "@/components/icons/UserIcon";
import { getPlayerCareer, LeagueType, Player, PlayerCareerEvent } from "@/api";
import TabContainer from "@/components/TabContainer";
import TabPanel from "@/components/TabPanel";
import PenaltyCard from "@/components/PenaltyCard";
import LeagueImage from "@/components/LeagueImage";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import { useIntl } from "@/hooks/useIntl";
import NavLink, { NavLink as Link } from "@/components/shared/NavLink/NavLink";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  tab: {
    height: 50,
    minWidth: theme.spacing(18),
    maxWidth: "initial",
    backgroundColor: theme.palette.grey[300],
    borderRightColor: theme.palette.grey[500],
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },

  head: {
    height: 40,
  },

  row: {
    height: 60,
  },

  icon: {
    verticalAlign: "middle",
  },

  success: {
    color: theme.palette.success.main,
  },

  error: {
    color: theme.palette.error.main,
  },

  warning: {
    color: "#F8BB86",
  },

  substituteIn: {
    transform: "scaleX(-1)",
  },

  substituteOut: {
    transform: "scaleY(-1)",
  },

  card: {
    margin: "0 auto",
  },

  team: {
    [theme.breakpoints.down("md")]: {
      width: "15vw",
      ...theme.textOverflow,
    },
  },

  hiddenSm: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  flag: {
    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(1),
    },
  },

  league: {
    display: "flex",
    alignItems: "center",
  },
}));

type Props = {
  player: Player;
  career: PlayerCareerEvent[];
};

const types = [LeagueType.DOMESTIC, LeagueType.INTERNATIONAL, LeagueType.DOMESTIC_CUP, LeagueType.CUP_INTERNATIONAL];

export function Career({ player, career }: Props): React.ReactElement {
  const transformedData = career.reduce((map, event) => {
    if (map.has(event.type)) {
      map.get(event.type)!.push(event);
    } else {
      map.set(event.type, [event]);
    }
    return map;
  }, new Map());

  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { settings } = useMst();
  const [map, setMap] = useState<Map<LeagueType, PlayerCareerEvent[]>>(transformedData);
  const [rowsToShow] = useState(7);
  const [showAllRows, setShowAllRows] = useState(false);

  useEffectWithoutFirstRender(() => {
    const [promise, cancel] = getPlayerCareer(player._id);
    promise.then(
      (res) =>
        setMap(
          res.data.reduce((map, event) => {
            if (map.has(event.type)) {
              map.get(event.type)!.push(event);
            } else {
              map.set(event.type, [event]);
            }
            return map;
          }, new Map())
        ),
      () => setMap(new Map())
    );
    return cancel;
  }, [player]);
  const summary = useMemo(() => {
    return new Map(
      Array.from(map.entries()).map(([type, events]) => [
        type,
        events.reduce(
          (sum, event) => ({
            minutes: (sum.minutes || 0) + (event.minutes || 0),
            appearences: (sum.appearences || 0) + (event.appearences || 0),
            lineups: (sum.lineups || 0) + (event.lineups || 0),
            substitute_in: (sum.substitute_in || 0) + (event.substitute_in || 0),
            substitute_out: (sum.substitute_out || 0) + (event.substitute_out || 0),
            substitutes_on_bench: (sum.substitutes_on_bench || 0) + (event.substitutes_on_bench || 0),
            goals: (sum.goals || 0) + (event.goals || 0),
            assists: (sum.assists || 0) + (event.assists || 0),
            yellowcards: (sum.yellowcards || 0) + (event.yellowcards || 0),
            redcards: (sum.redcards || 0) + (event.redcards || 0),
          }),
          {} as Partial<PlayerCareerEvent>
        ),
      ])
    );
  }, [map]);

  const [activeTab, setActiveTab] = useState(types[0]);
  return (
    <Card>
      <CardHeader
        title={intl.get("players.career")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        {map.size > 1 && (
          <List disablePadding>
            <Tabs
              value={activeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              component="li"
            >
              {Array.from(map.entries())
                .filter(([_, events]) => events.length > 0)
                .map(([type]) => (
                  <Tab
                    key={type}
                    value={type}
                    onClick={() => setActiveTab(type)}
                    label={intl.get(`leagues.${type}`)}
                    className={classes.tab}
                  />
                ))}
              <TabContainer grow className={classes.tab} />
            </Tabs>
          </List>
        )}
        {Array.from(map.entries()).map(([type, events]) => (
          <TabPanel key={type} index={type} value={activeTab}>
            <Table>
              <TableHead>
                <TableRow className={classes.head}>
                  <TableCell>{intl.get("players.seasons")}</TableCell>
                  <TableCell>{intl.get("players.team")}</TableCell>
                  <TableCell>
                    <Hidden smDown>{intl.get("players.comp")}</Hidden>
                    <Hidden smUp>{intl.get("players.comp-short")}</Hidden>
                  </TableCell>
                  <TableCell align="center" className={classes.hiddenSm}>
                    <TimeIcon fontSize="small" color="action" className={classes.icon} />
                  </TableCell>
                  <TableCell align="center" title={intl.get("players.appearences")}>
                    <BookmarkFullIcon fontSize="small" className={cx(classes.icon, classes.success)} />
                  </TableCell>
                  <TableCell align="center">
                    <UserIcon color="action" fontSize="small" className={classes.icon} />
                  </TableCell>
                  <TableCell align="center" className={classes.hiddenSm}>
                    <ReplyIcon fontSize="small" className={cx(classes.icon, classes.success, classes.substituteIn)} />
                  </TableCell>
                  <TableCell align="center" className={classes.hiddenSm}>
                    <ReplyIcon fontSize="small" className={cx(classes.icon, classes.error, classes.substituteOut)} />
                  </TableCell>
                  <TableCell align="center" className={classes.hiddenSm}>
                    <SchemaIcon viewBox="0 0 13 12" color="secondary" fontSize="small" className={classes.icon} />
                  </TableCell>
                  <TableCell align="center">
                    <SoccerIcon viewBox="0 0 16 16" color="secondary" fontSize="small" className={classes.icon} />
                  </TableCell>
                  <TableCell align="center" className={classes.hiddenSm} title={intl.get("players.assists")}>
                    <AssistIcon viewBox="0 0 11 13" fontSize="small" className={cx(classes.icon, classes.warning)} />
                  </TableCell>
                  <TableCell className={classes.hiddenSm} title={intl.get("leagues.stats.yellow-cards")}>
                    <PenaltyCard className={classes.card} />
                  </TableCell>
                  <TableCell className={classes.hiddenSm} title={intl.get("leagues.stats.red-cards")}>
                    <PenaltyCard red className={classes.card} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(0, showAllRows ? events.length : rowsToShow).map((event) => (
                  <TableRow key={event._id} className={classes.row}>
                    <TableCell>{event.season_name}</TableCell>
                    <TableCell>
                      <Typography
                        className={classes.team}
                        component={NavLink}
                        to={`/soccer/teams/${slugify(event.team_name)}/${event.team_id}/summary`}
                      >
                        {(!settings.originalNames && event.team_name_loc) || event.team_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {event.country_iso2 ? (
                        <div className={classes.league}>
                          <LeagueImage
                            url={event.league_logo_path}
                            name={(!settings.originalNames && event.league_name_loc) || event.league_name}
                            variant="28x"
                          />
                          <Hidden smDown>
                            <Typography
                              variant="body2"
                              component={NavLink}
                              to={`/soccer/leagues/${slugify(event.league_name)}/${event.league_id}/summary`}
                            >
                              {(!settings.originalNames && event.league_name_loc) || event.league_name}
                            </Typography>
                          </Hidden>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.minutes || 0}
                    </TableCell>
                    <TableCell align="center">{event.appearences || 0}</TableCell>
                    <TableCell align="center">{event.lineups || 0}</TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.substitute_in || 0}
                    </TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.substitute_out || 0}
                    </TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.substitutes_on_bench || 0}
                    </TableCell>
                    <TableCell align="center">{event.goals || 0}</TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.assists || 0}
                    </TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.yellowcards || 0}
                    </TableCell>
                    <TableCell align="center" className={classes.hiddenSm}>
                      {event.redcards || 0}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={classes.hiddenSm}>
                  <TableCell colSpan={3} className={classes.row}>
                    <Typography align="right">{intl.get("players.total")}</Typography>
                  </TableCell>
                  <TableCell align="center">{summary.get(type)?.minutes}</TableCell>
                  <TableCell align="center">{summary.get(type)?.appearences}</TableCell>
                  <TableCell align="center">{summary.get(type)?.lineups}</TableCell>
                  <TableCell align="center">{summary.get(type)?.substitute_in}</TableCell>
                  <TableCell align="center">{summary.get(type)?.substitute_out}</TableCell>
                  <TableCell align="center">{summary.get(type)?.substitutes_on_bench}</TableCell>
                  <TableCell align="center">{summary.get(type)?.goals}</TableCell>
                  <TableCell align="center">{summary.get(type)?.assists}</TableCell>
                  <TableCell align="center">{summary.get(type)?.yellowcards}</TableCell>
                  <TableCell align="center">{summary.get(type)?.redcards}</TableCell>
                </TableRow>
                {events.length > rowsToShow && !showAllRows && (
                  <TableRow>
                    <TableCell>
                      <Button color="primary" onClick={() => setShowAllRows(true)}>
                        {intl.get("team-about.show-more")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {showAllRows && (
                <Box display="flex" justifyContent="right">
                  <Button color="primary" onClick={() => setShowAllRows(false)}>
                    {intl.get("team-about.show-less")}
                  </Button>
                </Box>
              )}
            </Table>
          </TabPanel>
        ))}
      </CardContent>
    </Card>
  );
}

export default observer(Career);
