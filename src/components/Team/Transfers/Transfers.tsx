import React, { useEffect, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import { Team, Transfers as TransfersType, TransferType } from "@/api";
import TransferTable from "@/components/TransferTable";
import { getTeamTransfersByYear } from "@/api";
import { useTeamTransferYears } from "@/hooks/useTeamTransferYears";
import YearSelect from "@/components/YearSelect";
import PlaceholderList from "@/components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  year: {
    width: "100%",
    height: 50,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    boxShadow: `inset 0px -4px 0px ${theme.palette.primary.main}`,
  },
}));

type Props = {
  team: Team;
  transfers: TransfersType;
  transferYears: number[];
};

export function Transfers({ team, transfers: initialTransfers, transferYears }: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [years, year, setYear] = useTeamTransferYears(team._id, transferYears);
  const [transfers, setTransfers] = useState<TransfersType | undefined>(initialTransfers);
  useEffect(() => {
    if (year) {
      setLoading(true);
      const [promise, cancel] = getTeamTransfersByYear(team._id, year);
      promise.then((res) => setTransfers(res.data)).finally(() => setLoading(false));
      return cancel;
    }
  }, [team, year]);
  const transfersIn = (transfers?.transfers || []).filter((transfer) => transfer.type === TransferType.IN);
  const transfersOut = (transfers?.transfers || []).filter((transfer) => transfer.type === TransferType.OUT);
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.transfers-and-loans")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <YearSelect years={years} year={year} setYear={setYear} className={classes.year} />
        </CardContent>
      </Card>

      {loading && (
        <Paper>
          <PlaceholderList size={48} />
        </Paper>
      )}

      {transfersIn.length > 0 && <TransferTable title={`${intl.get("transfers-in")}`} transfers={transfersIn} />}

      {transfersOut.length > 0 && <TransferTable title={`${intl.get("transfers-out")}`} transfers={transfersOut} />}
    </>
  );
}

export default Transfers;
