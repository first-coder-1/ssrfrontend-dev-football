import React from "react";
import { observer } from "mobx-react-lite";
import { Login } from "@/components/AuthPage/Login";
import { Signup } from "@/components/AuthPage/Signup";
import { Forgot } from "@/components/AuthPage/Forgot";
import { Reset } from "@/components/AuthPage/Reset";
import { Confirm } from "@/components/AuthPage/Confirm";
import { useMst } from "@/store";
import Head from "next/head";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { Routes } from "@/components/Router/Routes";
import { Route } from "@/components/Router/Route";
import { useRouter } from "next/router";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { NextPageContext } from "next";

export function AuthPage(): React.ReactElement {
  const intl = useIntl();
  const { auth } = useMst();
  const navigate = useNavigate();

  if (auth.user) {
    navigate(`/fixtures`);
  }

  const { asPath } = useRouter();

  return (
    <Routes pathname={asPath}>
      <Route
        path="auth/login"
        element={
          <>
            <Head>
              <title>
                {intl.get(`auth.login`)} - {process.env.REACT_APP_TITLE}
              </title>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Login auth={auth} />
          </>
        }
      />
      <Route
        path="auth/signup"
        element={
          <>
            <Head>
              <title>
                {intl.get(`auth.signup`)} - {process.env.REACT_APP_TITLE}
              </title>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Signup auth={auth} />
          </>
        }
      />
      <Route
        path="auth/confirm/:token"
        element={
          <>
            <Head>
              <title>
                {intl.get(`auth.confirm`)} - {process.env.REACT_APP_TITLE}
              </title>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Confirm auth={auth} />
          </>
        }
      />
      <Route
        path="auth/forgot"
        element={
          <>
            <Head>
              <title>
                {intl.get(`auth.forgot`)} - {process.env.REACT_APP_TITLE}
              </title>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Forgot auth={auth} />
          </>
        }
      />
      <Route
        path="auth/reset/:token"
        element={
          <>
            <Head>
              <title>
                {intl.get(`auth.reset`)} - {process.env.REACT_APP_TITLE}
              </title>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Reset auth={auth} />
          </>
        }
      />
    </Routes>
  );
}

export default observer(AuthPage);

export const getServerSideProps = getSSPWithT(async (ctx: NextPageContext) => {
  let props = {};

  return { props };
});
