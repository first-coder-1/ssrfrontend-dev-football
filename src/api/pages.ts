import { Page } from "./types";
import { get } from "./base";

export function getPage(pageId: string) {
  return get<Page>(`/pages/${pageId}`);
}
