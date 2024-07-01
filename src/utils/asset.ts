import { CSSProperties } from "react";

export type Variant =
  | "16x16"
  | "32x32"
  | "22x22"
  | "40x40"
  | "48x48"
  | "60x60"
  | "24x"
  | "28x"
  | "32x"
  | "100x"
  | "150x";

interface ISize {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
}

const SIZES: Record<Variant, ISize> = {
  "16x16": {
    width: 16,
    height: "auto",
  },
  "32x32": {
    width: 32,
    height: "auto",
  },
  "22x22": {
    width: 22,
    height: "auto",
  },
  "40x40": {
    width: 40,
    height: "auto",
  },
  "48x48": {
    width: 48,
    height: "auto",
  },
  "60x60": {
    width: 60,
    height: "auto",
  },
  "24x": {
    width: 24,
    height: "auto",
  },
  "28x": {
    width: 28,
    height: "auto",
  },
  "32x": {
    width: 32,
    height: "auto",
  },
  "100x": {
    width: 100,
    height: "auto",
  },
  "150x": {
    width: 150,
    height: "auto",
  },
};
export const getSize = (variant: Variant = "40x40") => SIZES[variant];

// const RETINA_SIZES: Record<Variant, [string, string]> = {
// 	'16x16': ['32x32', '48x48'],
// 	'32x32': ['64x64', '96x96'],
// 	'22x22': ['44x44', '66x66'],
// 	'40x40': ['80x80', '120x120'],
// 	'48x48': ['96x96', '144x144'],
// 	'60x60': ['120x120', '180x180'],
// 	'24x': ['48x', '72x'],
// 	'28x': ['56x', '84x'],
// 	'32x': ['64x', '96x'],
// 	'100x': ['200x', '300x'],
// 	'150x': ['300x', '450x']
// }
// New asset for srcset prop
export function asset(path: string, variant?: Variant) {
  const base = process.env.NEXT_PUBLIC_CDN_URL || "";
  // if (variant !== undefined) {
  // 	const retinaSizes = RETINA_SIZES[variant]
  // 	return `${base}/${variant}${path} 1x, ${base}/${retinaSizes[0]}${path} 2x, ${base}/${retinaSizes[1]}${path} 3x`
  // }

  return `${base}${path}`;
}
