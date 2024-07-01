import React, { useEffect, useState } from "react";

// import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { getSelectedLeagues, MyLeague } from "@/api";
import { slugify } from "@/utils";
import Flag from "@/components/Flag";
import PlaceholderList from "@/components/PlaceholderList";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles()(() => ({
  flag: {
    verticalAlign: "middle",
  },
}));

export function TopTable(): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState<MyLeague[]>([]);
  //
  useEffect(() => {
    setLoading(true);
    const [promise, cancel] = getSelectedLeagues();
    promise
      .then(
        (res) => setLeagues(res.data),
        () => setLeagues([])
      )
      .finally(() => setLoading(false));
    return cancel;
  }, []);
  if (leagues.length === 0 && !loading) {
    return null;
  }
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.top10")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          {loading && <PlaceholderList size={48} />}
          <Table>
            <TableBody>
              {leagues.slice(0, 10).map((league, i) => (
                <TableRow key={league._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {league.country_iso2 && <Flag country={league.country_iso2} className={classes.flag} />}
                  </TableCell>
                  <TableCell>
                    <Link
                      color="secondary"
                      component={NavLink}
                      to={`/soccer/leagues/${slugify(league.name)}/${league._id}/summary`}
                    >
                      {(!settings.originalNames && league.name_loc) || league.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default observer(TopTable);
