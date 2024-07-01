import { NextIntlClientProvider } from "next-intl";
import { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import Layout from "@/components/layout";
import { StoreProvider } from "@/store/RootStore";
import ThemeProvider from "@/mui/ThemeProvider";
import { TssCacheProvider } from "tss-react";
import { isBrowser } from "@/utils";
import createCache from "@emotion/cache";
import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { LocaleProvider } from "@/locales/LocaleProvider";
import { useApiLang } from "@/hooks/useApiLang";
import enTranslations from "@/locales/en.json";
import { MyLeague, MyTeam, getSelectedLeagues, getSelectedTeams } from "@/api";
import { EListType, SEOPopover } from "@/components/SEOPopoverList";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const createEmotionCache = (key: "mui" | "tss") => {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      `meta[name="emotion-insertion-point-${key}"]`
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key, insertionPoint });
};

const clientSideEmotionCacheMUI = createEmotionCache("mui");
const clientSideEmotionCacheTSS = createEmotionCache("tss");

export interface ExtendedAppProps extends AppProps {
  emotionCacheMUI?: EmotionCache;
  emotionCacheTSS?: EmotionCache;
  initialStoreFromCookies?: Record<string, any>;
  Component: NextPageWithLayout;
  popoverData?: { leagues: MyLeague[]; teams: MyTeam[] };
}

const App = (props: ExtendedAppProps) => {
  const {
    Component,
    emotionCacheMUI = clientSideEmotionCacheMUI,
    emotionCacheTSS = clientSideEmotionCacheTSS,
    pageProps,
    initialStoreFromCookies,
    popoverData,
  } = props;

  const { locale } = useRouter();

  useApiLang(locale!);

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <NextIntlClientProvider locale={pageProps.locale} messages={pageProps.messages || {}}>
      <ErrorBoundary>
        <CacheProvider value={emotionCacheMUI}>
          <TssCacheProvider value={emotionCacheTSS}>
            <StoreProvider
              initialStoreFromCookies={initialStoreFromCookies}
              initialStoreFromPage={pageProps.initialStore}
            >
              <ThemeProvider>
                <LocaleProvider locale={locale}>
                  <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
                  {popoverData && <SEOPopover list={popoverData.leagues} listType={EListType.leagues} />}
                  {popoverData && <SEOPopover list={popoverData.teams} listType={EListType.teams} />}
                </LocaleProvider>
              </ThemeProvider>
            </StoreProvider>
          </TssCacheProvider>
        </CacheProvider>
      </ErrorBoundary>
    </NextIntlClientProvider>
  );
};

export default App;

App.getInitialProps = async (ctx: NextPageContext) => {
  const [leaguesPromise] = getSelectedLeagues();
  const [teamsPromise] = getSelectedTeams();

  return Promise.all([leaguesPromise, teamsPromise]).then(([leagues, teams]) => {
    return {
      popoverData: {
        leagues: leagues.data,
        teams: teams.data,
      },
    };
  });
};
