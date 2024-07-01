import React from "react";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Bookmaker, Market } from "../../../api";
import Asset from "../../../components/Asset";
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
  market: Market;
  columns: React.ReactNode;
  children: (bookmaker: Bookmaker) => React.ReactNode;
};

export function BaseCard(props: Props) {
  const intl = useIntl();
  const { classes } = useStyles();
  const { market, columns, children } = props;
  return (
    <Card>
      <CardHeader
        title={intl.get(`fixtures.markets.${market.name}`)}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <ListItem>
            <Box className={classes.header}>
              <Typography>{intl.get("match.broker")}</Typography>
            </Box>
            <Box className={classes.columns}>{columns}</Box>
          </ListItem>
          {market.bookmaker.map((bookmaker) => (
            <ListItem key={bookmaker.id} className={classes.row}>
              <Box className={classes.header}>
                <Asset src={`/media/bookmakers/${bookmaker.id}.png`} alt={bookmaker.name} />
              </Box>
              <Box className={classes.columns}>{children(bookmaker)}</Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
