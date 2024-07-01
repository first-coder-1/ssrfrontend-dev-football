import React, { useEffect, useState } from "react";

import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { getH2HFixturesByTeamsAndSeason, maxPage, minPage, Team, H2HFixture } from "@/api";
import FixtureListItem from "./FixtureListItem";
import Pagination from "@/components/Pagination";
import { useIntl } from "@/hooks/useIntl";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  selects: {
    backgroundColor: theme.palette.grey[300],
  },
}));

export type TH2HFixtureResponse = {
  loading: boolean;
  fixtures: H2HFixture[];
  min: number;
  max: number;
};

type Props = {
  leftTeam: Team;
  rightTeam: Team;
  H2HFixturesRes: TH2HFixtureResponse;
};

export function Head2Head({ leftTeam, rightTeam, H2HFixturesRes }: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<TH2HFixtureResponse>(H2HFixturesRes);
  useEffectWithoutFirstRender(() => {
    setResponse((response) => ({ ...response, loading: true }));
    const [promise, cancel] = getH2HFixturesByTeamsAndSeason(leftTeam._id, rightTeam._id, page);
    promise.then((res) =>
      setResponse({
        loading: false,
        fixtures: res.data,
        min: minPage(res),
        max: maxPage(res),
      })
    );
    return cancel;
  }, [leftTeam._id, rightTeam._id, page]);
  if (!response.fixtures.length) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={intl.get("teams.h2h.head2head")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <ListItem className={classes.selects}>
            <Typography>{intl.get("teams.h2h.matches")}</Typography>
          </ListItem>
          {response.fixtures.map((fixture) => (
            <FixtureListItem key={fixture._id} fixture={fixture} />
          ))}
          {(response.min > 1 || response.max > 1) && (
            <ListItem disableGutters>
              <Pagination pageMin={response.min} pageMax={response.max} currentPage={page} onPageChange={setPage} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default Head2Head;
