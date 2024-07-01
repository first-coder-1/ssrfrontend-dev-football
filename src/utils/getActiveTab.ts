import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isMatchPath, Item } from "../sitemap";

export function useActiveTab(pages: Item[], customPathname?: string) {
  const router = useRouter();
  const { pathname } = customPathname ? { pathname: customPathname } : router;

  const activeTabIdx = pages.findIndex((item) => isMatchPath(item, pathname));

  const resultActiveTabIdx = activeTabIdx > -1 && activeTabIdx < pages.length ? activeTabIdx : 0;

  return resultActiveTabIdx;
}
