import { ActiveSeason } from "@/api";

export const getActiveSeason = (seasons: ActiveSeason[], defaultSeasonId?: number) => {
    return (
      seasons.find((season) => season._id === defaultSeasonId && season.has_fixtures) ||
      seasons.find((season) => season.has_fixtures) ||
      seasons[0]
    );
  };