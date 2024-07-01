import React from "react";
// import { useLocation, useParams } from "react-router";
import { useTheme } from "@mui/material/styles";
import { locales } from "../../locales";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  generateUrl?: (locale: string) => string;
  params?: object;
  children?: React.ReactNode;
};

const extendedLocales: { [key: string]: string } = { pt: "pt-BR", zh: "zh-CN" };

export function DefaultHead(props: Props): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();
  // const location = useLocation();
  let lang = router.locale!;
  if (lang in extendedLocales) {
    lang = extendedLocales[lang];
  }
  const generateUrl =
    props.generateUrl ||
    ((locale: string) =>
      `${window.location.origin}${decodeURIComponent(router.asPath.replace(/^\/\w{2}/, `/${locale}`))}`); //@TODO: implement logic for doing this only in client
  return (
    <Head>
      <html lang={lang} prefix="og:https://ogp.me/ns#" translate="no" />
      <link rel="canonical" href={generateUrl(router.locale!)} />
      <meta
        name="theme-color"
        content={theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.primary.main}
      />
      <link rel="alternate" hrefLang="x-default" href={generateUrl("en")} />
      <meta property="og:site_name" content={process.env.REACT_APP_TITLE} />
      <meta property="og:url" content={generateUrl(router.locale!)} />
      <meta property="og:locale" content={lang} />
      <meta property="al:android:package" content="com.penalty.app" />
      {locales
        .filter((locale) => locale !== "en")
        .map((locale) => (
          <link key={locale} rel="alternate" hrefLang={extendedLocales[locale] ?? locale} href={generateUrl(locale)} />
        ))}
      {props.children}
    </Head>
  );
}

export default DefaultHead;
