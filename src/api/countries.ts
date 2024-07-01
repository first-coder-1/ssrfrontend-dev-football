import { get } from "./base";
import { Country } from "./types";

export function getCountries() {
  return get<Country[]>(`/countries`);
}
