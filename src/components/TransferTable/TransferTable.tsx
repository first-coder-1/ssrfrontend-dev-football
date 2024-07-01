import React from "react";
// import { useParams } from "react-router";
// import { Link as RouterLink } from 'react-router-dom';

import { parse } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Link from "@mui/material/Link";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Transfer, TransferType } from "@/api";
import { commarize, uncommarize } from "@/utils/number";
import DateTz from "../DateTz";
import Flag from "../Flag";
import { slugify } from "../../utils";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import NavLink from "../shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  date: {
    [theme.breakpoints.up("sm")]: {
      width: "20%",
    },
  },

  name: {
    marginLeft: theme.spacing(2),
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1),
      width: theme.spacing(6),
      ...theme.textOverflow,
    },
  },

  team: {
    [theme.breakpoints.down("sm")]: {
      width: theme.spacing(5),
      display: "inline-block",
      ...theme.textOverflow,
    },
  },

  cell: {
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(12),
    },
  },
}));

type Props = {
  title: string;
  transfers: Transfer[];
};

function reduce(sum: number, transfer: Transfer): number {
  if (transfer.amount) {
    sum += uncommarize(transfer.amount);
  }
  return sum;
}

export function TransferTable(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { settings } = useMst();
  // const { locale } = useParams();
  const { title, transfers } = props;
  const sum = transfers.reduce(reduce, 0);
  const date = new Date();
  return (
    <Card>
      <CardHeader
        title={`${title} ${sum ? `(€${commarize(sum)})` : ""}`}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Table>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={`${transfer.player_id}-${transfer.date}`}>
                <TableCell className={cx(classes.cell, classes.date)}>
                  <DateTz>{parse(transfer.date, "yyyy-MM-dd", date).getTime() / 1000}</DateTz>
                </TableCell>
                <TableCell className={classes.cell}>
                  {transfer.player && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {transfer.player.country_iso2 && <Flag country={transfer.player.country_iso2} />}
                      <span
                        title={
                          (!settings.originalNames && transfer.player.common_name_loc) || transfer.player.common_name
                        }
                        className={classes.name}
                      >
                        <Link
                          color="inherit"
                          component={NavLink}
                          to={`/soccer/players/${slugify(transfer.player.common_name)}/${transfer.player_id}/summary`}
                        >
                          {(!settings.originalNames && transfer.player.common_name_loc) || transfer.player.common_name}
                        </Link>
                      </span>
                    </Box>
                  )}
                </TableCell>
                <TableCell className={classes.cell}>
                  <Link
                    color="inherit"
                    component={NavLink}
                    to={
                      transfer.type === TransferType.IN
                        ? `/soccer/teams/${slugify(transfer.to_team_name)}/${transfer.to_team_id}/summary`
                        : `/soccer/teams/${slugify(transfer.from_team_name)}/${transfer.from_team_id}/summary`
                    }
                    // title={
                    //   transfer.type === TransferType.IN
                    //     ? intl.get("transfer-team-to", {
                    //         name: (!settings.originalNames && transfer.to_team_name_loc) || transfer.to_team_name,
                    //       })
                    //     : intl.get("transfer-team-from", {
                    //         name: (!settings.originalNames && transfer.from_team_name_loc) || transfer.from_team_name,
                    //       })
                    // } @TODO: add title prop to NavLink
                  >
                    <span className={classes.team}>
                      {transfer.type === TransferType.IN
                        ? (!settings.originalNames && transfer.to_team_name_loc) || transfer.to_team_name
                        : (!settings.originalNames && transfer.from_team_name_loc) || transfer.from_team_name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className={classes.cell}>
                  {transfer.amount ? <>€&nbsp;{transfer.amount}</> : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default observer(TransferTable);
