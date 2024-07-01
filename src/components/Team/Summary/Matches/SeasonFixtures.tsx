import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { makeStyles } from "tss-react/mui";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ActiveSeason, getFixturesByTeamAndSeason, Side, TeamSeasonFixture } from "../../../../api";
import FixtureList from "./FixtureList";
import PlaceholderList from "../../../../components/PlaceholderList";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { TSeasonFixturesRes } from "@/pages/soccer/teams/[kind]/[id]/summary";

const useStyles = makeStyles()((theme) => ({
  root: {
    ...theme.scrollbar,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "1 0 360px",
    height: 580,
    overflow: "auto",
  },
}));

type Props = {
  teamId: number;
  season?: ActiveSeason;
  side?: Side;
  seasonFixturesRes: TSeasonFixturesRes;
};

export function SeasonFixtures(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { teamId, season, side, seasonFixturesRes } = props;

  const [response, setResponse] = useState<{ loading: boolean; fixtures: TeamSeasonFixture[]; hasMore?: boolean }>({
    loading: false,
    fixtures: seasonFixturesRes.fixtures,
    hasMore: true,
  });

  const loadMore = useCallback(
    (page: number) => {
      if (season?._id) {
        if (page === 1) {
          setResponse((response) => ({ ...response, loading: true }));
        }
        const [promise] = getFixturesByTeamAndSeason(teamId, season._id, page, side);
        promise.then((res) =>
          setResponse((prevState) => ({
            loading: false,
            fixtures: page === 1 ? res.data : prevState.fixtures.concat(res.data),
            hasMore: parseInt(res.headers["x-future-results"], 10) > page * 10 - 5,
          }))
        );
      }
    },
    [teamId, season?._id, side]
  );
  useEffect(() => {
    return loadMore(1);
  }, [loadMore]);
  if (response.loading) {
    return (
      <Box sx={{ flex: "1 0 360px" }}>
        <PlaceholderList size={50} />
      </Box>
    );
  }
  return (
    <div className={classes.root}>
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMore}
        hasMore={response.hasMore}
        useWindow={false}
        initialLoad={true}
        loader={
          <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }} key="loader">
            <CircularProgress />
          </Box>
        }
      >
        <FixtureList fixtures={response.fixtures} teamId={teamId} season={season} />
      </InfiniteScroll>
    </div>
  );
}
