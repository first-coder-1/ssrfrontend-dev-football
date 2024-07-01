import React, { useEffect, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getTeamsByLeague, TeamShort } from "@/api";
import { observer } from "mobx-react-lite";
import { useMst } from "@/store";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  leagueId: string;
  value: string;
  onChange: (value: string) => void;
};

export function TeamSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { leagueId, value, onChange } = props;
  const { settings } = useMst();
  const [teams, setTeams] = useState<TeamShort[]>([]);
  useEffect(() => {
    if (leagueId) {
      const [promise, cancel] = getTeamsByLeague(leagueId);
      promise.then(
        (res) => setTeams(res.data),
        () => setTeams([])
      );
      return cancel;
    }
  }, [leagueId]);
  return (
    <Select
      value={teams.length ? value : ""}
      onChange={(e) => onChange(e.target.value as string)}
      disableUnderline
      disabled={!leagueId || teams.length === 0}
      title={leagueId ? undefined : intl.get("teams.h2h.team-empty-placeholder")}
      displayEmpty
    >
      {!value && <MenuItem value="">{intl.get("teams.h2h.team-placeholder")}</MenuItem>}
      {teams.map((team) => (
        <MenuItem key={team._id} value={`${team._id}:${team.name}`}>
          {(!settings.originalNames && team.name_loc) || team.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default observer(TeamSelect);
