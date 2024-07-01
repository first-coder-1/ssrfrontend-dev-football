import React, { useEffect, useState } from "react";
import { NextPageContext } from "next";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { getMostExpensiveTransfers, MostExpensiveTransfer } from "@/api";
import Flag from "@/components/Flag";
import { slugify } from "@/utils";
import NavLink from "@/components/shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  flag: {
    marginRight: theme.spacing(1),
  },

  item: {
    height: theme.spacing(4),
  },
}));

export type MostExpensiveTransfersProps = {
  transfers: MostExpensiveTransfer[];
  locale: string;
  messages: object;
};

const MostExpensiveTransfers: React.FC = () => {
  const { classes } = useStyles();
  const intl = useIntl();
  const [transfers, setTransfers] = useState<MostExpensiveTransfer[]>();

  useEffect(() => {
    const [reqPromise] = getMostExpensiveTransfers();
    reqPromise.then(({ data }) => {
      setTransfers(data);
    });
  }, []);

  return (
    <Card>
      <CardHeader
        title={intl.get("players.most-expensive-transfers")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <List disablePadding>
          <ListSubheader>
            <Grid container>
              <Grid container item xs justifyContent="center">
                <Typography>{intl.get("players.year")}</Typography>
              </Grid>
              <Grid container item xs={6} justifyContent="center">
                <Typography>{intl.get("players.to")}</Typography>
              </Grid>
              <Grid container item xs justifyContent="center">
                <Typography>{intl.get("players.value")}</Typography>
              </Grid>
            </Grid>
          </ListSubheader>
          {!!transfers &&
            transfers.map((transfer) => (
              <ListItem divider key={transfer._id}>
                <Grid container>
                  <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    className={classes.item}
                  >
                    <Flag country={transfer.country_iso2} className={classes.flag} />
                    <Typography
                      component={NavLink}
                      to={`/soccer/players/${slugify(
                        transfer.common_name
                      )}/${transfer._id}/summary`}
                      variant="h6"
                    >
                      {transfer.common_name}
                    </Typography>
                  </Grid>
                  <Grid container item xs justifyContent="center">
                    <Typography>{transfer.transfers.date.substr(0, 4)}</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="center">
                    <Typography
                      component={NavLink}
                      to={`/soccer/teams/${slugify(
                        transfer.transfers.to_team_name
                      )}/${transfer.transfers.to_team_id}/summary`}
                    >
                      {transfer.transfers.to_team_name}
                    </Typography>
                  </Grid>
                  <Grid container item xs justifyContent="center">
                    <Typography>{`€${transfer.transfers.amount}M`}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default MostExpensiveTransfers;

// export const getServerSideProps = async (ctx: NextPageContext) => {
//   const [reqPromise] = getMostExpensiveTransfers();

//   const transfers = await reqPromise.then(({ data }) => data);

//   return {
//     props: {
//       transfers,
//     },
//   };
// };
