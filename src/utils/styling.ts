import { CSSObject } from "tss-react";

export type TStyleCls<CssClassesKey extends string> = Record<CssClassesKey, CSSObject>;
