import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getTopscorersBySeason, pageCount, Topscorer } from "../../../api";
import SchemaIcon from "../../../components/icons/SchemaIcon";
import SoccerIcon from "../../../components/icons/SoccerIcon";
import Scorers from "./Scorers";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()(() => ({
  icon: {
    verticalAlign: "middle",
  },
}));

type Props = {
  seasonId?: number;
  topscorers: Topscorer[];
};

export function Topscorers(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { seasonId, topscorers: initialTopscorers } = props;
  const [topscorers, setTopscorers] = useState<Topscorer[]>(initialTopscorers);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (seasonId) {
      setLoading(true);
      const [promise, cancel] = getTopscorersBySeason(seasonId, page);
      promise.then((res) => {
        setTopscorers(res.data);
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
      scorers={topscorers}
      columns={
        <>
          <Grid container item xs alignItems="center" justifyContent="center">
            <SoccerIcon viewBox="0 0 16 16" color="secondary" fontSize="small" className={classes.icon} />
          </Grid>
          <Grid
            container
            item
            xs
            justifyContent="center"
            title={
              intl.get("fixtures.statuses.PEN_LIVE")[0] + intl.get("fixtures.statuses.PEN_LIVE").slice(1).toLowerCase()
            }
          >
            {intl.get("penalty-goals-short")}
          </Grid>
          <Grid container item xs alignItems="center" justifyContent="center">
            <SchemaIcon viewBox="0 0 13 12" color="secondary" fontSize="small" className={classes.icon} />{" "}
          </Grid>
          <Grid container item xs justifyContent="center" title={intl.get("leagues.rating")}>
            {intl.get("leagues.rating")[0]}
          </Grid>
        </>
      }
      cells={(topscorer) => (
        <>
          <Grid container item xs justifyContent="center">
            <Typography>{topscorer.goals}</Typography>
          </Grid>
          <Grid container item xs justifyContent="center">
            <Typography>{topscorer.penalty_goals}</Typography>
          </Grid>
          <Grid container item xs justifyContent="center">
            <Typography>{topscorer.substitutes_on_bench}</Typography>
          </Grid>
          <Grid container item xs justifyContent="center">
            <Typography color="primary">{topscorer.rating || "-"}</Typography>
          </Grid>
        </>
      )}
      lastPage={lastPage}
      page={page}
      setPage={setPage}
    />
  );
}
