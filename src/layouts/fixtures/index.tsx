import React, { FC, ReactNode } from "react";
import { Controls } from "@/components/FixturesPage/Controls";
import { DateSwitch } from "@/components/FixturesPage/DateSwitch";
import { useMst } from "@/store";
import { Hidden, Paper } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { LocaleProvider } from "@/locales/LocaleProvider";

type TFixturesLayoutProps = {
  children: ReactNode | ReactNode[];
};

const useStyles = makeStyles()((theme) => ({
  root: {
    height: `calc(100vh - 224px)`,
    [theme.breakpoints.down("md")]: {
      height: "calc(100vh - 152px)",
    },
  },

  rootHideLivebar: {
    height: `calc(100vh - 160px)`,
  },
}));

export const FixturesLayout: FC<TFixturesLayoutProps> = ({ children }) => {
  const { classes, cx } = useStyles();
  const { settings } = useMst();
  const hideLivebar = settings.hideLivebar;

  return (
      <Paper className={cx(classes.root, hideLivebar && classes.rootHideLivebar)}>
        <Controls />
        <Hidden mdUp>
          <DateSwitch />
        </Hidden>
        {children}
      </Paper>
  );
};
