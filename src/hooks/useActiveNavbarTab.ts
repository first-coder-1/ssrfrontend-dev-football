import { useEffect, useMemo } from "react";
import sitemap, { isMatchPath, Item } from "../sitemap";
import { useRouter } from "next/router";

export function useIsActiveNavBarTab(to: string) {
  const router = useRouter();
  const foundPage = useMemo(
    () => sitemap.find((page) => isMatchPath(page, to)),
    [to]
  );
  const isActive = useMemo(
    () => isMatchPath(foundPage!, router.pathname),
    [foundPage, router.pathname]
  );

  return isActive;
}
