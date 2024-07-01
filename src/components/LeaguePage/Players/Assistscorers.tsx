import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Assistscorer, getAssistscorersBySeason, pageCount } from "../../../api";
import Scorers from "./Scorers";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  seasonId?: number;
};

export function Assistscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { seasonId } = props;
  const [loading, setLoading] = useState(true);
  const [assistscorers, setAssistscorers] = useState<Assistscorer[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    if (seasonId) {
      setLoading(true);
      const [promise, cancel] = getAssistscorersBySeason(seasonId, page);
      promise.then((res) => {
        setAssistscorers(res.data);
        setLastPage(pageCount(res));
        setLoading(false);
      });
      return cancel;
    }
  }, [seasonId, page]);
  if (loading) {
    return <PlaceholderList size={50} />;
  }
  return (
    <Scorers
      scorers={assistscorers}
      columns={
        <Grid container item xs={4} justifyContent="center">
          {intl.get("players.assists")}
        </Grid>
      }
      cells={(assistscorer) => (
        <Grid container item xs={4} justifyContent="center">
          <Typography>{assistscorer.assists}</Typography>
        </Grid>
      )}
      lastPage={lastPage}
      page={page}
      setPage={setPage}
    />
  );
}
