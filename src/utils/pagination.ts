/**
 * Converts a backend numeration into a normal numeration, for example:
 * ```
 *    -3 -2  1  2  (backend)
 *     1  2  3  4  (normal)
 * ```
 * @param firstPage
 * @param page
 */
export function pageNumber(firstPage: number, page: number) {
  if (firstPage > 0) {
    // if there are no pages in the past, just return the page
    return page;
  } else {
    // otherwise if the page is less than 0, use formula
    //    abs(firstPage) + page + 1
    // and if the page is greater than 0, use
    //    abs(firstPage) + page - 1
    return -1 * Math.sign(page) + Math.abs(firstPage) + page;
  }
}
