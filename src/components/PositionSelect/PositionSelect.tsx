import React from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getPositionById } from "../../utils";
import { Position } from "../../api";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  value: Position | undefined;
  onChange: (value: Position | undefined) => void;
};

const ids = [1, 2, 3, 4, 9];

export function PositionSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { value, onChange } = props;
  const empty = intl.get("players.select-position");
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as Position)} disableUnderline>
      <MenuItem value={undefined}>{empty}</MenuItem>
      {ids.map((id) => (
        <MenuItem key={id} value={id}>
          {intl.get(getPositionById(id, true))}
        </MenuItem>
      ))}
    </Select>
  );
}

export default PositionSelect;
