import { useMemo } from "react";

export function useGroupKeys(map: Map<string, any>) {
  return useMemo(
    () =>
      Array.from(map.keys()).sort((a, b) => {
        const intA = parseInt(a, 10);
        const intB = parseInt(b, 10);
        if (!isNaN(intA) && !isNaN(intB)) {
          return intA - intB;
        }
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      }),
    [map],
  );
}
