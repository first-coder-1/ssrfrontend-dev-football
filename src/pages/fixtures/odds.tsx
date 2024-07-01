import React from "react";
import { Odds } from "@/components/FixturesPage/Odds";
import { useIntl } from "@/hooks/useIntl";
import { FixturesLayout } from "@/layouts/fixtures";
import { useMst } from "@/store";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { observer } from "mobx-react-lite";
import { NextPageContext, Redirect } from "next";
import Head from "next/head";
import { getCookie } from "cookies-next";

const OddsPage = () => {
  const intl = useIntl();
  const { favorites, settings } = useMst();

  return (
    <FixturesLayout>
      <Head>
        <title>
          {intl.get(`title.fixtures.odds`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
        </title>
        <meta name="description" content={intl.get(`description.fixtures.odds`)} />
        <meta
          property="twitter:title"
          content={`${intl.get(`title.fixtures.odds`)} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
        />
        <meta
          property="og:title"
          content={`${intl.get(`title.fixtures.odds`)} - ${intl.get(`navbar.soccer`)} - ${process.env.REACT_APP_TITLE}`}
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Odds favorites={favorites} settings={settings} />
    </FixturesLayout>
  );
};

export default observer(OddsPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props = {};

  if (getCookie("openOdds") != "true") {
    return {
      redirect: {
        permanent: true,
        destination: `/404`,
      } as Redirect,
      props: {},
    };
  }

  return { props };
});
