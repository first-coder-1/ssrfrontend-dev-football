import { useEffect, useState } from "react";
import { useMst } from "@/store";
import { getMyLeagues, getMyTeams, MyLeague, MyTeam } from "@/api";
import { autorun } from "mobx";

export function useMyFavorites() {
  /**
   * TODO: implement mobx store;
   */
  const { favorites } = useMst();
  const [leagues, setLeagues] = useState<MyLeague[]>([]);
  const [teams, setTeams] = useState<MyTeam[]>([]);
  useEffect(() => {
    return autorun(() => {
      if (favorites.leagues.size) {
        const [promise, cancel] = getMyLeagues(Array.from(favorites.leagues.values()));
        promise.then((res) => setLeagues(res.data));
        return cancel;
      } else {
        setLeagues([]);
      }
    });
  }, [favorites.leagues]);
  useEffect(() => {
    return autorun(() => {
      if (favorites.teams.size) {
        const [promise, cancel] = getMyTeams(Array.from(favorites.teams.values()));
        promise.then((res) => setTeams(res.data));
        return cancel;
      } else {
        setTeams([]);
      }
    });
  }, [favorites.teams]);
  return {
    leagues,
    teams,
  };
}
