import { useEffect, useState } from "react";
import { getActiveSeason, getStagesBySeason, Stage } from "@/api";

export function useStages(
  seasonId?: number,
  defaultStageId?: number | null,
  isEnabled?: boolean,
  withStandings?: boolean,
  initialStages?: Stage[]
) {
  const [stages, setStages] = useState<Stage[]>(initialStages || []);
  const [activeStage, setActiveStage] = useState<Stage>();

  useEffect(() => {
    if (seasonId && isEnabled) {
      const [promise, cancel] = getStagesBySeason(seasonId);
      promise.then(
        (res) => {
          let stagesData = res.data;

          if (withStandings) {
            stagesData = stagesData.filter((stage) => stage.has_standings);
          }

          setStages(stagesData);
          setActiveStage(getActiveSeason(stagesData, defaultStageId));
        },
        () => {
          setStages([]);
          setActiveStage(undefined);
        }
      );
      return cancel;
    }
  }, [seasonId, isEnabled, withStandings, defaultStageId]);

  return [stages, activeStage, setActiveStage] as const;
}
