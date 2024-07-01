import React, { useState, useEffect } from "react";
import Hidden from "@/components/Hidden/Hidden";
import {
  ActiveSeason,
  Player,
  PlayerCareerEvent,
  Trophy,
  getFixturesByPlayerAndSeason,
  Sidelined as SidelinedType,
  getPlayer,
  getPlayerCareer,
  getPlayerSeasons,
  getPlayerSidelined,
  getTrophiesByPlayer,
  maxPage,
  minPage,
  getPlayerStats,
  getPlayerRatingHistory,
  PlayerStats,
  PlayerRatingHistory,
} from "@/api";
import { Passport } from "@/components/Player/Summary/Passport";
import { TTrophiesResponse, Trophies } from "@/components/Player/Summary/Trophies";
import { Sidelined } from "@/components/Player/Summary/Sidelined";
import { Matches } from "@/components/Player/Matches/Matches";
import { Stats } from "@/components/Player/Stats";
import { useIntl } from "@/hooks/useIntl";
import { usePlayerSeasons } from "@/hooks/usePlayerSeasons";
import { useRouter } from "next/router";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";
import { About } from "@/components/Player/Summary/About";
import { Career } from "@/components/Player/Summary/Career";
import Head from "next/head";
import { RootStore, TInitialStoreState, useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { TFixturesByPlAndSRes } from "@/components/Player/Matches/MatchesTab";
import { PlayerPageLayout } from "@/layouts/player";

type Props = {
  player: Player;
  seasons: ActiveSeason[];
  career: PlayerCareerEvent[];
  fixturesResponse: TFixturesByPlAndSRes;
  trophies: TTrophiesResponse;
  sidelineds: SidelinedType[];
  playerStats: PlayerStats;
  playerRatingHistory: PlayerRatingHistory[];
};

const Summary = ({
  player: initialPlayer,
  career,
  seasons: initialSeasons,
  fixturesResponse: initialFixturesResponse,
  trophies,
  sidelineds,
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
  const ids = seasons.map((season) => season._id);
  const { settings, intermediate } = useMst();

  const playerHasFixtures = !!fixturesResponse.fixtures.length;

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
          {intl.get("title.player.summary", playerTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.player.summary", playerTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.player.summary", playerTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.player.summary", playerTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
      </Head>
      <Passport player={player} />
      <Hidden mdUp>
        {playerStats && playerRatingHistory && (
          <Stats player={player} playerStats={playerStats} playerHistory={playerRatingHistory} />
        )}
      </Hidden>
      {player.has_career && <Career player={player} career={career} />}
      {seasons.length > 0 && playerHasFixtures && <Matches player={player} seasons={seasons} />}
      {player.has_trophies && <Trophies trophies={trophies} player={player} />}
      {player.has_sidelined && <Sidelined player={player} sidelineds={sidelineds} />}
      <About player={player} seasons={seasons} />
    </PlayerPageLayout>
  );
};

export default observer(Summary);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  const id = parseInt(ctx.query.id as string, 10);
  let props: Partial<Props> & TInitialStoreState = {};

  const [getPlayerPromise] = getPlayer(id);
  getPlayerPromise.then((res) => {
    props = { ...props, player: res.data };
  });

  const [getCareerPromise] = getPlayerCareer(id);
  getCareerPromise.then((res) => {
    props = { ...props, career: res.data };
  });

  const [getTrophiesPromise] = getTrophiesByPlayer(id);
  getTrophiesPromise.then((res) => {
    props = { ...props, trophies: res.data as unknown as TTrophiesResponse };
  });

  const [getPlayerSidelinedPromise] = getPlayerSidelined(id);
  getPlayerSidelinedPromise.then((res) => {
    props = { ...props, sidelineds: res.data };
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
    });

  await Promise.all([
    getPlayerPromise,
    getPlayerSeasonsAndFixturesPromise,
    getCareerPromise,
    getPlayerSidelinedPromise,
    getTrophiesPromise,
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
