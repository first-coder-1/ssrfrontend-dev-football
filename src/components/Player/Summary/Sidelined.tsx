import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { getPlayerSidelined, Sidelined as SidelinedType, Player } from "@/api";
import SidelinedTable from "@/components/SidelinedTable";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

type Props = {
  player: Player;
  sidelineds: SidelinedType[];
};

export function Sidelined(props: Props): React.ReactElement {
  const intl = useIntl();
  const { player, sidelineds: initialSidlineds } = props;
  const [sidelineds, setSidelineds] = useState<SidelinedType[]>(initialSidlineds);

  useEffectWithoutFirstRender(() => {
    const [promise, cancel] = getPlayerSidelined(player._id);
    promise.then(
      (res) => setSidelineds(res.data),
      () => setSidelineds([])
    );
    return cancel;
  }, [player]);

  return (
    <Card>
      <CardHeader
        title={intl.get("players.sidelined")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <SidelinedTable sidelineds={sidelineds} hidePlayer />
      </CardContent>
    </Card>
  );
}
