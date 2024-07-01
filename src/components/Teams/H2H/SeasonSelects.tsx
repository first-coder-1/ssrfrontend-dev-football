import React from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import SeasonSelect from "../../../components/SeasonSelect";
import { ContainerSide } from "./Player/GroupTabs";
import { ActiveSeason } from "../../../api";

const useStyles = makeStyles()((theme) => ({
  select: {
    height: 50,
    boxShadow: `inset 0px -3px 0px ${theme.palette.primary.main}`,
  },

  left: {
    [theme.breakpoints.up("md")]: {
      "&.MuiButton-root": {
        borderBottomRightRadius: 0,
        "&:after": {
          content: '""',
          position: "absolute",
          right: 0,
          height: 33,
          width: 1,
        },
      },
    },
  },

  right: {
    [theme.breakpoints.up("md")]: {
      "&.MuiButton-root": {
        borderBottomLeftRadius: 0,
      },
    },
  },

  hiddenSide: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props = {
  leftSeasons: ActiveSeason[];
  leftActiveSeason: ActiveSeason | undefined;
  setLeftActiveSeason: (activeSeason: ActiveSeason | undefined) => void;
  rightSeasons: ActiveSeason[];
  rightActiveSeason: ActiveSeason | undefined;
  setRightActiveSeason: (activeSeason: ActiveSeason | undefined) => void;
  activeSide: ContainerSide;
};

export function SeasonSelects(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const {
    leftSeasons,
    leftActiveSeason,
    setLeftActiveSeason,
    rightSeasons,
    rightActiveSeason,
    setRightActiveSeason,
    activeSide,
  } = props;
  return (
    <Grid container>
      <Hidden mdDown={activeSide !== ContainerSide.LEFT}>
        <Grid item xs={12} md={6}>
          <SeasonSelect
            activeSeason={leftActiveSeason}
            setActiveSeason={setLeftActiveSeason}
            seasons={leftSeasons}
            useSeasonName
            className={cx(classes.select, classes.left)}
          />
        </Grid>
      </Hidden>
      <Hidden mdDown={activeSide !== ContainerSide.RIGHT}>
        <Grid item xs={12} md={6}>
          <SeasonSelect
            activeSeason={rightActiveSeason}
            setActiveSeason={setRightActiveSeason}
            seasons={rightSeasons}
            useSeasonName
            className={cx(classes.select, classes.right)}
          />
        </Grid>
      </Hidden>
    </Grid>
  );
}
