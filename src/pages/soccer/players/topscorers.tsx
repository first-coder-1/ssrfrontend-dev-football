import React, { useState } from "react";
import { NextPageContext } from "next";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  getTopscorers,
  handlePaginatedErr,
  handlePaginatedResp,
  pageCount,
  PlayerTopscorer,
  SSPPaginationProps,
} from "@/api";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import PlaceholderList from "@/components/PlaceholderList";
import SoccerIcon from "@/components/icons/SoccerIcon";

import Scorers from "@/components/Scorers/Scorers";
import AboutPlayers from "@/components/PlayersPage/AboutPlayers";
import { useIntl } from "@/hooks/useIntl";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import Head from "next/head";
import { PlayersPageLayout } from "@/layouts/players";

export type PlayersTopscorersProps = SSPPaginationProps & {
  players: PlayerTopscorer[];
};

const useStyles = makeStyles()(() => ({
  icon: {
    verticalAlign: "sub",
  },
}));

const PlayersTopscorers: React.FC<PlayersTopscorersProps> = (props) => {
  const { players: initialPlayers, lastPage: initialLastPage } = props;
  const { classes } = useStyles();
  const [players, setPlayers] = useState<PlayerTopscorer[]>(initialPlayers);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const intl = useIntl();

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getTopscorers(page);
    promise
      .then(
        (res) => {
          setPlayers(res.data);
          setLastPage(pageCount(res, 20, lastPage));
        },
        () => setPlayers([])
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [page]);

  return (
    <PlayersPageLayout>
      <Head>
        <title>
          {intl.get(`title.players.topscorers`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get(`description.players.topscorers`)} />
      </Head>
      <Card>
        <CardHeader
          title={intl.get("players.topscorers")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <Scorers
            scorers={players}
            columns={
              <>
                <Grid item xs>
                  <SoccerIcon fontSize="small" color="action" viewBox="0 0 16 16" className={classes.icon} />
                </Grid>
                <Grid item xs>
                  <Typography
                    align="center"
                    title={
                      intl.get("fixtures.statuses.PEN_LIVE")[0] +
                      intl.get("fixtures.statuses.PEN_LIVE").slice(1).toLowerCase()
                    }
                  >
                    {intl.get("penalty-goals-short")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" title={intl.get("leagues.rating")}>
                    {intl.get("leagues.rating")[0]}
                  </Typography>
                </Grid>
              </>
            }
            cells={(scorer) => (
              <>
                <Grid item xs>
                  <Typography>{scorer.goals}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">{scorer.penalty_goals}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center" color="primary">
                    {scorer.rating || "-"}
                  </Typography>
                </Grid>
              </>
            )}
            cellSize={2}
            lastPage={lastPage}
            page={page}
            setPage={setPage}
          />
          {loading && <PlaceholderList size={80} />}
        </CardContent>
      </Card>
    </PlayersPageLayout>
  );
};

export default PlayersTopscorers;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const [reqPromise] = getTopscorers(1);
  const { data: players, ...rest } = await reqPromise.then(handlePaginatedResp()).catch(handlePaginatedErr);

  return {
    props: {
      players,
      ...rest,
    },
  };
});
