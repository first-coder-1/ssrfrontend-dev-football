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
import { Comment, Fixture, FixtureStats, getFixture, getFixtureComments, getFixtureStats } from "@/api";
import Stats from "@/components/Match/Stats";
import { MatchLayout } from "@/layouts/match";
import Venue from "@/components/Venue";

type TMatchVenueProps = {
  fixture: Fixture;
};

const MatchVenue: FC<TMatchVenueProps> = ({ fixture }) => {
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
          {intl.get("title.match.venue", matchTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.match.venue", matchTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.match.venue", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.match.venue", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Venue venue={fixture.venue!} />
    </MatchLayout>
  );
};

export default observer(MatchVenue);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchVenueProps> = {};
  const matchId = parseInt(ctx.query.matchId as string);

  const [getFixturePromise] = getFixture(matchId);
  getFixturePromise.then(({ data }) => {
    props = { ...props, fixture: data };
  });

  await getFixturePromise;

  return { props };
});
