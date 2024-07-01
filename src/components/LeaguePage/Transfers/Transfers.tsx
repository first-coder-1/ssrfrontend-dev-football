import React, { useEffect, useMemo, useState } from "react";
// import intl from 'react-intl-universal';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import { useSeasonTransferYears } from "../../../hooks/useSeasonTransferYears";
import {
  getSeasonTransfersByYear,
  League,
  LeagueSeason,
  TeamShort,
  Transfer as TransfersType,
  TransferType as ETransferType,
} from "../../../api";
import TransferTable from "../../../components/TransferTable";
import DoubleSelect from "../../../components/DoubleSelect";
import YearSelect from "../../../components/YearSelect";
import TeamSelect from "../TeamSelect";
import PlaceholderList from "../../../components/PlaceholderList";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  league: League;
  season?: LeagueSeason;
  transfers: TransfersType[];
};

export function Transfers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { season, transfers: initialTransfers } = props;
  const { settings } = useMst();
  const [years, year, setYear] = useSeasonTransferYears(season?._id);
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState<TransfersType[]>(initialTransfers);

  useEffect(() => {
    if (year && season) {
      setLoading(true);
      const [promise, cancel] = getSeasonTransfersByYear(season._id, year);
      promise
        .then(
          (res) => setTransfers(res.data.transfers),
          () => setTransfers([])
        )
        .finally(() => setLoading(false));
      return cancel;
    } else {
      setTransfers([]);
    }
  }, [season, year]);

  const teams = useMemo(() => {
    return transfers.reduce((map, transfer) => {
      map.set(transfer.from_team_id, {
        _id: transfer.from_team_id,
        name_loc: transfer.from_team_name_loc,
        name: transfer.from_team_name,
      });
      map.set(transfer.to_team_id, {
        _id: transfer.to_team_id,
        name_loc: transfer.to_team_name_loc,
        name: transfer.to_team_name,
      });

      return map;
    }, new Map<number, TeamShort>());
  }, [transfers]);

  const [team, setTeam] = useState<TeamShort | undefined>();

  useEffect(() => {
    setTeam(undefined);
  }, [teams]);

  const transfersIn = transfers.filter(
    (transfer) =>
      transfer.type === ETransferType.IN && (!team || [transfer.from_team_id, transfer.to_team_id].includes(team._id))
  );

  const transfersOut = transfers.filter(
    (transfer) =>
      transfer.type === ETransferType.OUT && (!team || [transfer.from_team_id, transfer.to_team_id].includes(team._id))
  );

  if (loading) {
    return (
      <Paper>
        <PlaceholderList size={50} />
      </Paper>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("leagues.transfers")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <DoubleSelect>
          {(containerClassName, leftClassName, rightClassName) => (
            <CardContent className={containerClassName}>
              <YearSelect years={years} year={year} setYear={setYear} className={leftClassName} />
              <TeamSelect teams={Array.from(teams.values())} team={team} setTeam={setTeam} className={rightClassName} />
            </CardContent>
          )}
        </DoubleSelect>
      </Card>

      {team && (
        <Card>
          <CardHeader
            title={(!settings.originalNames && team.name_loc) || team.name}
            titleTypographyProps={{
              variant: "h3",
              color: "primary",
            }}
          />
        </Card>
      )}

      {transfersIn.length > 0 && <TransferTable title={`${intl.get("transfers-in")}`} transfers={transfersIn} />}

      {transfersOut.length > 0 && <TransferTable title={`${intl.get("transfers-out")}`} transfers={transfersOut} />}
    </>
  );
}

export default observer(Transfers);
