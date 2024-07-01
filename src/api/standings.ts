import { Standings, StandingsExtended } from "./types";
import { get } from "./base";

export function getStandingsByStage(stageId: number) {
  return get<Standings>(`/standings/${stageId}`);
}

export function getStandingsByStageExtended(stageId: number) {
  return get<StandingsExtended>(`/standings/${stageId}/extended`);
}
