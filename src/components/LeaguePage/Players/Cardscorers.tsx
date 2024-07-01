import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Cardscorer, getCardscorersBySeason, pageCount } from "../../../api";
import Scorers from "./Scorers";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  seasonId?: number;
};

export function Cardscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { seasonId } = props;
  const [loading, setLoading] = useState(true);
  const [cardscorers, setCardscorers] = useState<Cardscorer[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    if (seasonId) {
      setLoading(true);
      const [promise, cancel] = getCardscorersBySeason(seasonId, page);
      promise.then((res) => {
        setCardscorers(res.data);
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
      scorers={cardscorers}
      columns={
        <>
          <Grid container item xs justifyContent="center" title={intl.get("leagues.stats.yellow-cards")}>
            {intl.get("yellowcards-short")}
          </Grid>
          <Grid container item xs justifyContent="center" title={intl.get("leagues.stats.red-cards")}>
            {intl.get("redcards-short")}
          </Grid>
          <Grid container item xs justifyContent="center">
            {intl.get("leagues.points")}
          </Grid>
        </>
      }
      cells={(cardscorer) => (
        <>
          <Grid container item xs justifyContent="center">
            <Typography>{cardscorer.yellowcards}</Typography>
          </Grid>
          <Grid container item xs justifyContent="center">
            <Typography>{cardscorer.redcards}</Typography>
          </Grid>
          <Grid container item xs justifyContent="center">
            <Typography>{cardscorer.yellowcards + cardscorer.redcards * 2}</Typography>
          </Grid>
        </>
      )}
      lastPage={lastPage}
      page={page}
      setPage={setPage}
    />
  );
}
