import React, { useMemo } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { ActiveSeason, Sidelined as SidelinedType, Team } from "../../../api";
import SeasonSelect from "../../../components/SeasonSelect";
import { useSeasons } from "../../../hooks/useSeasons";
import { TeamSidelinedTable } from "../TeamSidelinedTable";
import { useIntl } from "@/hooks/useIntl";
import { useActiveSeason } from "@/hooks/useActiveSeason";

type Props = {
  team: Team;
  sidelineds: SidelinedType[];
  seasons: ActiveSeason[];
};

export function Sidelined(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team, sidelineds, seasons } = props;
  // const options = useMemo(() => ({ withSidelined: true }), []);
  // const [seasons, activeSeason, setActiveSeason] = useSeasons(team._id, team.current_season_id, options);

  const [activeSeason, setActiveSeason] = useActiveSeason(seasons, team.current_season_id);

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.sidelined")}
          titleTypographyProps={{
            variant: "h2",
          }}
          action={
            <SeasonSelect
              activeSeason={activeSeason}
              setActiveSeason={setActiveSeason}
              seasons={seasons}
              useSeasonName
            />
          }
        />
        <CardContent>
          <TeamSidelinedTable sidelineds={sidelineds} team={team} activeSeason={activeSeason} />
        </CardContent>
      </Card>
    </>
  );
}

export default Sidelined;
