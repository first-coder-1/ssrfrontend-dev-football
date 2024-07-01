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
import { getRankings, Ranking } from "@/api";
import { slugify } from "@/utils";
import Flag from "@/components/Flag";
import PlaceholderList from "@/components/PlaceholderList";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()(() => ({
  flag: {
    verticalAlign: "middle",
  },
}));

type Props = {
  national?: boolean;
  rankings: Ranking[];
};

export function TopTable({ rankings: initialRankings, national }: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState<Ranking[]>(initialRankings);
  //
  let i = 1;
  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getRankings(national);
    promise.then((res) => setRankings(res.data)).finally(() => setLoading(false));
    return cancel;
  }, [national]);
  if (rankings.length === 0 && !loading) {
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
              {rankings.map((ranking) => (
                <TableRow key={ranking._id}>
                  <TableCell>{i++}</TableCell>
                  <TableCell>
                    {ranking.country_iso2 && <Flag country={ranking.country_iso2} className={classes.flag} />}
                  </TableCell>
                  <TableCell>
                    <Link
                      color="secondary"
                      component={NavLink}
                      to={`/soccer/teams/${slugify(ranking.name)}/${ranking._id}/summary`}
                    >
                      {(!settings.originalNames && ranking.name_loc) || ranking.name}
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
