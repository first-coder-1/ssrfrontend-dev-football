import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TrophyList from "@/components/TrophyList";
import { getTrophiesByPlayer, Player, Trophy } from "@/api";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

export type TTrophiesResponse = [
  {
    trophies: Trophy[];
    type: string;
  },
];

type Props = {
  player: Player;
  trophies: TTrophiesResponse;
};

export function Trophies(props: Props): React.ReactElement {
  const intl = useIntl();
  const { player, trophies: initialTrophies } = props;

  const transfromedData = initialTrophies.reduce((map, trophies) => {
    trophies.trophies.forEach((trophy) => {
      const key = trophy.league_type || "other";
      if (map.has(key)) {
        map.get(key)!.push(trophy);
      } else {
        map.set(key, [trophy]);
      }
    });

    return map;
  }, new Map());

  const [map, setMap] = useState<Map<string, Trophy[]>>(transfromedData);

  useEffectWithoutFirstRender(() => {
    const [promise, cancel] = getTrophiesByPlayer(player._id);
    promise.then((res) =>
      setMap(
        res.data.reduce((map, trophies) => {
          trophies.trophies.forEach((trophy) => {
            const key = trophy.league_type || "other";
            if (map.has(key)) {
              map.get(key)!.push(trophy);
            } else {
              map.set(key, [trophy]);
            }
          });

          return map;
        }, new Map())
      )
    );
    return cancel;
  }, [player]);
  return (
    <Card>
      <CardHeader
        title={intl.get("players.trophies")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <TrophyList map={map} />
      </CardContent>
    </Card>
  );
}
