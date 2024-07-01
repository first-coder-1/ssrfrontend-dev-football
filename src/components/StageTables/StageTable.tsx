import React from "react";

// import { Link as RouterLink } from 'react-router-dom';
import NavLink from "../shared/NavLink/NavLink";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import { Standings } from "../../api";
import { slugify } from "../../utils";
import { Legend } from "../../utils/createLegend";
import TeamImage from "../TeamImage";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { Typography } from "@mui/material";

const useStyles = makeStyles()((theme) => ({
  team: {
    display: "flex",
    alignItems: "center",
    maxWidth: theme.spacing(9),
  },

  name: {
    ...theme.textOverflow,
  },

  headerContent: {
    overflow: "hidden",
  },

  headerTitle: {
    ...theme.textOverflow,
  },

  active: {
    backgroundColor: theme.palette.grey[300],
  },
}));

type Props = {
  teamId?: number;
  standings: Standings;
  legend: Legend;
  groupId?: number;
  count?: number;
};

const DEFAULT_COUNT = 5;

export function StageTable(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { settings } = useMst();

  const { teamId, standings, legend, groupId } = props;
  const leagueLink = `/soccer/leagues/${slugify(standings.league_name)}/${standings.league_id}/summary`;
  const count = props.count || DEFAULT_COUNT;
  const aroundCount = Math.round((count - 1) / 2);
  const standingsArray = standings.standings.filter((standing) => !groupId || standing.group_id === groupId) || [];
  const index = standingsArray.findIndex((standing) => standing.team_id === teamId);
  const length = standingsArray.length;
  let start: number;
  let end: number;
  if (index - aroundCount < 0) {
    // if position is near the beginning - take 0 - {count - 1} indexes
    start = 0;
    end = Math.min(length, count);
  } else if (length - index <= aroundCount) {
    // if position is near the end - take last {count} indexes
    start = length - Math.min(length, count);
    end = length;
  } else {
    // otherwise take {aroundCount} before and {aroundCount} after
    start = index - aroundCount;
    end = index + aroundCount + 1;
  }
  return (
    <Card>
      <CardHeader
        title={(!settings.originalNames && standings.league_name_loc) || standings.league_name}
        component={NavLink}
        to={leagueLink}
        titleTypographyProps={{
          variant: "h2",
          title: (!settings.originalNames && standings.league_name_loc) || standings.league_name,
        }}
        classes={{
          content: classes.headerContent,
          title: classes.headerTitle,
        }}
      />
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell scope="col">№</TableCell>
              <TableCell scope="col">{intl.get("teams.team")}</TableCell>
              <TableCell scope="col" title={intl.get("teams.matches-played.long")}>
                {intl.get("teams.matches-played.short")}
              </TableCell>
              <TableCell scope="col" title={intl.get("teams.difference.long")}>
                {intl.get("teams.difference.short")}
              </TableCell>
              <TableCell scope="col" title={intl.get("teams.points.long")}>
                {intl.get("teams.points.short")}
              </TableCell>
            </TableRow>
            {standingsArray.slice(start, end).map((standing) => {
              const goalDifference = parseInt(standing.total?.goal_difference ?? "0", 10);
              return (
                <TableRow
                  key={standing.position}
                  style={
                    standing.result && legend.has(standing.result)
                      ? { boxShadow: `inset 3px 0px 0px ${legend.get(standing.result)!.color}` }
                      : {}
                  }
                  className={cx({ [classes.active]: teamId === standing.team_id })}
                >
                  <TableCell>{standing.position}</TableCell>
                  <TableCell>
                    <Box className={classes.team}>
                      <TeamImage
                        url={standing.team_logo_path}
                        name={(!settings.originalNames && standing.team_name_loc) || standing.team_name}
                        variant="22x22"
                      />
                      <Typography
                        // @TODO
                        // title={(!settings.originalNames && standing.team_name_loc) || standing.team_name}
                        className={classes.name}
                        component={NavLink}
                        to={`/soccer/teams/${slugify(standing.team_name)}/${standing.team_id}/summary`}
                      >
                        {standing.team_short_code ||
                          (!settings.originalNames && standing.team_name_loc) ||
                          standing.team_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{standing.overall?.games_played ?? 0}</TableCell>
                  <TableCell>
                    {goalDifference > 0 && "+"}
                    {goalDifference}
                  </TableCell>
                  <TableCell>{standing.total?.points ?? 0}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default observer(StageTable);
