import { useState } from "react";
import { NextPageContext } from "next";
import {
  PlayerAbroad,
  SSPPaginationProps,
  getAbroad,
  handlePaginatedErr,
  handlePaginatedResp,
  pageCount,
} from "@/api";
import { Card, CardHeader, CardContent, Typography, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import SoccerIcon from "@/components/icons/SoccerIcon";
import Flag from "@/components/Flag";
import Scorers from "@/components/Scorers/Scorers";
import PlaceholderList from "@/components/PlaceholderList";
import AboutPlayers from "@/components/PlayersPage/AboutPlayers";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import Head from "next/head";
import { useIntl } from "@/hooks/useIntl";
import { PlayersPageLayout } from "@/layouts/players";
import { getSSPWithT } from "@/utils/get-ssp-i18n";

const useStyles = makeStyles()(() => ({
  icon: {
    verticalAlign: "sub",
  },
}));

export type PlayersAbroadProps = SSPPaginationProps & {
  players: PlayerAbroad[];
};

const PlayersAbroad: React.FC<PlayersAbroadProps> = ({
  players: initialPlayers,
  lastPage: initialLastPage,
}) => {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerAbroad[]>(initialPlayers);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const intl = useIntl();

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getAbroad(page);
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
          {intl.get(`title.players.abroad`)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta
          name="description"
          content={intl.get(`description.players.abroad`)}
        />
      </Head>
      <Card>
        <CardHeader
          title={intl.get("players.abroad")}
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
                  <Typography align="center" title={intl.get("venue.country")}>
                    {intl.get("venue.country").charAt(0)}
                  </Typography>
                </Grid>
                <Grid container item xs justifyContent="center">
                  <SoccerIcon
                    fontSize="small"
                    color="action"
                    viewBox="0 0 16 16"
                    className={classes.icon}
                  />
                </Grid>
                <Grid item xs>
                  <Typography
                    align="center"
                    title={
                      intl.get("fixtures.statuses.PEN_LIVE")[0] +
                      intl
                        .get("fixtures.statuses.PEN_LIVE")
                        .slice(1)
                        .toLowerCase()
                    }
                  >
                    {intl.get("penalty-goals-short")}
                  </Typography>
                </Grid>
              </>
            }
            cells={(scorer) => (
              <>
                <Grid container item xs justifyContent="center">
                  <Flag country={scorer.team_country_iso2} />
                </Grid>
                <Grid container item xs justifyContent="center">
                  <Typography>{scorer.goals}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography align="center">{scorer.penalty_goals}</Typography>
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

export default PlayersAbroad;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const [reqPromise] = getAbroad(1);
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
