import React from "react";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles/createTheme" {
  // noinspection JSUnusedGlobalSymbols
  interface Theme {
    scrollbar: {
      [key: string]: React.CSSProperties;
    };
    textOverflow: {
      whiteSpace: "nowrap";
      overflow: "hidden";
      textOverflow: "ellipsis";
    };
  }
  // noinspection JSUnusedGlobalSymbols
  interface ThemeOptions {
    scrollbar?: {
      [key: string]: React.CSSProperties;
    };
    textOverflow?: React.CSSProperties;
  }

  // noinspection JSUnusedGlobalSymbols
  interface DefaultTheme extends Theme {}
}

const defaultTheme = createTheme();

export default function createCustomTheme(dark?: boolean) {
  const white = dark ? "#f2f2f2" : "#ffffff";
  const grey50 = dark ? "#adb5bd" : "#fcfcfc";
  const grey100 = dark ? "#7e8797" : "#f7f7f7";
  const grey200 = dark ? "#728296" : "#f9f9f9";
  const grey300 = dark ? "#3b4964" : "#f3f4f4";
  const grey400 = dark ? "#394965" : "#ebebeb";
  const grey500 = dark ? "#3c4d69" : "#e6e6e6";
  const grey600 = dark ? "#3c4c68" : "#828282";
  const grey700 = dark ? "#31405a" : "#777777";
  const grey800 = dark ? "#172b4d" : "#4F4F4F";
  const grey900 = "#000000";
  const body1 = dark ? grey50 : grey700;
  const body2 = "#bdbdbd";
  const tooltipBackground = "#525f7f";
  const primary = "#FC7C5F";
  const paper = dark ? grey700 : white;
  const defaultBackground = dark ? grey500 : grey100;

  const scrollbar = {
    "&::-webkit-scrollbar-track": {
      borderRadius: 10,
      backgroundColor: grey100,
    },
    "&::-webkit-scrollbar": {
      width: 8,
      height: 8,
      backgroundColor: grey100,
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 10,
      backgroundColor: primary,
    },
    "&::-webkit-scrollbar-button": {
      width: 0,
      height: 0,
      display: "none",
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: "transparent",
    },
  };

  const fontWeightLight = 400;
  const fontWeightRegular = 500;
  const fontWeightMedium = 600;
  const fontWeightBold = 700;
  return createTheme({
    scrollbar,
    textOverflow: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    breakpoints: {
      values: {
        ...defaultTheme.breakpoints.values,
        md: 960,
        lg: 1280,
        xl: 1440,
      },
    },
    palette: {
      mode: dark ? "dark" : "light",
      primary: {
        main: primary,
        contrastText: white,
      },
      secondary: {
        main: dark ? grey100 : grey800,
        contrastText: dark ? grey100 : white,
      },
      error: {
        main: "#DD4B39",
        light: "#EE9C89",
      },
      warning: {
        main: "#FFD600",
      },
      success: {
        main: "#34A853",
        light: "#90D4A3",
      },
      info: {
        main: "#3462A8",
        light: "#5FB1FC",
      },
      action: {
        active: body2,
      },
      grey: {
        "50": grey50,
        "100": grey100,
        "200": grey200,
        "300": grey300,
        "400": grey400,
        "500": grey500,
        "600": grey600,
        "700": grey700,
        "800": grey800,
        "900": grey900,
      },
      background: {
        default: defaultBackground,
        paper,
      },
    },
    typography: {
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold,
      h1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: fontWeightRegular,
        lineHeight: defaultTheme.typography.pxToRem(21),
        textTransform: "uppercase",
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(15),
        fontWeight: fontWeightBold,
        lineHeight: defaultTheme.typography.pxToRem(18),
        textTransform: "uppercase",
        color: dark ? grey200 : grey800,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: fontWeightMedium,
        lineHeight: defaultTheme.typography.pxToRem(16),
        color: dark ? grey200 : grey800,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(13),
        lineHeight: defaultTheme.typography.pxToRem(15),
        color: dark ? grey200 : grey800,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(13),
        fontWeight: fontWeightMedium,
        lineHeight: defaultTheme.typography.pxToRem(15),
        textTransform: "uppercase",
        color: dark ? grey200 : grey800,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(13),
        fontWeight: fontWeightMedium,
        lineHeight: defaultTheme.typography.pxToRem(15),
        color: dark ? grey200 : grey800,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(13),
        fontWeight: "normal",
        lineHeight: defaultTheme.typography.pxToRem(16),
        color: body1,
        textTransform: "uppercase",
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(16),
        fontWeight: "normal",
        lineHeight: defaultTheme.typography.pxToRem(19),
        color: body1,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(13),
        fontWeight: "normal",
        lineHeight: defaultTheme.typography.pxToRem(16),
        color: body1,
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(13),
        fontWeight: "normal",
        lineHeight: defaultTheme.typography.pxToRem(16),
        color: body2,
      },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          root: {
            height: defaultTheme.spacing(6),
          },
          message: {
            lineHeight: 1.43,
          },
          action: {
            "& .MuiIconButton-root": {
              padding: 5,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: defaultBackground,
          },
          colorSecondary: {
            backgroundColor: dark ? grey800 : paper,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          colorDefault: {
            color: dark ? white : grey700,
          },
        },
      },
      MuiBreadcrumbs: {
        styleOverrides: {
          separator: {
            color: body2,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: fontWeightRegular,
            padding: defaultTheme.spacing(0.75, 2),
          },
          text: {
            padding: defaultTheme.spacing(0.75, 1),
          },
          contained: {
            backgroundColor: grey300,
            boxShadow:
              "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 4px 6px rgba(50, 50, 93, 0.11)",
            "&:hover": {
              backgroundColor: grey500,
            },
          },
          containedPrimary: {
            backgroundColor: primary,
          },
          containedSizeLarge: {
            padding: defaultTheme.spacing(1.6, 2.6),
            borderRadius: defaultTheme.spacing(1.5),
          },
          containedSizeSmall: {
            padding: defaultTheme.spacing(0.5, 1.25),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            "&:not(:last-child)": {
              marginBottom: defaultTheme.spacing(4),
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: defaultTheme.spacing(0, 2.5),
            height: defaultTheme.spacing(5),
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${grey500}`,
          },
          action: {
            marginTop: 0,
            marginRight: 0,
            height: "100%",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
          },
        },
      },
      MuiCardMedia: {
        styleOverrides: {
          root: {
            padding: defaultTheme.spacing(3),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            border: `1px solid ${dark ? grey400 : grey300}`,
            color: body1,
            backgroundColor: dark ? grey400 : grey300,
          },
          colorPrimary: {
            color: white,
            backgroundColor: primary,
          },
          colorSecondary: {
            color: dark ? grey200 : grey500,
            backgroundColor: "transparent",
            borderColor: dark ? grey200 : grey500,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          ".PrivatePickersToolbar-root": {
            backgroundColor: dark ? grey500 : primary,
            "& > .MuiTypography-root": {
              display: "none",
            },
            "& .PrivatePickersToolbar-dateTitleContainer .MuiTypography-root": {
              height: 32,
              fontSize: "1.375rem",
              color: "white",
            },
          },
          ".PrivateDatePickerToolbar-penIcon": {
            visibility: "hidden",
          },
          ".MuiCalendarPicker-root .MuiTypography-caption": {
            color: dark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.38)",
          },
          ".PrivatePickersSlideTransition-root": {
            minHeight: 230,
          },
          ".MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.Mui-selected:focus.Mui-selected":
            {
              willChange: "unset",
              backgroundColor: primary,
            },
          ".MuiPickersDay-today:not(.Mui-selected)": {
            border: "none",
            color: primary,
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: grey300,
            "&:not(.MuiFilledInput-underline)": {
              borderBottomLeftRadius: defaultTheme.shape.borderRadius,
              borderBottomRightRadius: defaultTheme.shape.borderRadius,
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: dark ? grey200 : grey800,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: defaultTheme.spacing(1.5),
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&.MuiSelect-select": {
              lineHeight: "1.1876em",
              minHeight: "1.1876em",
            },
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: "none",
        },
        styleOverrides: {
          root: {
            margin: undefined,
            textDecoration: "none",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            overflow: "auto",
            ...scrollbar,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          button: {
            "& + .MuiListItemSecondaryAction-root": {
              cursor: "pointer",
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: defaultTheme.spacing(5),
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            backgroundColor: dark ? grey600 : grey300,
            paddingTop: defaultTheme.spacing(1),
            paddingBottom: defaultTheme.spacing(1),
            display: "flex",
            alignItems: "center",
          },
          sticky: {
            backgroundColor: dark ? grey600 : grey300,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: dark ? grey500 : grey100,
            },
            "&.Mui-selected:hover": {
              backgroundColor: dark ? grey200 : grey400,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow: "none",
            filter:
              "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.08)) drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08))",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            padding: defaultTheme.spacing(1.5),
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeSmall: {
            fontSize: defaultTheme.spacing(2),
          },
          colorSecondary: {
            color: dark ? grey50 : grey600,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minWidth: defaultTheme.spacing(16),
            fontWeight: fontWeightRegular,
            height: defaultTheme.spacing(8.5),
            boxShadow: `inset 0px -4px 0px ${dark ? grey200 : grey500}`,
            [defaultTheme.breakpoints.up("sm")]: {
              minWidth: defaultTheme.spacing(20),
            },
            [defaultTheme.breakpoints.down("md")]: {
              height: defaultTheme.spacing(6),
              flex: 1,
            },
            "&.Mui-selected": {
              backgroundColor: paper,
            },
            textTransform: "none",
            "&:not(:last-child)": {
              borderRight: `1px solid ${grey400}`,
            },
          },
          textColorPrimary: {
            color: dark ? grey100 : grey700,
            "&.Mui-selected": {
              color: dark ? white : grey900,
              boxShadow: `inset 0px -4px 0px ${primary}`,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: "none",
          },
          scrollButtons: {
            zIndex: 1,
            boxShadow: `inset 0px -4px 0px ${dark ? grey200 : grey500}`,
            "&:first-of-type": {
              borderRight: `1px solid ${grey400}`,
            },
            "&:last-child": {
              borderLeft: `1px solid ${grey400}`,
            },
            "& .MuiSvgIcon-root": {
              color: grey600,
              fontSize: defaultTheme.spacing(3),
            },
            "&.Mui-disabled": {
              opacity: 1,
              "& > svg": {
                opacity: 0,
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: defaultTheme.spacing(1),
            "&:first-of-type": {
              paddingLeft: defaultTheme.spacing(1.5),
            },
            "&:last-child": {
              paddingRight: defaultTheme.spacing(1.5),
            },
            "&[scope=col]": {
              height: defaultTheme.spacing(5),
            },
          },
          head: {
            color: body1,
            fontWeight: fontWeightMedium,
          },
          body: {
            height: defaultTheme.spacing(6),
            color: body1,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: tooltipBackground,
            padding: defaultTheme.spacing(1, 1.5),
            fontSize: 10,
          },
          arrow: {
            color: tooltipBackground,
          },
        },
      },
    },
  });
}
