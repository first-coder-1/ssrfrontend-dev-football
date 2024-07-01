import { IntlInstance, useIntl } from "@/hooks/useIntl";
import Head from "next/head";
import React, { FC } from "react";

type TProps = {
  pathname: string;
  dateString?: string;
};

enum EFixturesPathes {
  live = "live",
  finished = "fin",
  scheduled = "sch",
  all = "all",
  my = "my",
  byDate = "bydate",
}

export const DynamicHead: FC<TProps> = ({ pathname, dateString }) => {
  const intl = useIntl();

  const defineBody = (pathname: string) => {
    switch (pathname) {
      case EFixturesPathes.all:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.all`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.all`)} />
            <meta
              property="twitter:title"
              content={`${intl.get(`title.fixtures.all`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta
              property="og:title"
              content={`${intl.get(`title.fixtures.all`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
          </Head>
        );

      case EFixturesPathes.live:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.live`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.live`)} />
            <meta
              property="twitter:title"
              content={`${intl.get(`title.fixtures.live`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta
              property="og:title"
              content={`${intl.get(`title.fixtures.live`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta name="robots" content="noindex" />
          </Head>
        );

      case EFixturesPathes.finished:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.fin`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.fin`)} />
            <meta
              property="twitter:title"
              content={`${intl.get(`title.fixtures.fin`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta
              property="og:title"
              content={`${intl.get(`title.fixtures.fin`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta name="robots" content="noindex" />
          </Head>
        );

      case EFixturesPathes.my:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.my`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.my`)} />
            <meta name="robots" content="noindex" />
          </Head>
        );

      case EFixturesPathes.scheduled:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.sch`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.sch`)} />
            <meta
              property="twitter:title"
              content={`${intl.get(`title.fixtures.sch`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta
              property="og:title"
              content={`${intl.get(`title.fixtures.sch`)} - ${intl.get(`navbar.soccer`)} - ${
                process.env.REACT_APP_TITLE
              }`}
            />
            <meta name="robots" content="noindex" />
          </Head>
        );

      case EFixturesPathes.byDate:
        return (
          <Head>
            <title>
              {intl.get(`title.fixtures.by-date`, { date: dateString! })} - {intl.get(`navbar.soccer`)} -{" "}
              {process.env.REACT_APP_TITLE}
            </title>
            <meta name="description" content={intl.get(`description.fixtures.by-date`, { date: dateString! })} />
          </Head>
        );

      default:
        return <></>;
    }
  };

  return defineBody(pathname);
};
