import { createEmotionCache } from "@/utils/createEmotionCache";
import Document, { Html, Head, Main, NextScript, DocumentProps, DocumentContext } from "next/document";
import { AppType } from "next/app";
import { type ExtendedAppProps } from "./_app";
import createEmotionServer from "@emotion/server/create-instance";
import { retrieveInitialStoreFromCookies } from "@/utils/cookies";
import { setCookie } from "cookies-next";
import axios from "@/axios";

// import { augmentDocumentWithEmotionCache_tss } from "./_app";

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

const MyDocument = ({ emotionStyleTags }: MyDocumentProps) => {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point-mui" content="" />
        <meta name="emotion-insertion-point-tss" content="" />
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  let initialStoreFromCookies = retrieveInitialStoreFromCookies(ctx?.req, ctx?.res);
  const locale = ctx.locale || ctx.defaultLocale || "en";

  const interceptor = axios.interceptors.request.use(
    (config) => {
      config.params = config.params || {};
      config.params["lang"] = locale;
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  axios.interceptors.request.eject(interceptor);

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cacheMUI = createEmotionCache("mui");
  const cacheTSS = createEmotionCache("tss");
  const { extractCriticalToChunks: cacheChunksMUI } = createEmotionServer(cacheMUI);
  const { extractCriticalToChunks: cacheChunksTSS } = createEmotionServer(cacheTSS);

  setCookie("NEXT_LOCALE", locale, { req: ctx.req, res: ctx.res });

  // We're passing `emotionCache` to App component
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & ExtendedAppProps>) =>
        function EnhanceApp(props) {
          const propsData = {
            ...props,
            initialStoreFromCookies,
            locale,
          };
          return <App emotionCacheMUI={cacheMUI} emotionCacheTSS={cacheTSS} {...propsData} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStylesMUI = cacheChunksMUI(initialProps.html);
  const emotionStylesTSS = cacheChunksTSS(initialProps.html);
  const emotionStyleTags = [...emotionStylesMUI.styles, ...emotionStylesTSS.styles].map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // return emotionStyleTags as props
    emotionStyleTags,
  };
};
