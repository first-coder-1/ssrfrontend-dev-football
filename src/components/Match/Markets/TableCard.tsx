import React, { useMemo } from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Hidden from "@mui/material/Hidden";
import { Market, ODDS_FORMAT } from "../../../api";
import Asset from "../../../components/Asset";
import { Odd } from "@/components/FixturesPage/OddsItem/Odd";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  row: {
    "&:not(:last-child)": {
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
  },
}));

type Entry = {
  id: number;
  name: string;
  players: Map<
    string,
    {
      First?: string;
      Last?: string;
      FirstPrev?: string;
      LastPrev?: string;
      bookmakerEventId?: number;
    }
  >;
};

type Props = {
  market: Market;
  oddsFormat: ODDS_FORMAT;
};

export function TableCard(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { market, oddsFormat } = props;
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const bookmakers = useMemo(() => {
    return market.bookmaker.reduce((map, bookmaker) => {
      return map.set(bookmaker.id, {
        id: bookmaker.id,
        name: bookmaker.name,
        players: bookmaker.odds.data.reduce(
          (map, odd) => {
            let total: string;
            let name: string;
            if (odd.total) {
              name = odd.label;
              total = odd.total;
            } else {
              const parts = odd.label.split(" | ");
              name = parts[0];
              total = parts[1];
            }
            return map.set(name, {
              ...(map.get(name) || {}),
              [total]: odd.dp3,
              [`${total}Prev`]: odd.dp3_prev,
              bookmakerEventId: odd.bookmaker_event_id,
            });
          },
          new Map() as Entry["players"]
        ),
      });
    }, new Map<number, Entry>());
  }, [market]);
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
            <Grid container>
              <Grid item xs={12} sm={3}>
                <Hidden smUp>
                  <Typography>{intl.get("match.name")}</Typography>
                </Hidden>
              </Grid>
              <Grid container item xs={12} sm={9}>
                <Grid item xs={4}>
                  <Typography align="center">{intl.get("match.broker")}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="center">{intl.get("match.first")}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="center">{intl.get("match.last")}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
          {Array.from(bookmakers.entries()).map(([id, bookmaker]) => (
            <React.Fragment key={id}>
              {Array.from(bookmaker.players.entries()).map(([name, entry]) => (
                <ListItem key={name} className={classes.row}>
                  <Grid container>
                    <Grid
                      container
                      item
                      xs={12}
                      sm={3}
                      justifyContent={isMobile ? "center" : "flex-start"}
                      alignItems="center"
                    >
                      <Typography>{name}</Typography>
                    </Grid>
                    <Grid container item xs={12} sm={9}>
                      <Grid container item xs={4} justifyContent="center" alignItems="center">
                        <Asset src={`/media/bookmakers/${id}.png`} alt={bookmaker.name} />
                      </Grid>
                      <Grid container item xs={4} justifyContent="center" alignItems="center">
                        {entry.First ? (
                          <Odd
                            dp3={Number(entry.First)}
                            dp3Prev={Number(entry.FirstPrev)}
                            bookmakerId={bookmaker?.id}
                            eventId={entry.bookmakerEventId}
                            format={oddsFormat}
                          />
                        ) : (
                          "-"
                        )}
                      </Grid>
                      <Grid container item xs={4} justifyContent="center" alignItems="center">
                        {entry.Last ? (
                          <Odd
                            dp3={Number(entry.Last)}
                            dp3Prev={Number(entry.LastPrev)}
                            bookmakerId={bookmaker?.id}
                            eventId={entry.bookmakerEventId}
                            format={oddsFormat}
                          />
                        ) : (
                          "-"
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
