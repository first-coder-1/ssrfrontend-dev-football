import React from "react";

import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  header: {
    ...theme.textOverflow,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "55vw",
    },
  },

  country: {
    [theme.breakpoints.down("md")]: {
      maxWidth: "55vw",
      textAlign: "center",
    },
  },
}));

type Props = {
  item: {
    name: string;
    name_loc?: string;
    country_iso2?: string;
  };
};

export function HeaderBox(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { item } = props;
  const { settings } = useMst();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h1" className={classes.header}>
        {(!settings.originalNames && item?.name_loc) || item?.name}
      </Typography>
      {item?.country_iso2 && (
        <Typography className={classes.country}>{intl.get(`countries.${item.country_iso2}`)}</Typography>
      )}
    </Box>
  );
}

export default observer(HeaderBox);
