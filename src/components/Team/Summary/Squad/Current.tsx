import React, { useEffect, useMemo, useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { getPositionById } from "../../../../utils";
import { Subtitle } from "./Subtitle";
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
  PlayerShort,
} from "../../../../api";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  team: Team;
  activeSeason?: ActiveSeason;
  coach: PlayerShort;
  squads: Squads<Squad>;
};

export function Current(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { team, activeSeason, coach: initialCoach, squads: initialSquads } = props;
  const [loading, setLoading] = useState(false);
  const [squads, setSquads] = useState<Squads<Squad> | undefined>(initialSquads);
  const [coach, setCoach] = useState<Coach | undefined>(initialCoach);

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

  if (loading) {
    return (
      <Paper>
        <PlaceholderList size={50} />
      </Paper>
    );
  }

  if (!squads) {
    return null;
  }

  return (
    <>
      {map &&
        Array.from(map.entries())
          .filter(([, squads]) => squads.length > 0)
          .map(([position, squads]) => (
            <React.Fragment key={position}>
              <Subtitle>{intl.get(getPositionById(position))}</Subtitle>

              <Grid container spacing={2}>
                {squads.map((squad) => (
                  <Grid key={squad.player_id} item xs={12} sm={6} md={4}>
                    <Player player={squad.player!} appearences={squad.appearences} goals={squad.goals} />
                  </Grid>
                ))}
              </Grid>
            </React.Fragment>
          ))}

      {coach && (
        <>
          <Subtitle>{intl.get("teams.coach")}</Subtitle>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Player player={coach} disableLink />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
