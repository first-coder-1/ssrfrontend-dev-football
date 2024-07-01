import React, { useState, useEffect } from "react";
import {
  ActiveSeason,
  Player,
  getFixturesByPlayerAndSeason,
  getPlayer,
  getPlayerSeasons,
  maxPage,
  minPage,
  getPlayerStats,
  getPlayerRatingHistory,
  PlayerStats,
  PlayerRatingHistory,
} from "@/api";
import { Matches } from "@/components/Player/Matches/Matches";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import Head from "next/head";
import { RootStore, TInitialStoreState, useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { TFixturesByPlAndSRes } from "@/components/Player/Matches/MatchesTab";
import { PlayerPageLayout } from "@/layouts/player";

type Props = {
  player: Player;
  seasons: ActiveSeason[];
  fixturesResponse: TFixturesByPlAndSRes;
  playerStats: PlayerStats;
  playerRatingHistory: PlayerRatingHistory[];
};

const MatchesPage = ({
  player: initialPlayer,
  seasons: initialSeasons,
  fixturesResponse: initialFixturesResponse,
  playerStats,
  playerRatingHistory,
}: Props): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id as string;
  const intl = useIntl();
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [seasons, setSeasons] = useState(initialSeasons);
  const [loading, setLoading] = useState(true);
  const [fixturesResponse, setFixturesResponse] = useState(initialFixturesResponse);
  const { settings, intermediate } = useMst();

  const playerTitleData = {
    name: player.display_name,
    team_name: player.team_name ? `(${(!settings.originalNames && player.team_name_loc) || player.team_name}) ` : ``,
    country: player.country_iso2 ? `(${intl.get(`countries.${player.country_iso2}`)}) ` : ``,
  };

  useEffect(() => {
    intermediate.setFixturesByPlAndSRes(fixturesResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectWithoutFirstRender(() => {
    setLoading(true);
    const [promise, cancel] = getPlayer(parseInt(id!, 10));
    promise
      .then(
        (res) => setPlayer(res.data),
        () => setPlayer(new Object() as Player)
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [id]);

  return (
    <PlayerPageLayout
      player={initialPlayer}
      playerStats={playerStats}
      playerHistory={playerRatingHistory}
      playerSeasons={initialSeasons}
    >
      <Head>
        <title>
          {intl.get("title.player.matches", playerTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.player.matches", playerTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.player.matches", playerTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.player.matches", playerTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>

      {seasons.length > 0 && <Matches player={player} seasons={seasons} />}
    </PlayerPageLayout>
  );
};

export default observer(MatchesPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const id = parseInt(ctx.query.id as string, 10);
  let props: Partial<Props> & TInitialStoreState = {};

  const [getPlayerPromise] = getPlayer(id);
  getPlayerPromise.then((res) => {
    props = { ...props, player: res.data };
  });

  const [getPlayerStatsPromise] = getPlayerStats(id);
  getPlayerStatsPromise.then((res) => {
    props = { ...props, playerStats: res.data };
  });

  const [getPlayerRatingHistoryPromise] = getPlayerRatingHistory(id);
  getPlayerRatingHistoryPromise.then((res) => {
    props = { ...props, playerRatingHistory: res.data };
  });

  const [getPlayerSeasonsPromise] = getPlayerSeasons(id);
  const getPlayerSeasonsAndFixturesPromise = getPlayerSeasonsPromise
    .then((res) => {
      props = { ...props, seasons: res.data };
      return res.data;
    })
    .then((seasons) => {
      const ids = seasons.map((season) => season._id);
      const [getFixturesByPlAndSPromise] = getFixturesByPlayerAndSeason(id, ids, 1);
      return getFixturesByPlAndSPromise;
    })
    .then((res) => {
      props = {
        ...props,
        fixturesResponse: {
          fixtures: res.data,
          min: minPage(res),
          max: maxPage(res),
          loading: false,
        },
      };
    }); //

  await Promise.all([
    getPlayerPromise,
    getPlayerSeasonsAndFixturesPromise,
    getPlayerStatsPromise,
    getPlayerRatingHistoryPromise,
  ]);

  props.initialStore = RootStore.makeInitialStoreStateForSSP("intermediate", {
    FixturesByPlAndSRes: props.fixturesResponse,
  });

  return {
    props,
  };
});
