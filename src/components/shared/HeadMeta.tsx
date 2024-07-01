import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, PropsWithChildren } from "react";
// import {
//   HELLO_RADIUS_DOMAIN_PROD,
//   HELLO_RADIUS_DOMAIN_DEV,
// } from "@/constants/routes";

export type HeadMetaProps = {
  title?: string;
  overwriteTitle?: boolean;
  description?: string | null;
  og?: Partial<{
    type: string;
    title: string;
    description: string;
    imageURL: string;
  }> | null;
};

const TEST_OG_IMAGE_LINK =
  "https://cambuci.vteximg.com.br/arquivos/lovo-vertical-pnty-01.jpg?v=637725934974900000";

const HeadMeta: FC<PropsWithChildren<HeadMetaProps>> = ({
  children,
  title,
  description = "Penalty Test description",
  og = null,
}) => {
  const { pathname } = useRouter();

  const getTitle = () => {
    if (title) {
      return `${title}` + " | Penalty";
    } else {
      return "Penalty";
    }
  };

  const pageTitle = getTitle();
  const ogMeta = {
    type: og?.type || "website",
    title: og?.title || pageTitle,
    description: og?.description || description || "",
    imageURL: TEST_OG_IMAGE_LINK,
  };

  const domain = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const url = domain + pathname;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description || "Test"} />

      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="google" content="notranslate" />
      <meta name="googlebot" content="notranslate, noarchive" />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogMeta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogMeta.imageURL} />

      <link rel="canonical" href={url} />

      {children}
    </Head>
  );
};

HeadMeta.displayName = "HeadMeta";

export default HeadMeta;
