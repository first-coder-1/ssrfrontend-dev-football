import React from "react";

import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Hidden from "@/components/Hidden/Hidden";
import { useAdvertisement } from "../../hooks/useAdvertisement";
import AdSlot from "../AdSlot";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },

  banner: {
    boxShadow: "0px 1px 0px #E9ECEF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[500],
    [theme.breakpoints.down("sm")]: {
      height: 50,
    },
    [theme.breakpoints.down("md")]: {
      height: 60,
    },
    [theme.breakpoints.up("md")]: {
      height: 90,
    },
  },

  actions: {
    height: 30,
    justifyContent: "center",
  },
}));

const ID = "p-bottom";

export function BottomAdvertisement() {
  const intl = useIntl();
  const { classes } = useStyles();
  const visible = useAdvertisement(ID);

  if (visible) {
    return (
      <Card className={classes.root}>
        <CardContent className={classes.banner}>
          <Hidden smUp>
            <AdSlot id={ID} size={[[320, 50]]} />
          </Hidden>
          <Hidden smDown mdUp>
            <AdSlot id={ID} size={[[468, 60]]} />
          </Hidden>
          <Hidden mdDown>
            <AdSlot id={ID} size={[[728, 90]]} />
          </Hidden>
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography variant="body2">{intl.get("footer.advertise")}</Typography>
        </CardActions>
      </Card>
    );
  }

  return null;
}

export default observer(BottomAdvertisement);
