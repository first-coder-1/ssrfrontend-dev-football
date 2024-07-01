import React, { FC } from "react";
// import intl from 'react-intl-universal';
// import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabbedHeader from "../../components/TabbedHeader";
import TabContainer from "../../components/TabContainer";
import { useActiveTab } from "../../hooks/useActiveTab";
import { pages as pagesUrls } from "../../sitemap";
import { Text } from "@/components/TextPage/Text";
import NavLink from "@/components/shared/NavLink";
import { useIntl } from "@/hooks/useIntl";
import Head from "next/head";
import { DynamicHead } from "@/components/DynamicHead";
import { useRouter } from "next/router";
import { Routes } from "@/components/Router/Routes";
import { Route } from "@/components/Router/Route";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";
import { Page, getPage } from "@/api";

type TTextPageProps = {
  pageContent: Page;
};

const TextPage: FC<TTextPageProps> = ({ pageContent }) => {
  const intl = useIntl();
  const { asPath } = useRouter();
  const active = useActiveTab(pagesUrls, asPath);

  return (
    <>
      <TabbedHeader
        // header={
        //   <Typography variant="h1">
        //     <Routes>
        //       <Route path="privacy-policy" element={<>{intl.get("pages.privacy-policy")}</>} />
        //       <Route path="terms-of-use" element={<>{intl.get("pages.terms-of-use")}</>} />
        //       <Route path="cookie-policy" element={<>{intl.get("pages.cookie-policy")}</>} />
        //       <Route path="legal-information" element={<>{intl.get("pages.legal-information")}</>} />
        //     </Routes>
        //   </Typography>
        // }
        active={active}
      >
        <Tab label={intl.get(`pages.privacy-policy`)} value={0} component={NavLink} to="privacy-policy" />
        <Tab label={intl.get(`pages.terms-of-use`)} value={1} component={NavLink} to="terms-of-use" />
        <Tab label={intl.get(`pages.cookie-policy`)} value={2} component={NavLink} to="cookie-policy" />
        <Tab label={intl.get(`pages.legal-information`)} value={3} component={NavLink} to="legal-information" />
        <TabContainer grow />
      </TabbedHeader>
      <Box sx={{ mt: 4 }}>
        <Routes pathname={asPath}>
          <Route
            path="pages/privacy-policy"
            element={
              <>
                <Head>
                  <title>
                    {intl.get(`title.pages.privacy-policy`)} - {intl.get(`navbar.soccer`)} -{" "}
                    {process.env.REACT_APP_TITLE}
                  </title>
                  <meta name="description" content={intl.get(`description.pages.privacy-policy`)} />
                </Head>
                <Text pageContent={pageContent} pageId="privacy-policy" />
              </>
            }
          />
          <Route
            path="pages/terms-of-use"
            element={
              <>
                <Head>
                  <title>
                    {intl.get(`title.pages.terms-of-use`)} - {intl.get(`navbar.soccer`)} - {process.env.REACT_APP_TITLE}
                  </title>
                  <meta name="description" content={intl.get(`description.pages.terms-of-use`)} />
                </Head>
                <Text pageContent={pageContent} pageId="terms-of-use" />
              </>
            }
          />
          <Route
            path="pages/cookie-policy"
            element={
              <>
                <Head>
                  <title>
                    {intl.get(`title.pages.cookie-policy`)} - {intl.get(`navbar.soccer`)} -{" "}
                    {process.env.REACT_APP_TITLE}
                  </title>
                  <meta name="description" content={intl.get(`description.pages.cookie-policy`)} />
                </Head>
                <Text pageContent={pageContent} pageId="cookie-policy" />
              </>
            }
          />
          <Route
            path="pages/legal-information"
            element={
              <>
                <Head>
                  <title>
                    {intl.get(`title.pages.legal-information`)} - {intl.get(`navbar.soccer`)} -{" "}
                    {process.env.REACT_APP_TITLE}
                  </title>
                  <meta name="description" content={intl.get(`description.pages.legal-information`)} />
                </Head>
                <Text pageContent={pageContent} pageId="legal-information" />
              </>
            }
          />
        </Routes>
      </Box>
    </>
  );
};

export default TextPage;

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props: Partial<TTextPageProps> = {};

  const pageID = ctx.query.tab as string;
  const [getPagePromise] = getPage(pageID);

  await getPagePromise
    .then((res) => {
      props = { ...props, pageContent: res.data };
      return { props };
    })
    .catch(() => {
      return { props };
    });

  return { props };
});
