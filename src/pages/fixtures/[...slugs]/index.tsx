import { FixtureLeague, FixtureStatusParam, getFixturesByDate, getLivescores } from "@/api";
import { DynamicHead } from "@/components/FixturesPage/DynamicHead";
import FixtureLeagueItem from "@/components/FixturesPage/FixtureLeagueItem";
import { ItemList } from "@/components/FixturesPage/ItemList";
import { PlaceholderList } from "@/components/FixturesPage/PlaceholderList";
import FixtureLeagueItemSSR from "@/components/FixturesPage/SSRComponents/FixtureLeagueItemSSR";
import { ItemListSSR } from "@/components/FixturesPage/SSRComponents/ItemListSSR";
import { useFixturesStore, useFixturesUpdate } from "@/hooks/useFixtures";
import { useIntl } from "@/hooks/useIntl";
import { FixturesLayout } from "@/layouts/fixtures";
import { Context } from "@/locales/LocaleProvider";
import { useMst } from "@/store";
import { PER_PAGE } from "@/store/FixturesStore";
import { parse } from "@/utils";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { format, isToday } from "date-fns";
import { observer } from "mobx-react-lite";
import { NextPageContext, Redirect } from "next";
import { useRouter } from "next/router";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import { makeStyles } from "tss-react/mui";

interface IInfinityListIndex {
  index: number;
}

enum EFixtureStatus {
  live = "live",
  finished = "fin",
  scheduled = "sch",
}

type TFixturesQuery = {
  date: string | null;
  tab: string;
};

type Props = {
  date?: Date;
  my?: boolean;
  status?: FixtureStatusParam;
  initialLivescores: FixtureLeague[];
  query: TFixturesQuery;
};

const useStyles = makeStyles()((theme) => ({
  content: {
    height: "calc(100% - 68px)",
    [theme.breakpoints.down("md")]: {
      height: "calc(100% - 88px)",
    },
  },
}));

const defineStatus = (tabPath: string) => {
  switch (tabPath) {
    case EFixtureStatus.finished:
      return EFixtureStatus.finished;

    case EFixtureStatus.live:
      return EFixtureStatus.live;

    case EFixtureStatus.scheduled:
      return EFixtureStatus.scheduled;

    default:
      return undefined;
  }
};

const FIXTURES_TABS = ["all", "live", "fin", "sch", "bydate", "my"]; // @TODO: redirecting if path is wrong

const FixturesPages: FC<Props> = ({ initialLivescores, query }) => {
  const intl = useIntl();
  const [tab, setTab] = useState(query.tab);
  const [isMy, setIsMy] = useState(query.tab === "my");
  const [status, setStatus] = useState<FixtureStatusParam | undefined>();
  // const [date, setDate] = useState();
  const [isClient, setIsClient] = useState(false);

  const { settings, favorites } = useMst();
  const { classes } = useStyles();
  const fixturesStore = useFixturesStore();

  const {
    query: { slugs },
  } = useRouter();

  const [qTab, qDate] = slugs as string[];

  const { dateLocale } = useContext(Context);
  const date = useMemo(() => parse(qDate, new Date()), [qDate]);
  const dateString = format(date, "PPP", { locale: dateLocale });

  useEffect(() => {
    setTab(qTab);
  }, [qTab]); // its necessary to have and change this state for server first render purpose

  useEffect(() => {
    const status = defineStatus(tab);
    setStatus(status);
    setIsMy(tab === "my");
  }, [tab]);

  useEffect(() => {
    setIsClient(!isClient);
  }, []);

  useEffect(() => {
    fixturesStore.setConfig(date, status, isMy);
  }, [date, status, isMy]); // eslint-disable-line react-hooks/exhaustive-deps

  useFixturesUpdate(date, status);

  // initial request
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const [, cancel] = fixturesStore.fetchFixtures(isMy ? undefined : 0);
  }, [
    favorites?.leagues,
    date,
    status,
    isMy,
    settings?.orderMatchesBy,
    settings?.esoccer,
    settings?.friendly,
    settings?.women,
    settings?.country,
    settings?.openLeagues,
  ]);

  const isRowLoaded = useCallback(
    ({ index }: IInfinityListIndex) => !!fixturesStore.leagues[index],
    [fixturesStore.leagues]
  );

  if (fixturesStore.showLoader) {
    return <PlaceholderList endWidth="20%" length={5} />;
  }

  return (
    <FixturesLayout>
      <DynamicHead pathname={tab} dateString={dateString} />
      {isClient ? (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={fixturesStore.onLoadMoreRows}
          minimumBatchSize={PER_PAGE}
          rowCount={fixturesStore.leagues.length + PER_PAGE}
        >
          {({ onRowsRendered, registerChild }) => (
            <div className={classes.content}>
              <ItemList
                ref={registerChild}
                leagues={fixturesStore.leagues}
                subItemSize={40}
                onRowsRendered={onRowsRendered}
              >
                {(leagues) =>
                  ({ index, style, key }) => {
                    return (
                      <div key={key} style={style}>
                        <FixtureLeagueItem favorites={favorites} settings={settings} leagueModel={leagues[index]} />
                      </div>
                    );
                  }}
              </ItemList>
            </div>
          )}
        </InfiniteLoader>
      ) : (
        <div className={classes.content}>
          <ItemListSSR leagues={initialLivescores} subItemSize={40}>
            {(leagues) =>
              ({ index, style, key }) => {
                return (
                  <div key={key} style={style}>
                    <FixtureLeagueItemSSR fixtureLeague={leagues[index]} />
                  </div>
                );
              }}
          </ItemListSSR>
        </div>
      )}
    </FixturesLayout>
  );
};

export default observer(FixturesPages);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<Props> = {};

  const [qTab, qDate] = ctx.query.slugs as string[];

  const date = qDate ? parse(qDate, new Date()) : null;

  if (!FIXTURES_TABS.includes(qTab!)) {
    return {
      redirect: {
        permanent: true,
        destination: `/fixtures/all`,
      } as Redirect,
      props: {},
    };
  }

  const status = defineStatus(qTab);

  const [getPromiseLivescores] =
    !date || isToday(new Date(qDate))
      ? getLivescores(false, status, false, true, true, 0, 20, undefined)
      : getFixturesByDate(date, false, status, true, true, true, 0, 20, undefined);

  return getPromiseLivescores.then(({ data }) => {
    props = { ...props, initialLivescores: data, query: { tab: qTab, date: qDate || null } };

    return { props };
  });
});
