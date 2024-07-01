import { NextPageContext } from "next";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  getCardscorers,
  handlePaginatedErr,
  handlePaginatedResp,
  pageCount,
  PlayerCardscorer,
  SSPPaginationProps,
} from "@/api";
import Scorers from "@/components/Scorers/Scorers";
import PlaceholderList from "@/components/PlaceholderList";
import AboutPlayers from "@/components/PlayersPage/AboutPlayers";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { NextPageWithLayout } from "@/pages/_app";
import { useIntl } from "@/hooks/useIntl";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import Head from "next/head";
import { PlayersPageLayout } from "@/layouts/players";

export type CardscorersProps = SSPPaginationProps & {
  players: PlayerCardscorer[];
};

const PlayersCardscorers: NextPageWithLayout<CardscorersProps> = ({
  players: initialPlayers,
  lastPage: initialLastPage,
}) => {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerCardscorer[]>(initialPlayers);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(initialLastPage);

  const intl = useIntl();

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getCardscorers(page);
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
          {intl.get(`title.players.cardscorers`)} - {intl.get(`navbar.soccer`)}{" "}
          - {process.env.REACT_APP_TITLE}
        </title>
        <meta
          name="description"
          content={intl.get(`description.players.cardscorers`)}
        />
      </Head>
      <Card>
        <CardHeader
          title={intl.get("players.disciplinary")}
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
                  <Typography
                    align="center"
                    title={intl.get("leagues.stats.yellow-cards")}
                  >
                    {intl.get("yellowcards-short")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography
                    align="center"
                    title={intl.get("leagues.stats.red-cards")}
                  >
                    {intl.get("redcards-short")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">
                    {intl.get("players.points")}
                  </Typography>
                </Grid>
              </>
            }
            cells={(scorer) => (
              <>
                <Grid item xs>
                  <Typography align="center">{scorer.yellowcards}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">{scorer.redcards}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">
                    {scorer.yellowcards + scorer.redcards * 2}
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

export default PlayersCardscorers;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const [reqPromise] = getCardscorers(1);
  const { data: players, ...rest } = await reqPromise
    .then(handlePaginatedResp())
    .catch(handlePaginatedErr);

  return {
    props: {
      players,
      ...rest,
    },
  };
});
