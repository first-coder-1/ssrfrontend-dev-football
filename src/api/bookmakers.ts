import { BookmakerShort } from "./types";
import { get } from "./base";

export function getBookmaker(locale: string) {
  return get<BookmakerShort>(`/bookmakers/${locale}`);
}

export function getBookmakers() {
  return get<BookmakerShort[]>("/bookmakers");
}
