/* eslint-disable @next/next/no-img-element */
// @TODO: replace with <Image /> in next week
import React, { useMemo } from "react";
import { asset, getSize, Variant } from "@/utils/asset";

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: Variant;
}

export function Asset({ src, variant, alt, ...rest }: IProps) {
  const size = useMemo(() => getSize(variant), [variant]);

  if (variant === undefined) {
    return <img src={asset(src || "")} alt={alt} {...rest} />;
  }

  return (
    <img
      src={asset(src || "", variant)}
      width={size.width}
      height={size.height}
      alt={alt}
      {...rest}
    />
  );
}

export default Asset;
