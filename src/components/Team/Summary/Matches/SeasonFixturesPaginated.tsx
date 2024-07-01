import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import { ActiveSeason, getFixturesByTeamAndSeason, maxPage, minPage, Side, TeamSeasonFixture } from "../../../../api";
import FixtureList from "./FixtureList";
import Pagination from "../../../../components/Pagination";
import PlaceholderList from "../../../../components/PlaceholderList";
import { TSeasonFixturesRes } from "@/pages/soccer/teams/[kind]/[id]/summary";

const useStyles = makeStyles()((theme) => ({
  root: theme.scrollbar as {},

  pagination: {
    height: theme.spacing(9),
    borderTop: `1px solid ${theme.palette.grey[500]}`,
  },
}));

type Props = {
  teamId: number;
  season?: ActiveSeason;
  side?: Side;
  seasonFixturesRes: TSeasonFixturesRes;
};

type Response = {
  loading?: boolean;
  fixtures: TeamSeasonFixture[];
  min: number;
  max: number;
};

export function SeasonFixturesPaginated(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { teamId, season, side, seasonFixturesRes } = props;
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<Response>(seasonFixturesRes);
  useEffect(() => {
    if (season) {
      setResponse((response) => ({ ...response, loading: true }));
      const [promise, cancel] = getFixturesByTeamAndSeason(teamId, season._id, page, side);
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
  }, [page, teamId, season, side]);
  if (response.loading) {
    return <PlaceholderList size={50} />;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className={classes.root}
      >
        <FixtureList fixtures={response.fixtures} teamId={teamId} season={season} />
      </Box>
      <Pagination
        pageMin={response.min}
        pageMax={response.max}
        currentPage={page}
        onPageChange={setPage}
        className={classes.pagination}
      />
    </Box>
  );
}
