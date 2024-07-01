import { FixtureStatusParam } from "@/api";
import { useMst } from "@/store";
import { isToday } from "date-fns";
import { useCallback, useEffect } from "react";

export const useFixturesStore = () => useMst().fixtures;

export const useFixturesUpdate = (date?: Date, status?: FixtureStatusParam) => {
  const fixturesStore = useFixturesStore();
  // update from livescores every 10 minutes

  const updateFixtures = useCallback(() => {
    if ((!date || isToday(date)) && (!status || status === "live")) {
      const [, cancelCb] = fixturesStore.fetchFixtures();
      return cancelCb;
    }
    return () => {};
  }, [date, status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let cancelCb: () => void | null = () => null;

    timeout = setInterval(() => {
      cancelCb = updateFixtures();
    }, 600000);

    return () => {
      clearTimeout(timeout);
      cancelCb();
    };
  }, [updateFixtures]);

  const updateFixturesOnVisibility = useCallback(() => {
    if (!document.hidden) {
      updateFixtures();
    }
  }, [updateFixtures]);

  useEffect(() => {
    document.addEventListener("visibilitychange", updateFixturesOnVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateFixturesOnVisibility);
    };
  }, [updateFixturesOnVisibility]);
};
