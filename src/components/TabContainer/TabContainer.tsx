import React from "react";
import { makeStyles } from "tss-react/mui";
import Tab, { TabProps } from "@mui/material/Tab";

const useStyles = makeStyles()((theme) => ({
  root: {
    opacity: 1,
    flex: "0 0 auto",
    pointerEvents: "all",
    padding: 0,
    minWidth: "auto",
    "&.Mui-selected": {
      boxShadow: `inset 0px -4px 0px ${
        theme.palette.grey[theme.palette.mode === "dark" ? 200 : 500]
      }`,
    },
  },

  grow: {
    flexGrow: 1,
    minWidth: "initial",
    maxWidth: "initial",
  },
}));

type Props = TabProps & {
  grow?: boolean;
};

const TabContainer = React.forwardRef<HTMLDivElement, Props>(
  ({ className, grow, ...rest }, ref) => {
    const { classes, cx } = useStyles();
    return (
      <Tab
        component="div"
        ref={ref}
        className={cx(className, classes.root, { [classes.grow]: grow })}
        {...rest}
        disableRipple
        onChange={() => null}
      />
    );
  }
);

TabContainer.displayName = "TabContainer";

export default TabContainer;
