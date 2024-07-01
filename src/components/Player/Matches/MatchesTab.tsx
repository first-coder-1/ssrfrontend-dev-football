import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import FixtureList from "@/components/FixtureList";
import Pagination from "@/components/Pagination";
import {
  ActiveSeason,
  getFixturesByPlayerAndSeason,
  LeagueType,
  maxPage,
  minPage,
  Player,
  PlayerSeasonFixture,
} from "@/api";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";

type Props = {
  player: Player;
  seasons: ActiveSeason[];
  type?: LeagueType;
};

export type TFixturesByPlAndSRes = {
  loading?: boolean;
  fixtures: PlayerSeasonFixture[];
  min: number;
  max: number;
};

export const MatchesTab: React.FC<Props> = observer((props) => {
  const mst = useMst();
  const initialState = mst.intermediate.FixturesByPlAndSRes;

  const { player, seasons, type } = props;
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<TFixturesByPlAndSRes>(initialState);

  useEffect(() => {
    if (seasons.length > 0) {
      setResponse((response) => ({ ...response, loading: true }));

      const ids = seasons.map((season) => season._id);
      const [promise, cancel] = getFixturesByPlayerAndSeason(player._id, ids, page);
      promise.then(
        (res) =>
          setResponse({
            loading: false,
            fixtures: res.data,
            min: minPage(res),
            max: maxPage(res),
          }),
        () => setResponse(initialState)
      );
      return cancel;
    }
  }, [player, seasons, type, page]);
  return (
    <FixtureList
      loading={response.loading}
      fixtures={response.fixtures}
      footer={
        response.min > 1 || response.max > 1 ? (
          <ListItem disableGutters>
            <Pagination pageMin={response.min} pageMax={response.max} currentPage={page} onPageChange={setPage} />
          </ListItem>
        ) : undefined
      }
    />
  );
});
