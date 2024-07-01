import React, { useEffect, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getByCountry, LeagueShort } from "../../api";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  countryId: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
};

export function LeagueSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { countryId, type, value, onChange } = props;
  const { settings } = useMst();
  const [leagues, setLeagues] = useState<LeagueShort[]>([]);
  const isEnabled = countryId && type;
  useEffect(() => {
    if (countryId && type) {
      const [promise, cancel] = getByCountry(countryId, type);
      promise.then(
        (res) => setLeagues(res.data),
        () => setLeagues([])
      );
      return cancel;
    }
  }, [countryId, type]);
  return (
    <Select
      value={leagues.length ? value : ""}
      onChange={(e) => onChange(e.target.value as string)}
      disableUnderline
      disabled={!isEnabled}
      title={isEnabled ? undefined : intl.get("teams.h2h.league-empty-placeholder")}
      displayEmpty
    >
      {!value && <MenuItem value="">{intl.get("teams.h2h.league-placeholder")}</MenuItem>}
      {leagues.map((league) => (
        <MenuItem key={league._id} value={league._id}>
          {(!settings.originalNames && league.name_loc) || league.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default observer(LeagueSelect);
