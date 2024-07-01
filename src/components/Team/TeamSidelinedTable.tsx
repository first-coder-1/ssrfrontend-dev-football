import React, { useEffect, useState } from "react";
import { ActiveSeason, getSquadSidelinedByTeamAndSeason, Sidelined as SidelinedType, Team } from "../../api";
import SidelinedTable from "../../components/SidelinedTable";
import PlaceholderList from "../../components/PlaceholderList";

type Props = {
  team: Team;
  activeSeason?: ActiveSeason;
  sidelineds?: SidelinedType[];
};

export function TeamSidelinedTable(props: Props): React.ReactElement {
  const { team, activeSeason, sidelineds: initialSidelineds } = props;
  const [loading, setLoading] = useState(false);
  const [sidelineds, setSidelineds] = useState<SidelinedType[]>(initialSidelineds ? initialSidelineds : []);
  useEffect(() => {
    if (activeSeason) {
      setLoading(true);
      const [promise, cancel] = getSquadSidelinedByTeamAndSeason(team._id, activeSeason._id);
      promise
        .then((res) => setSidelineds(res.data.sidelined.filter((sidelined) => !!sidelined.player)))
        .finally(() => setLoading(false));
      return cancel;
    }
  }, [activeSeason, team]);
  return (
    <>
      <SidelinedTable sidelineds={sidelineds} />
      {loading && <PlaceholderList size={60} />}
    </>
  );
}
