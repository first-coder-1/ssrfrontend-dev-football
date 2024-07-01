import slug from "slugify";

export function slugify(str?: string | null) {
  return str
    ? slug(str, {
        remove: /[Ǵǵ̂ʹ,°º`'{}!/̃(̆́).*:"&?|–_’ŏ№​​​​​​´­‎ĉǰǎṦ]/,
        lower: true,
      })
    : "";
}
