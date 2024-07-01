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
  FixtureStats,
  getBookmaker,
  getFixture,
  getFixtureComments,
  getFixtureOdds,
  getFixtureStats,
  Odds as OddsType,
} from "@/api";
import { MatchLayout } from "@/layouts/match";
import Alert from "@mui/material/Alert";
import Odds from "@/components/Match/Odds";

type TMatchOddsProps = {
  fixture: Fixture;
  odds: OddsType;
};

const MatchOdds: FC<TMatchOddsProps> = ({ fixture, odds }) => {
  const { settings, alerts } = useMst();
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
          {intl.get("title.match.odds", matchTitleData)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get("description.match.odds", matchTitleData)} />
        <meta
          property="twitter:title"
          content={`${intl.get("title.match.odds", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta
          property="og:title"
          content={`${intl.get("title.match.odds", matchTitleData)} - ${intl.get(`navbar.soccer`)} - ${
            process.env.REACT_APP_TITLE
          }`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      {!settings.oddsSwitchPositionNotified && (
        <Alert severity="warning" onClose={settings.notifyOddsSwitchPosition} sx={{ mb: 4 }}>
          {intl.get("settings.switch-odds-info")}
        </Alert>
      )}
      <Odds fixture={fixture} settings={settings} alerts={alerts} odds={odds} />
    </MatchLayout>
  );
};

export default observer(MatchOdds);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TMatchOddsProps> = {};
  const matchId = parseInt(ctx.query.matchId as string);
  const locale = ctx.locale;
  const [getBookmakerPromise] = getBookmaker(locale!);
  const [getFixturePromise] = getFixture(matchId);

  const getFixturesAndOddsPromise = getFixturePromise
    .then(({ data }) => {
      props = { ...props, fixture: data };
      return Promise.all([getBookmakerPromise, getFixturePromise]);
    })
    .then(([bookmakerRes, fixtureRes]) => {
      const [getFixtureOddsPromise] = getFixtureOdds(fixtureRes.data._id, bookmakerRes.data._id);
      return getFixtureOddsPromise;
    })
    .then(({ data }) => {
      props = { ...props, odds: data };
    });
    
  await Promise.all([getFixturesAndOddsPromise, getBookmakerPromise]);

  return { props };
});
