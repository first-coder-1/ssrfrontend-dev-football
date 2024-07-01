import { useRouter } from "next/router";

export const useLocale = () => {
  const router = useRouter();

  const changeLocale = (locale: string) => {
    router.push(
      {
        pathname: router.pathname,
        search: String(router.query),
      },
      router.asPath,
      { locale }
    );
  };

  return changeLocale;
};
