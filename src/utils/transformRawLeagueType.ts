import { LeagueType } from "@/api";

export const transformRawLeagueType = (rawType: string) => {
  switch (rawType) {
    case "domestic":
      return LeagueType.DOMESTIC;
    case "international":
      return LeagueType.INTERNATIONAL;
    case "domestic-cup":
      return LeagueType.DOMESTIC_CUP;
    case "cup-international":
      return LeagueType.CUP_INTERNATIONAL;
  }
};
