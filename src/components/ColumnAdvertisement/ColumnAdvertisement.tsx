import React from "react";

import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAdvertisement } from "../../hooks/useAdvertisement";
import AdSlot from "../AdSlot";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  root: {},

  banner: {
    height: 150,
    boxShadow: "0px 1px 0px #E9ECEF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[500],
  },

  actions: {
    height: 30,
    justifyContent: "center",
  },
}));

const ID = "p-column";
export function ColumnAdvertisement(): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const visible = useAdvertisement(ID);

  if (visible) {
    return (
      <Card className={classes.root}>
        <CardContent className={classes.banner}>
          <AdSlot
            id={ID}
            size={[
              [180, 150],
              [216, 54],
              [220, 90],
              [216, 36],
            ]}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography variant="body2">{intl.get("footer.advertise")}</Typography>
        </CardActions>
      </Card>
    );
  }
  return null;
}

export default observer(ColumnAdvertisement);
