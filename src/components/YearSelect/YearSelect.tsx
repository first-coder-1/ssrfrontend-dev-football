import React from "react";

import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "../Select";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  years: number[];
  year?: number;
  setYear: (year: number) => void;
  className?: string;
};

export function YearSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { years, className } = props;
  return (
    <Select label={props.year ? `${intl.get("year")}: ${props.year}` : intl.get("select-year")} className={className}>
      {(onClose) =>
        years.map((year) => (
          <MenuItem
            key={year}
            selected={year === props.year}
            onClick={() => {
              props.setYear(year);
              onClose();
            }}
          >
            <ListItemText primary={year} />
          </MenuItem>
        ))
      }
    </Select>
  );
}

export default YearSelect;
