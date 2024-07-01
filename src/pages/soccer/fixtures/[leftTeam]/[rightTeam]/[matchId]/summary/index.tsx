import React, { FC, useContext } from "react";
import { Summary } from "@/components/Match/Summary/Summary";
import Head from "next/head";
import { useIntl } from "@/hooks/useIntl";
import {
  AdditionalInfo,
  Fixture,
  FixtureEvent,
  Lineups,
  Squad,
  Squads,
  getCurrentSquadsByTeamAndSeason,
  getFixture,
  getFixtureAdditionalInfo,
  getFixtureEvents,
  getFixtureLineup,
  getFixturesByTeamAndSeason,
  getTeamHistorySeasons,
  maxPage,
  minPage,
} from "@/api";
import { useMst } from "@/store";
import { isFinished, isLive, isPenalty } from "@/utils";
import { dateTz } from "@/utils/dateTz";
import { Context } from "@/locales/LocaleProvider";
import { observer } from "mobx-react-lite";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { getTeamReserves } from "@/utils/getTeamReserves";
import { getActiveSeason } from "@/utils/getActiveSeason";
import { Response } from "@/components/TeamFixtureList";
import { MatchLayout } from "@/layouts/match";
export type TReservesSquads = { localReserves: Squad[]; visitorReserves: Squad[] } | null;

type TMatchSummaryProps = {
  fixture: Fixture;
  events: FixtureEvent[];
  lineups: Lineups;
  reservesSquads: TReservesSquads;
  fixturesRes: { localFixtures: Response; visitorFixtures: Response };
  fixtureAddInfo: AdditionalInfo | undefined;
};

const MatchSummary: FC<TMatchSummaryProps> = ({
  fixture,
  events,
  lineups,
  reservesSquads,
  fixturesRes,
  fixtureAddInfo,
}) => {
  const { settings } = useMst();
  const intl = useIntl();
  const dateFormat = "PPPP";
  const { dateLocale } = useContext(Context);
  const date = dateTz(fixture.time.starting_at, "UTC", dateFormat, dateLocale);
  const matchTitleData = {
    localTeam: (!settings.originalNames && fixture.localteam.name_loc) || fixture.localteam.name,
    visitorTeam: (!settings.originalNames && fixture.visitorteam.name_loc) || fixture.visitorteam.name,
    status: intl.get(`fixtures.statuses.${fixture.time.status}`),
    score:
      isFinished(fixture.time.status) || isPenalty(fixture.time.status) || isLive(fixture.time.status)
        ? `${fixture.scores.localteam_score}:${fixture.scores.visitorteam_score}`
        : `-`,
    date: date,
  };
  return (
    <MatchLayout fixture={fixture}>
      <Head>
        <title>
          {intl.get("title.match.summary", matchTitleData)} - {intl.get(`navbar.soccer`)} -{" "}
          {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.match.summary", matchTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.match.summary", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.match.summary", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
      </Head>
      {fixture && (
        <Summary
          fixture={fixture}
          events={events}
          lineups={lineups}
          reservesSquads={reservesSquads}
          fixturesRes={fixturesRes}
          fixtureAddInfo={fixtureAddInfo}
        />
      )}
    </MatchLayout>
  );
};

export default observer(MatchSummary);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchSummaryProps> = {};
  let commonSquads: { localSquad: Squads<Squad>; visitorSquad: Squads<Squad> } | undefined;
  const matchId = parseInt(ctx.query.matchId as string);

  const [getFixturePromise] = getFixture(matchId);
  const getFixtureAndSquads = getFixturePromise
    .then(({ data }) => {
      props = { ...props, fixture: data };
      const [getCurrentSquadsOfLocalPromise] = getCurrentSquadsByTeamAndSeason(data.localteam._id, data.season_id);
      const [getCurrentSquadsOfVisitorPromise] = getCurrentSquadsByTeamAndSeason(data.visitorteam._id, data.season_id);
      const [getLocalTeamHistorySeasons] = getTeamHistorySeasons(data.localteam._id);
      const [getVisitorTeamHistorySeasons] = getTeamHistorySeasons(data.visitorteam._id);

      return Promise.all([
        getCurrentSquadsOfLocalPromise,
        getCurrentSquadsOfVisitorPromise,
        getLocalTeamHistorySeasons,
        getVisitorTeamHistorySeasons,
      ]);
    })
    .then(([localRes, visitorRes, localSeasonsRes, visitorSeasonsRes]) => {
      const localActiveSeason = getActiveSeason(localSeasonsRes.data, props.fixture?.season_id);
      const visitorActiveSeason = getActiveSeason(visitorSeasonsRes.data, props.fixture?.season_id);

      const [getFixturesTSLocalPromise] = getFixturesByTeamAndSeason(
        props.fixture?.localteam._id!,
        localActiveSeason._id,
        1
      );
      const [getFixturesTSVisitorPromise] = getFixturesByTeamAndSeason(
        props.fixture?.visitorteam._id!,
        visitorActiveSeason._id,
        1
      );
      commonSquads = { localSquad: localRes.data, visitorSquad: visitorRes.data };
      return Promise.all([getFixturesTSLocalPromise, getFixturesTSVisitorPromise]);
    })
    .then(([TSFixturesLocalRes, TSFixturesVisitorRes]) => {
      props = {
        ...props,
        fixturesRes: {
          visitorFixtures: {
            loading: false,
            fixtures: TSFixturesLocalRes.data,
            min: minPage(TSFixturesLocalRes),
            max: maxPage(TSFixturesLocalRes),
          },
          localFixtures: {
            loading: false,
            fixtures: TSFixturesVisitorRes.data,
            min: minPage(TSFixturesVisitorRes),
            max: maxPage(TSFixturesVisitorRes),
          },
        },
      };
    });

  const [getFixtureEventsPromise] = getFixtureEvents(matchId);
  getFixtureEventsPromise.then(({ data }) => {
    props = { ...props, events: data.events };
  });

  const [getFixtureLineupPromise] = getFixtureLineup(matchId);
  getFixtureLineupPromise.then(({ data }) => {
    props = { ...props, lineups: data };
  });

  await Promise.all([getFixturePromise, getFixtureEventsPromise, getFixtureLineupPromise, getFixtureAndSquads])
    .then(([fixturesRes, eventsRes, lineupsRes]) => {
      const [getFixtureAddInfo] = getFixtureAdditionalInfo(fixturesRes.data._id);
      
      const localReserves = getTeamReserves(lineupsRes.data, eventsRes.data.events, commonSquads?.localSquad!);
      const visitorReserves = getTeamReserves(lineupsRes.data, eventsRes.data.events, commonSquads?.visitorSquad!);
      const reservesSquads =
        localReserves && visitorReserves ? { localReserves: localReserves, visitorReserves: visitorReserves } : null;

      props = { ...props, reservesSquads: reservesSquads };

      return getFixtureAddInfo;
    })
    .then(({ data }) => {
      props = { ...props, fixtureAddInfo: data };
    });

  return { props };
});
