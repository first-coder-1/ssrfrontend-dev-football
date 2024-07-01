import React, { FC, useContext } from "react";
import Head from "next/head";
import { Summary } from "@/components/Match/Summary/Summary";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { isFinished, isLive, isPenalty } from "@/utils";
import { dateTz } from "@/utils/dateTz";
import { Context } from "@/locales/LocaleProvider";
import { observer } from "mobx-react-lite";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import {
  Comment,
  Fixture,
  FixtureEvent,
  FixtureStats,
  Highlight,
  getFixture,
  getFixtureComments,
  getFixtureEvents,
  getFixtureHighlights,
  getFixtureStats,
} from "@/api";
import Stats from "@/components/Match/Stats";
import { MatchLayout } from "@/layouts/match";
import Venue from "@/components/Venue";
import Videos from "@/components/Match/Videos";

type TMatchVideosProps = {
  fixture: Fixture;
  events: FixtureEvent[];
  highlights: Highlight[];
};

const MatchVideos: FC<TMatchVideosProps> = ({ fixture, events, highlights }) => {
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
          {intl.get("title.match.videos", matchTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.match.videos", matchTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.match.videos", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.match.videos", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Videos fixture={fixture} events={events} highlights={highlights} />
    </MatchLayout>
  );
};

export default observer(MatchVideos);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchVideosProps> = {};
  const matchId = parseInt(ctx.query.matchId as string);

  const [getFixturePromise] = getFixture(matchId);
  const getFixtureAndEventsWithHlPromise = getFixturePromise
    .then(({ data }) => {
      props = { ...props, fixture: data };
      const [getFixtureEventsPromise] = getFixtureEvents(data._id);
      const [getFixtureHighlightsPromise] = getFixtureHighlights(data._id, "clip");
      return Promise.all([getFixtureEventsPromise, getFixtureHighlightsPromise]);
    })
    .then(([eventsRes, highlightsRes]) => {
      props = { ...props, events: eventsRes.data.events, highlights: highlightsRes.data };
    });

  await Promise.all([getFixturePromise, getFixtureAndEventsWithHlPromise]);

  return { props };
});
