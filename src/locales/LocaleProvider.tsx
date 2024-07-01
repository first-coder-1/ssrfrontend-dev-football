import React, { createContext, useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import en from "./en.json";
import { useApiLang } from "../hooks/useApiLang";
import { useMst } from "../store";
import { fallbackLocale, getLocaleCode } from "./constants";
import { useIntl } from "@/hooks/useIntl";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

export const Context = createContext({ locale: fallbackLocale, dateLocale: undefined as Locale | undefined });

type Props = {
  locale?: string;
};

export const LocaleProvider = observer((props: React.PropsWithChildren<Props>): React.ReactElement => {
  const intl = useIntl();
  const { locale } = useRouter();
  const { settings } = useMst();
  const [initialized, setInitialized] = useState(true);
  const [dateLocale, setDateLocale] = useState<Locale | undefined>();
  const currentLocale = locale!;

  useEffect(() => {
    setInitialized(false);
    Promise.all([
      // import(
      //   /* webpackChunkName: "locale" */
      //   /* webpackMode: "lazy" */
      //   `./${currentLocale}.json`
      // ).then((module) => {
      //   // return intl.init({
      //   //   currentLocale,
      //   //   fallbackLocale,
      //   //   locales: { en, [currentLocale]: module.default },
      //   // }); // @TODO: RESOLVE THIS
      // }),
      import(
        /* webpackChunkName: "locale" */
        /* webpackMode: "lazy" */
        `date-fns/locale/${getLocaleCode(currentLocale)}/index.js`
      ).then((module) => {
        // console.log(module.default);
        setDateLocale(module.default);
      }),
    ]).then(() => setInitialized(true));
    settings.changeLocale(currentLocale);
  }, [settings, currentLocale]);

  useApiLang(currentLocale);

  return (
    <Context.Provider value={{ locale: currentLocale, dateLocale }}>{initialized && props.children}</Context.Provider>
  );
});
