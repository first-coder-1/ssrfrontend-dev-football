import { MostExpensiveTransfer, Transfers } from "./types";
import { get } from "./base";

export function getTeamTransferYears(teamId: number) {
  return get<number[]>(`/teams/${teamId}/transfer-years`);
}

export function getTeamTransfersByYear(teamId: number, year: number) {
  return get<Transfers>(`/teams/${teamId}/transfers/${year}`);
}

export function getSeasonTransferYears(seasonId: number) {
  return get<number[]>(`/seasons/${seasonId}/transfer-years`);
}

export function getSeasonTransfersByYear(seasonId: number, year: number) {
  return get<Transfers>(`/seasons/${seasonId}/transfers/${year}`);
}

export function getMostExpensiveTransfers() {
  return get<MostExpensiveTransfer[]>("/players/expensive-transfers");
}
