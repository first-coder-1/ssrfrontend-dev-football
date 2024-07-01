import React, { useEffect, useState } from "react";
// import { useParams } from "react-router";

import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Hidden from "@/components/Hidden/Hidden";
import Box from "@mui/material/Box";
import PenaltyCard from "../../../../components/PenaltyCard";
import { age, getPositionById, slugify } from "../../../../utils";
import Flag from "../../../../components/Flag";
import { ActiveSeason, getSquadStatsByTeamAndSeason, Squads, SquadStat, Team } from "../../../../api";
import AssistIcon from "../../../../components/icons/AssistIcon";
import BookmarkFullIcon from "../../../../components/icons/BookmarkFullIcon";
import ReplyIcon from "../../../../components/icons/ReplyIcon";
import SchemaIcon from "../../../../components/icons/SchemaIcon";
import SoccerIcon from "../../../../components/icons/SoccerIcon";
import TimeIcon from "../../../../components/icons/TimeIcon";
import UserIcon from "../../../../components/icons/UserIcon";
import PlaceholderList from "../../../../components/PlaceholderList";
import PlayerImage from "../../../../components/PlayerImage";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles<void, "nameCell">()((theme, _params, classes) => ({
  name: {
    margin: theme.spacing(0, 1.5),
    fontWeight: theme.typography.fontWeightMedium,
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
  left: {
    flexGrow: 0,
    maxWidth: "47%",
    flexBasis: "47%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
      position: "relative",

      "&:after": {
        content: '""',
        background: theme.palette.grey[500],
        position: "absolute",
        bottom: 0,
        left: "3%",
        height: 1,
        width: "94%",
      },
    },
  },
  right: {
    flexGrow: 0,
    maxWidth: "53%",
    flexBasis: "53%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
    },
  },
  headRow: {
    height: 40,
    [`& .${classes.nameCell}`]: {
      justifyContent: "flex-start",
    },
  },
  bodyRow: {
    height: 60,
    [`& .${classes.nameCell}`]: {
      justifyContent: "space-between",
    },
  },
  cell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.typography.body1.color,
  },
  nameCell: {
    flex: 6,
  },
  odd: {
    backgroundColor: theme.palette.action.hover,
  },
  rowContainer: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
  },
}));

type Props = {
  team: Team;
  activeSeason?: ActiveSeason;
};

export function Stats(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { team, activeSeason } = props;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Squads<SquadStat> | undefined>();
  // const { locale } = useParams();
  useEffect(() => {
    if (activeSeason) {
      setLoading(true);
      const [promise, cancel] = getSquadStatsByTeamAndSeason(team._id, activeSeason._id);
      promise.then((res) => setStats(res.data)).finally(() => setLoading(false));
      return cancel;
    }
  }, [activeSeason, team]);
  const date = new Date();
  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap" }} className={classes.rowContainer}>
        <Hidden mdDown>
          <Box sx={{ display: "flex" }} className={cx(classes.headRow, classes.left)}>
            <Box className={classes.cell}>#</Box>
            <Box className={cx(classes.cell, classes.nameCell)}>{intl.get("teams.name")}</Box>
            <Box className={classes.cell}>{intl.get("teams.age")}</Box>
            <Box className={classes.cell} title={intl.get("players.position")}>
              {intl.get("players.position-short")}
            </Box>
            <Box className={classes.cell}>
              <TimeIcon color="secondary" fontSize="small" className={classes.icon} />
            </Box>
          </Box>
        </Hidden>
        <Box sx={{ display: "flex" }} className={cx(classes.headRow, classes.right)}>
          <Box className={classes.cell} title={intl.get("players.appearences")}>
            <BookmarkFullIcon fontSize="small" className={cx(classes.icon, classes.success)} />
          </Box>
          <Box className={classes.cell}>
            <UserIcon color="action" fontSize="small" className={classes.icon} />
          </Box>
          <Box className={classes.cell}>
            <ReplyIcon fontSize="small" className={cx(classes.icon, classes.success, classes.substituteIn)} />
          </Box>
          <Box className={classes.cell}>
            <ReplyIcon fontSize="small" className={cx(classes.icon, classes.error, classes.substituteOut)} />
          </Box>
          <Box className={classes.cell}>
            <SchemaIcon viewBox="0 0 13 12" color="secondary" fontSize="small" className={classes.icon} />
          </Box>
          <Box className={classes.cell} title={intl.get("players.goals")}>
            <SoccerIcon viewBox="0 0 16 16" color="secondary" fontSize="small" className={classes.icon} />
          </Box>
          <Box className={classes.cell} title={intl.get("players.assists")}>
            <AssistIcon viewBox="0 0 11 13" fontSize="small" className={cx(classes.icon, classes.warning)} />
          </Box>
          <Box className={classes.cell} title={intl.get("leagues.stats.yellow-cards")}>
            <PenaltyCard />
          </Box>
          <Box className={classes.cell} title={intl.get("leagues.stats.red-cards")}>
            <PenaltyCard red />
          </Box>
        </Box>
      </Box>
      {loading && <PlaceholderList size={60} />}
      {stats?.squad
        .filter((squad) => !!squad.player)
        .map((squad, i) => (
          <Box
            key={squad.player_id}
            sx={{ display: "flex", flexWrap: "wrap" }}
            className={cx(classes.rowContainer, { [classes.odd]: i % 2 === 1 })}
          >
            <Box sx={{ display: "flex" }} className={cx(classes.bodyRow, classes.left)}>
              <Box className={classes.cell}>{squad.number || "-"}</Box>
              <Box className={cx(classes.cell, classes.nameCell)}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PlayerImage
                    disableMargin
                    url={squad.player!.image_path || undefined}
                    name={squad.player!.common_name}
                    variant="32x32"
                  />
                  <Typography
                    variant="h4"
                    className={classes.name}
                    component={NavLink}
                    to={
                      squad.player
                        ? `/soccer/players/${slugify(squad.player!.common_name)}/${squad.player_id}/summary`
                        : `/soccer/players`
                    }
                  >
                    {squad.player!.common_name}
                  </Typography>
                </Box>
                {squad.player!.country_iso2 && <Flag country={squad.player!.country_iso2} />}
              </Box>
              <Box className={classes.cell}>{squad.player!.birthdate ? age(squad.player!.birthdate, date) : "-"}</Box>
              <Box className={classes.cell} title={getPositionById(squad.position_id)}>
                {intl.get(getPositionById(squad.position_id).substr(0, 1))}
              </Box>
              <Box className={classes.cell}>{squad.minutes || 0}</Box>
            </Box>
            <Box sx={{ display: "flex" }} className={cx(classes.bodyRow, classes.right)}>
              <Box className={classes.cell}>{squad.appearences || 0}</Box>
              <Box className={classes.cell}>{squad.lineups || 0}</Box>
              <Box className={classes.cell}>{squad.substitute_in || 0}</Box>
              <Box className={classes.cell}>{squad.substitute_out || 0}</Box>
              <Box className={classes.cell}>{squad.substitutes_on_bench || 0}</Box>
              <Box className={classes.cell}>{squad.goals || 0}</Box>
              <Box className={classes.cell}>{squad.assists || 0}</Box>
              <Box className={classes.cell}>{squad.yellowcards || 0}</Box>
              <Box className={classes.cell}>{squad.redcards || 0}</Box>
            </Box>
          </Box>
        ))}
    </>
  );
}
