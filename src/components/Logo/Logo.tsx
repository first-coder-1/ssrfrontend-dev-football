import React from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

const svgDir = require.context("@/assets/");

interface IProps {
  className?: string;
}
export const Logo = ({ className }: IProps) => {
  const theme = useTheme();
  return (
    <Image
      width={160.6}
      height={38}
      src={theme.palette.mode === "dark" ? svgDir("./logo-white.svg") : svgDir("./logo.svg")}
      alt="Logo"
      className={className}
    />
  );
};

export const LogoSmall = ({ className }: IProps) => {
  return <Image width={38} height={38} src={svgDir("./logo512.svg")} alt="Logo" className={className} />;
};
