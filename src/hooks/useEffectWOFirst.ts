/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

export const useEffectWithoutFirstRender = (
  cb: React.EffectCallback,
  deps?: React.DependencyList,
  mainDep?: React.RefObject<any>
) => {
  const isFirstTime = useRef(true);
  const [prevMainDepValue, setPrevMainDepValue] = useState(mainDep?.current);

  useEffect(() => {
    if (mainDep) {
      if (mainDep.current !== prevMainDepValue) {
        setPrevMainDepValue(mainDep.current);
        return cb();
      }
    } else {
      if (isFirstTime.current) {
        isFirstTime.current = false;
      } else {
        return cb();
      }
    }
  }, deps);
};
