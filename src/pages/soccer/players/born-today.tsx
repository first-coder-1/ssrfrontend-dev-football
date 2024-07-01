import React, { useState } from "react";
import { NextPageContext } from "next";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  BornToday as BornTodayType,
  SSPPaginationProps,
  getBornToday,
  handlePaginatedErr,
  handlePaginatedResp,
  pageCount,
} from "@/api";
import Scorers from "@/components/Scorers/Scorers";
import PlaceholderList from "@/components/PlaceholderList";
import AboutPlayers from "@/components/PlayersPage/AboutPlayers";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { useIntl } from "@/hooks/useIntl";
import Head from "next/head";
import { PlayersPageLayout } from "@/layouts/players";
import { getSSPWithT } from "@/utils/get-ssp-i18n";

const useStyles = makeStyles()(() => ({
  text: {
    width: "100%",
  },
}));

export type BornTodayProps = SSPPaginationProps & {
  players: BornTodayType[];
};

const PlayersBornToday: React.FC<BornTodayProps> = ({
  players: initialPlayers,
  lastPage: initialLastPage,
}) => {
  const intl = useIntl();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<BornTodayType[]>(initialPlayers);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(initialLastPage);

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getBornToday(page);
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
          {intl.get(`title.players.born-today`)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta
          name="description"
          content={intl.get(`description.players.born-today`)}
        />
      </Head>
      <Card>
        <CardHeader
          title={intl.get("players.born-today")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <Scorers
            scorers={players}
            columns={
              <Typography align="right" className={classes.text}>
                {intl.get("players.year")}
              </Typography>
            }
            cells={(scorer) => (
              <Typography align="right" className={classes.text}>
                {scorer.year}
              </Typography>
            )}
            cellSize={1}
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

export default PlayersBornToday;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const [reqPromise] = getBornToday(1);
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
