import { GetServerSidePropsResult, NextPageContext, Redirect } from "next";
import deepmerge from "deepmerge";

import enTranslations from "@/locales/en.json";
export const getSSPWithT =
  <P = {}>(callback?: (ctx: NextPageContext) => Promise<GetServerSidePropsResult<P>>) =>
  async (ctx: NextPageContext) => {
    try {
      const locale = ctx.locale || ctx.defaultLocale;
      const userMessages = (await import(`@/locales/${locale}.json`)).default;
      const defaultMessages = (await import(`@/locales/en.json`)).default;
      const messages = deepmerge(defaultMessages, userMessages);

      if (callback) {
        const callbackData = (await callback(ctx)) as { props: object; redirect?: Redirect };
        if (!!callbackData.redirect) return callbackData;
        if (!callbackData.props) return callbackData;
        return { props: { ...callbackData.props, messages, locale } };
      } else {
        return {
          props: { messages, locale },
        };
      }
    } catch {
      return {
        props: { messages: { enTranslations }, locale: "en" },
      };
    }
  };
