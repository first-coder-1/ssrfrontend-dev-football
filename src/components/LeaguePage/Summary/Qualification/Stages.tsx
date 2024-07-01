import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
import ChevronLeftIcon from "../../../../components/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../../../components/icons/ChevronRightIcon";
import { Stage as StageModel, TeamSeasonDoubleFixture } from "../../../../api";
import { createTree } from "@/utils";
import { Stage } from "./Stage";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    ...theme.scrollbar,
    height: 375,
    overflow: "auto",
    backgroundColor: theme.palette.background.default,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },

  buttons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      height: theme.spacing(6),
    },
  },

  content: {
    padding: 0,
  },

  switches: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      display: "hidden",
    },
  },

  stages: {
    height: theme.spacing(5),
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
  },
}));

type Props = {
  stages: StageModel[];
  fixtures: TeamSeasonDoubleFixture[][];
};

export function Stages(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const groupStageIndex = props.stages.findIndex((stage) => stage.type === "Group Stage");
  const treeMode =
    groupStageIndex > -1 &&
    groupStageIndex < props.stages.length - 1 &&
    props.fixtures[groupStageIndex + 1]?.length > 0;
  const stages = treeMode
    ? props.stages.slice(groupStageIndex + 1)
    : props.stages.slice(0, groupStageIndex > -1 ? groupStageIndex + 1 : props.stages.length);
  const fixtures = treeMode ? createTree(props.fixtures.slice(groupStageIndex + 1)) : props.fixtures;
  const [active, setActive] = useState(0);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const count = isMobile ? 1 : 3;
  const onNext = () => setActive(Math.min(active + 1, stages.length - count));
  const onPrev = () => setActive(Math.max(active - 1, 0));
  useEffect(() => setActive(0), [isMobile]);
  const buttons = (
    <ListItem divider className={classes.buttons}>
      <Button startIcon={<ChevronLeftIcon color="action" />} onClick={onPrev} disabled={active - 1 < 0}>
        <Typography>{intl.get("prev")}</Typography>
      </Button>
      <Button
        endIcon={<ChevronRightIcon color="action" />}
        onClick={onNext}
        disabled={active + 1 > stages.length - count}
      >
        <Typography>{intl.get("next")}</Typography>
      </Button>
    </ListItem>
  );
  return (
    <List disablePadding>
      <Hidden mdUp>
        <ListItem className={classes.switches}>
          <IconButton onClick={onPrev} disabled={active - 1 < 0}>
            <ChevronLeftIcon color="primary" />
          </IconButton>
          <Typography>{stages[active]?.name}</Typography>
          <IconButton onClick={onNext} disabled={active + 1 > stages.length - count}>
            <ChevronRightIcon color="primary" />
          </IconButton>
        </ListItem>
      </Hidden>
      <Hidden mdDown>{buttons}</Hidden>
      <Hidden mdDown>
        <ListItem className={classes.stages}>
          <Grid container>
            {stages.slice(active, active + count).map((stage) => (
              <Grid item md key={stage._id}>
                <Typography align="center">{stage.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </ListItem>
      </Hidden>
      <ListItem divider className={classes.content}>
        <Grid container className={classes.root}>
          {fixtures.slice(active, active + count).map((fixtures, i) => (
            <Stage key={i} fixtures={fixtures} treeMode={treeMode} />
          ))}
        </Grid>
      </ListItem>
      <Hidden mdUp>{buttons}</Hidden>
    </List>
  );
}
