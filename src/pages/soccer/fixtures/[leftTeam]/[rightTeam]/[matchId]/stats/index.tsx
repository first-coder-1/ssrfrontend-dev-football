import React, { FC, useContext } from "react";
import { Summary } from "@/components/Match/Summary/Summary";
import Head from "next/head";
import { useIntl } from "@/hooks/useIntl";
import { useMst } from "@/store";
import { isFinished, isLive, isPenalty } from "@/utils";
import { dateTz } from "@/utils/dateTz";
import { Context } from "@/locales/LocaleProvider";
import { observer } from "mobx-react-lite";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { Comment, Fixture, FixtureStats, getFixture, getFixtureComments, getFixtureStats } from "@/api";
import Stats from "@/components/Match/Stats";
import { MatchLayout } from "@/layouts/match";

type TMatchStatsProps = {
  fixture: Fixture;
  stats: FixtureStats;
  comments: Comment[];
};

const MatchStats: FC<TMatchStatsProps> = ({ fixture, stats, comments }) => {
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
          {intl.get("title.match.stats", matchTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.match.stats", matchTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.match.stats", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.match.stats", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Stats fixture={fixture} stats={stats} comments={comments} />
    </MatchLayout>
  );
};

export default observer(MatchStats);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchStatsProps> = {};
  const matchId = parseInt(ctx.query.matchId as string);

  const [getFixturePromise] = getFixture(matchId);
  const getFixtureAndStatsAndCommitsPromise = getFixturePromise
    .then(({ data }) => {
      props = { ...props, fixture: data };
      const [getFixtureStatsPromise] = getFixtureStats(data._id);
      const [getFixtureCommentsPromise] = getFixtureComments(data._id);
      return Promise.all([getFixtureStatsPromise, getFixtureCommentsPromise]);
    })
    .then(([statsPromise, fixtureComments]) => {
      props = { ...props, stats: statsPromise.data, comments: fixtureComments.data.comments };
    });

  await Promise.all([getFixturePromise, getFixtureAndStatsAndCommitsPromise]);

  return { props };
});
