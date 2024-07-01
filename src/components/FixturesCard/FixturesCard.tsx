import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useSeasons } from "../../hooks/useSeasons";
import { getFixturesByTeamAndSeason, maxPage, minPage, Side } from "../../api";
import TeamFixtureList, { Response } from "../TeamFixtureList";
import PlaceholderList from "../PlaceholderList";

type Props = {
  teamId: number;
  seasonId: number;
  title: string;
  fixtureRes: Response;
};

export function FixturesCard(props: Props): React.ReactElement | null {
  const { teamId, seasonId, title, fixtureRes } = props;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [teamId]);
  const [seasons, activeSeason, setActiveSeason] = useSeasons(teamId, seasonId, undefined);
  const [side, setSide] = useState<Side | undefined>();
  const [response, setResponse] = useState<Response>(fixtureRes);
  useEffect(() => {
    if (activeSeason?._id) {
      setResponse((response) => ({ ...response, loading: true }));
      const [promise, cancel] = getFixturesByTeamAndSeason(teamId, activeSeason._id, page, side);
      promise.then((res) =>
        setResponse({
          loading: false,
          fixtures: res.data,
          min: minPage(res),
          max: maxPage(res),
        })
      );
      return cancel;
    }
  }, [teamId, activeSeason?._id, page, side]);

  if (response.fixtures.length === 0 && !response.loading) {
    return null;
  }

  // if (!activeSeason?._id || (response.fixtures.length === 0 && !response.loading)) {
  //   return null;
  // } // @TODO: decide what to do with active season, if needed to save spa implementation pass initialActiveSeason to useSeasons hook

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        {response.loading ? (
          <PlaceholderList size={70} />
        ) : (
          <TeamFixtureList
            response={response}
            seasons={seasons}
            activeSeason={activeSeason}
            setActiveSeason={setActiveSeason}
            page={page}
            setPage={setPage}
            side={side}
            setSide={setSide}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default FixturesCard;
