import React, { useEffect, useMemo, useState } from "react";

import { getPositionById } from "@/utils";
import Player from "./Player";
import {
  ActiveSeason,
  getCurrentCoachByTeamAndSeason,
  getCurrentSquadsByTeamAndSeason,
  PlayerShort as Coach,
  Position,
  Squad,
  Squads,
  Team,
} from "@/api";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  team: Team;
  activeSeason?: ActiveSeason;
};

export function Current(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { team, activeSeason } = props;
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [squads, setSquads] = useState<Squads<Squad> | undefined>();
  const [coach, setCoach] = useState<Coach | undefined>();
  useEffect(() => {
    if (activeSeason) {
      setLoading(true);
      const [squadPromise, squadCancel] = getCurrentSquadsByTeamAndSeason(team._id, activeSeason._id);
      const [coachPromise, coachCancel] = getCurrentCoachByTeamAndSeason(team._id, activeSeason._id);
      Promise.allSettled([squadPromise, coachPromise])
        .then((results) => {
          if (results[0].status === "fulfilled") {
            setSquads(results[0].value.data);
          } else {
            setSquads(undefined);
          }
          if (results[1].status === "fulfilled") {
            setCoach(results[1].value.data);
          } else {
            setCoach(undefined);
          }
        })
        .finally(() => setLoading(false));
      return () => {
        squadCancel();
        coachCancel();
      };
    }
  }, [activeSeason, team]);
  const map = useMemo(() => {
    return squads?.squad.reduce((map, squad) => {
      if (squad.player) {
        return map.set(squad.position_id || 0, [...(map.get(squad.position_id) || []), squad]);
      }
      return map;
    }, new Map<Position, Squad[]>());
  }, [squads]);

  if (!squads) {
    return null;
  }
  return (
    <>
      {map &&
        Array.from(map.entries())
          .filter(([, squads]) => squads.length > 0)
          .map(([position, squads]) => (
            <>
              <> {intl.get(getPositionById(position))}: </>
              {squads.map((squad, i) => (
                <Player key={i + "squad-player" + squad.player_id} player={squad.player!} />
              ))}
            </>
          ))}

      {coach && (
        <>
          <>{intl.get("teams.coach")}: </>
          <Player player={coach} />
        </>
      )}
    </>
  );
}
