import React from "react";
// import intl from 'react-intl-universal';
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "../../components/Select";
import { TeamShort } from "../../api";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  teams: TeamShort[];
  team?: TeamShort;
  setTeam: (team?: TeamShort) => void;
  className?: string;
};

export function TeamSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { teams, team, setTeam, className } = props;
  const { settings } = useMst();
  const label = intl.get("select-team");
  return (
    <Select label={team ? (!settings.originalNames && team.name_loc) || team.name : label} className={className}>
      {(onClose) => {
        return [
          <MenuItem
            key={label}
            selected={undefined === props.team}
            onClick={() => {
              setTeam(undefined);
              onClose();
            }}
          >
            <ListItemText primary={label} />
          </MenuItem>,
        ].concat(
          teams.map((team) => (
            <MenuItem
              key={team._id}
              selected={team === props.team}
              onClick={() => {
                setTeam(team);
                onClose();
              }}
            >
              <ListItemText primary={(!settings.originalNames && team.name_loc) || team.name} />
            </MenuItem>
          ))
        );
      }}
    </Select>
  );
}

export default observer(TeamSelect);
