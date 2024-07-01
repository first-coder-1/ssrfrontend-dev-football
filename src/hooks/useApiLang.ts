import { useEffect } from "react";
import axios from "@/axios";

const exclude = ["/teams/\\d+/transfer-years"];

const regExp = new RegExp(`(${exclude.join("|")})`);

export function useApiLang(locale: string) {
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const params = config.params || {};
      const defaultLanguage = ["en"];
      if (!regExp.test(config.url || "")) {
        params.lang = defaultLanguage.includes(locale) ? undefined : locale;
      }
      config.params = params;
      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, [locale]);
}
