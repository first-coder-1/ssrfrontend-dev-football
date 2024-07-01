import React from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  header: {
    flex: "0 1 25%",
  },

  columns: {
    flex: "1 0 75%",
    display: "flex",
    justifyContent: "space-around",
  },

  row: {
    [theme.breakpoints.down("md")]: {
      "&:not(:last-child)": {
        borderBottom: `1px solid ${theme.palette.grey[500]}`,
      },
    },
  },
}));

type Props = {
  marketName: string;
  columns: React.ReactNode;
};

export function BaseCard(props: React.PropsWithChildren<Props>): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { marketName, columns, children } = props;
  return (
    <Card>
      <CardHeader
        title={intl.get(`fixtures.markets.${marketName}`)}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <ListItem>
            <Box className={classes.header} />
            <Box className={classes.columns}>{columns}</Box>
          </ListItem>
          <ListItem className={classes.row}>
            <Box className={classes.header} />
            <Box className={classes.columns}>{children}</Box>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
