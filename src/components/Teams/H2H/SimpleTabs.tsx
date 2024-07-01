import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Circle from "../../../components/Circle";
import TabContainer from "../../../components/TabContainer";
import TabPanel from "../../../components/TabPanel";

const useStyles = makeStyles<void, "circle">()((theme, _params, classes) => ({
  indicator: {
    display: "none",
  },
  tab: {
    "&.MuiTab-root, &.MuiTab-root.Mui-selected": {
      boxShadow: `inset 0px -1px 0px ${theme.palette.grey[500]}`,
      ...(theme.typography.subtitle1 as {}),
      "&.Mui-selected": {
        ...(theme.typography.h5 as {}),
        [`& .circlee`]: {
          opacity: 0.5,
        },
      },
    },
  },
  tabContent: {
    display: "flex",
    alignItems: "center",
  },
  circle: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  children: React.ReactElement[];
  titles: string[];
};

export function SimpleTabs(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { children, titles } = props;
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        classes={{ indicator: classes.indicator }}
      >
        {titles.map((title, i) => (
          <Tab
            key={title}
            value={i}
            label={
              <Box className={classes.tabContent}>
                <Circle className={cx(classes.circle, "circlee")} />
                <Typography variant="inherit">{title}</Typography>
              </Box>
            }
            className={classes.tab}
          />
        ))}
        <TabContainer grow className={classes.tab} />
      </Tabs>
      {children.map((child, i) => (
        <TabPanel key={child.key} value={activeTab} index={i}>
          {child}
        </TabPanel>
      ))}
    </>
  );
}
