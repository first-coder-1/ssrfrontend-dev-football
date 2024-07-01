import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isMatchPath, Item } from "../sitemap";

export function useActiveTab(pages: Item[], customPathname?: string, initialTabIdx?: number) {
  const router = useRouter();
  const { pathname } = customPathname ? { pathname: customPathname } : router;
  const [activeTabIdx, setActiveTabIdx] = useState(initialTabIdx || 0);

  useEffect(() => {
    const index = pages.findIndex((item) => isMatchPath(item, pathname));
    if (index > -1 && index < pages.length) {
      setActiveTabIdx(index);
    }
  }, [pages, pathname]);

  return activeTabIdx;
}
