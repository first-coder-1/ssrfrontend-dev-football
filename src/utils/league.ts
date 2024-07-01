import { FixtureLeagueModel } from "@/models/FixtureLeagueModel";

export function sortLeagues(
  favoriteLeagues: number[],
  locale?: string,
  fl?: boolean,
) {
  return (am: FixtureLeagueModel, bm: FixtureLeagueModel) => {
    const a = am.league;
    const b = bm.league;
    if (favoriteLeagues.includes(a._id) && !favoriteLeagues.includes(b._id)) {
      return -1;
    } else if (
      !favoriteLeagues.includes(a._id) &&
      favoriteLeagues.includes(b._id)
    ) {
      return 1;
    }
    if (a.country.iso2 === locale && b.country.iso2 !== locale) {
      return -1;
    } else if (a.country.iso2 !== locale && b.country.iso2 === locale) {
      return 1;
    }
    if (fl && a.country.iso2 === "EU" && b.country.iso2 !== "EU") {
      return -1;
    } else if (fl && a.country.iso2 !== "EU" && b.country.iso2 === "EU") {
      return 1;
    }

    return 0;
  };
}
