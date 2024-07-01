import { Breakpoint, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useCurrentBreakpoint = () => {
  const theme = useTheme();

  const isXSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  let breakpoint: Breakpoint = "xl";

  if (isXSmall) {
    breakpoint = "xs";
  } else if (isSmall) {
    breakpoint = "sm";
  } else if (isMedium) {
    breakpoint = "md";
  } else if (isLarge) {
    breakpoint = "lg";
  } else if (isXLarge) {
    breakpoint = "xl";
  }

  return breakpoint;
};
