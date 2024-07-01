import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { getTeamsBySeasonId, SeasonTeam, Team } from "../../api";
import { slugify } from "../../utils";
import Select from "../../components/Select";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "@/hooks/useNavigate";

type Props = {
  team: Team;
};

export function SeasonTeamMenu(props: Props): React.ReactElement {
  const { team: currentTeam } = props;
  const { settings } = useMst();
  const navigate = useNavigate();
  // const { locale } = useParams();
  const [teams, setTeams] = useState<SeasonTeam[]>([]);
  useEffect(() => {
    const [promise, cancel] = getTeamsBySeasonId(currentTeam.current_season_id);
    promise.then((res) => setTeams(res.data));
    return cancel;
  }, [currentTeam]);
  return (
    <Select label={(!settings.originalNames && currentTeam.name_loc) || currentTeam.name} enableMargin>
      {(onClose) =>
        teams.map((team) => (
          <MenuItem
            key={team._id}
            selected={team._id === currentTeam._id}
            onClick={() => {
              navigate(`/soccer/teams/${slugify(team.name)}/${team._id}/summary`);
              onClose();
            }}
          >
            <ListItemText primary={(!settings.originalNames && team.name_loc) || team.name} />
          </MenuItem>
        ))
      }
    </Select>
  );
}

export default observer(SeasonTeamMenu);
