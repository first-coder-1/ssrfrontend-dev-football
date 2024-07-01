import React from "react";
import { makeStyles } from "tss-react/mui";
import ListItem from "@mui/material/ListItem";
import { ActiveSeason, Side, TeamSeasonFixture } from "../../api";
import SeasonSelect from "../SeasonSelect";
import SideSelect from "../SideSelect";
import Pagination from "../Pagination";
import FixtureList from "../FixtureList";

const useStyles = makeStyles()((theme) => ({
  selects: {
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey[300],
  },
}));

export type Response = {
  fixtures: TeamSeasonFixture[];
  min: number;
  max: number;
  loading?: boolean;
};

type Props = {
  response: Response;
  seasons: ActiveSeason[];
  activeSeason?: ActiveSeason;
  setActiveSeason: (season?: ActiveSeason) => void;
  page: number;
  setPage: (page: number) => void;
  side?: Side;
  setSide: (side?: Side) => void;
};

export function TeamFixtureList(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { response, seasons, activeSeason, setActiveSeason, page, setPage, side, setSide } = props;

  return (
    <FixtureList
      loading={response.loading}
      fixtures={response.fixtures}
      header={
        <ListItem className={classes.selects}>
          <div>
            <SeasonSelect
              activeSeason={activeSeason}
              setActiveSeason={(season) => {
                setActiveSeason(season);
                setPage(1);
              }}
              seasons={seasons}
              useSeasonName
            />
          </div>
          <SideSelect
            activeSide={side}
            setSide={(side) => {
              setSide(side);
              setPage(1);
            }}
          />
        </ListItem>
      }
      footer={
        response.min > 1 || response.max > 1 ? (
          <ListItem disableGutters>
            <Pagination pageMin={response.min} pageMax={response.max} currentPage={page} onPageChange={setPage} />
          </ListItem>
        ) : undefined
      }
    />
  );
}

export default TeamFixtureList;
