import React, { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import { Team, getTrophiesTable, TrophyTotal } from "../../api";
import Flag from "../../components/Flag";
import { slugify } from "../../utils";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  league: {
    display: "block",
    maxWidth: theme.spacing(11),
    ...theme.textOverflow,
  },

  area: {
    verticalAlign: "middle",
  },

  medium: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

type Props = {
  team: Team;
};

export function TrophiesTable(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  // const { locale } = useParams();
  const { team } = props;
  const [trophies, setTrophies] = useState<TrophyTotal[]>([]);
  useEffect(() => {
    const [promise, cancel] = getTrophiesTable(team._id);
    promise.then((res) => setTrophies(res.data));
    return cancel;
  }, [team]);
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.trophies")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell scope="col">{intl.get("teams.competition")}</TableCell>
                <TableCell scope="col" align="center">
                  {intl.get("teams.area")}
                </TableCell>
                <TableCell scope="col" align="right">
                  {intl.get("teams.total")}
                </TableCell>
              </TableRow>
              {trophies.map((trophy) => (
                <TableRow key={trophy._id}>
                  <TableCell>
                    <Link
                      color="secondary"
                      component={NavLink}
                      to={`/soccer/leagues/${slugify(trophy.league)}/${trophy.league_id}/summary`}
                    >
                      <span
                        title={(!settings.originalNames && trophy.league_name_loc) || trophy.league}
                        className={classes.league}
                      >
                        {(!settings.originalNames && trophy.league_name_loc) || trophy.league}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {trophy.country_iso2 && <Flag country={trophy.country_iso2} className={classes.area} />}
                  </TableCell>
                  <TableCell align="right">{trophy.total}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" className={classes.medium}>
                    {intl.get("teams.total")}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} align="right">
                  <Typography variant="subtitle1" className={classes.medium}>
                    {trophies.reduce((sum, trophy) => sum + trophy.total, 0)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default observer(TrophiesTable);
