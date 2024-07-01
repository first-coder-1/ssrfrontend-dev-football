import React from "react";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";
import { cx } from "@emotion/css";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteLoaderList from "../InfiniteLoaderList";
import { SearchLeague } from "../../api";
import useStyles from "./styles";
import { slugify } from "../../utils";
import LeagueImage from "../LeagueImage";
import Flag from "../Flag";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";
import { useRouter } from "next/router";

type Props = {
  leagues: SearchLeague[];
  hideHeader?: boolean;
  onClick?: () => void;
  perPage: number;
  isLastPage?: boolean;
  fetchData?: (startIndex: number) => readonly [Promise<any>, any];
  loading?: boolean;
};

export function LeaguesList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { leagues, hideHeader, onClick, perPage, isLastPage, fetchData, loading } = props;
  const { settings } = useMst();
  return (
    <InfiniteLoader
      isRowLoaded={({ index }) => !!leagues[index]}
      loadMoreRows={
        isLastPage || !fetchData ? () => Promise.resolve(null) : ({ startIndex }) => fetchData(startIndex)[0]
      }
      rowCount={leagues.length + perPage}
      minimumBatchSize={perPage}
    >
      {({ onRowsRendered }) => (
        <InfiniteLoaderList
          onRowsRendered={onRowsRendered}
          rowCount={leagues.length}
          perPage={perPage}
          className={cx(classes.list, { [classes.staticList]: !fetchData })}
        >
          {!hideHeader && (
            <ListItem divider>
              <Typography variant="h6">{intl.get("search.leagues")}</Typography>
            </ListItem>
          )}
          <ListItem divider>
            <Grid item xs={7} sm={6}>
              <Typography>{intl.get("search.name")}</Typography>
            </Grid>
            <Grid item xs={1} sm={3}>
              <Hidden smDown>
                <Typography>{intl.get("search.country")}</Typography>
              </Hidden>
            </Grid>
            <Grid item xs={4} sm={3}>
              <Typography align="center">{intl.get("search.type")}</Typography>
            </Grid>
          </ListItem>
          {leagues.map((league) => (
            <ListItem
              key={league._id}
              divider
              button
              onClick={onClick}
              component={NavLink}
              to={`/soccer/leagues/${slugify(league.name)}/${league._id}/summary`}
            >
              <Grid container item xs={7} sm={6} alignItems="center" wrap="nowrap">
                <LeagueImage
                  url={league.logo_path}
                  name={(!settings.originalNames && league.name_loc) || league.name}
                  variant="22x22"
                  className={classes.image}
                />
                <Typography>{(!settings.originalNames && league.name_loc) || league.name}</Typography>
              </Grid>
              <Grid container item xs={1} sm={3} alignItems="center" wrap="nowrap">
                {league.country_iso2 && <Flag country={league.country_iso2} className={classes.image} />}
                <Hidden smDown>
                  {league.country_iso2 ? <Typography>{intl.get(`countries.${league.country_iso2}`)}</Typography> : ""}
                </Hidden>
              </Grid>
              <Grid item xs={4} sm={3}>
                <Typography align="center">{intl.get(`leagues.${league.type}`)}</Typography>
              </Grid>
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: "center" }}>
              <CircularProgress />
            </ListItem>
          )}
        </InfiniteLoaderList>
      )}
    </InfiniteLoader>
  );
}

export default observer(LeaguesList);
