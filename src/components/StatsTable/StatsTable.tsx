import React from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Stats as StatsType, StatsTable as StatsTableType } from "../../api";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  stats: StatsType;
};

const statNames: Array<keyof StatsTableType> = [
  "win",
  "draw",
  "lost",
  "goals_for",
  "goals_against",
  "clean_sheet",
  "failed_to_score",
  "avg_goals_per_game_scored",
  "avg_goals_per_game_conceded",
  "avg_first_goal_scored",
  "avg_first_goal_conceded",
];

export function StatsTable(props: Props): React.ReactElement {
  const intl = useIntl();
  const { stats } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{intl.get("teams.name")}</TableCell>
          <TableCell align="center">{intl.get("teams.total")}</TableCell>
          <TableCell align="center">{intl.get("side.home")}</TableCell>
          <TableCell align="center">{intl.get("side.away")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {statNames
          .filter((statName) => stats[statName])
          .map((statName) => (
            <TableRow key={statName}>
              <TableCell>{intl.get(`teams.statistic.${statName}`)}</TableCell>
              <TableCell align="center">{stats[statName]!.total}</TableCell>
              <TableCell align="center">{stats[statName]!.home}</TableCell>
              <TableCell align="center">{stats[statName]!.away}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default StatsTable;
