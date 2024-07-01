import { SearchResult } from "./types";
import { get } from "./base";

export function search(query: string, params: object) {
  return get<SearchResult>(`/search/${encodeURIComponent(query)}`, { params });
}

export function searchQuick(query: string) {
  return get<SearchResult>(`/search-quick/${encodeURIComponent(query)}`);
}
