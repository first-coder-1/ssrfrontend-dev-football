import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export interface IntlInstance {
  get(trans: string): string;
  get(trans: string, values: Record<string, string | number>): string;
  getHTML(trans: string): ReactElement;
  getHTML(trans: string, values: Record<string, string>): ReactElement;
}

export interface ReactIntlUniversalOptions {
  currentLocale?: string;
  locales?: { [key: string]: any };
  fallbackLocale?: string;
  commonLocaleDataUrls?: { [key: string]: string };
  cookieLocaleKey?: string;
  urlLocaleKey?: string;
  localStorageLocaleKey?: string;
  warningHandler?: (message?: any, error?: any) => void;
  escapeHtml?: boolean;
}

function parseRaw(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] || match;
  });
}

export function useIntl(ns?: string): IntlInstance {
  const t = useTranslations(ns);
  return {
    get: (trans: string, values?: Record<string, string | number>) => {
      if (values) {
        return t(trans, values);
      } else {
        return t(trans);
      }
    },
    getHTML: (trans: string, values?: Record<string, string>) => {
      const rawTxt = t.raw(trans);
      let res = rawTxt;
      if (values) res = parseRaw(rawTxt, values);

      return <div dangerouslySetInnerHTML={{ __html: res }} />;
    },
  };
}
