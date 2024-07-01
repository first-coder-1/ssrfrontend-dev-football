import React from "react";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteLoaderList from "../InfiniteLoaderList";
import { SearchTeam } from "../../api";
import TeamImage from "../TeamImage";
import useStyles from "./styles";
import Flag from "../Flag";
import { slugify } from "../../utils";
import LeagueImage from "../LeagueImage";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { cx } from "@emotion/css";
import NavLink from "../shared/NavLink/NavLink";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";

type Props = {
  teams: SearchTeam[];
  hideHeader?: boolean;
  onClick?: () => void;
  perPage: number;
  isLastPage?: boolean;
  fetchData?: (startIndex: number) => readonly [Promise<any>, any];
  loading?: boolean;
};

export function TeamsList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { teams, hideHeader, onClick, perPage, isLastPage, fetchData, loading } = props;
  const { settings } = useMst();
  const { locale } = useRouter();
  return (
    <InfiniteLoader
      isRowLoaded={({ index }) => !!teams[index]}
      loadMoreRows={
        isLastPage || !fetchData ? () => Promise.resolve(null) : ({ startIndex }) => fetchData(startIndex)[0]
      }
      rowCount={teams.length + perPage}
      minimumBatchSize={perPage}
    >
      {({ onRowsRendered }) => (
        <InfiniteLoaderList
          onRowsRendered={onRowsRendered}
          rowCount={teams.length}
          perPage={perPage}
          className={cx(classes.list, { [classes.staticList]: !fetchData })}
        >
          {!hideHeader && (
            <ListItem divider>
              <Typography variant="h6">{intl.get("search.teams")}</Typography>
            </ListItem>
          )}
          <ListItem divider>
            <Hidden smDown>
              <Grid container item xs={12} sm={7}>
                <Grid item xs={6}>
                  <Typography>{intl.get("search.name")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{intl.get("search.competition")}</Typography>
                </Grid>
              </Grid>
            </Hidden>
            <Grid item xs={6} sm={3}>
              <Typography>{intl.get("search.country")}</Typography>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Typography align="center">{intl.get("search.rating")}</Typography>
            </Grid>
          </ListItem>
          {teams.map((team) => (
            <ListItem
              key={team._id}
              divider
              button
              onClick={onClick}
              component={NavLink}
              to={`/soccer/teams/${slugify(team.name)}/${team._id}/summary`}
            >
              <Grid container>
                <Grid container item xs={12} sm={7} className={classes.left}>
                  <Grid container item xs={6} alignItems="center" wrap="nowrap">
                    <TeamImage
                      url={team.logo_path}
                      name={(!settings.originalNames && team.name_loc) || team.name}
                      variant="32x"
                      className={classes.image}
                    />
                    <Typography>{(!settings.originalNames && team.name_loc) || team.name}</Typography>
                  </Grid>
                  <Grid container item xs={6} alignItems="center" wrap="nowrap">
                    {team.league_name && (
                      <>
                        <LeagueImage
                          url={team.league_logo_path}
                          name={(!settings.originalNames && team.league_name_loc) || team.league_name}
                          variant="22x22"
                          className={classes.image}
                        />
                        <Typography>{(!settings.originalNames && team.league_name_loc) || team.league_name}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid container item xs={6} sm={3} alignItems="center" wrap="nowrap" className={classes.right}>
                  {team.country_iso2 && <Flag country={team.country_iso2} className={classes.image} />}
                  {team.country_iso2 ? <Typography>{intl.get(`countries.${team.country_iso2}`)}</Typography> : ""}
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  sm={2}
                  alignItems="center"
                  justifyContent="center"
                  className={classes.right}
                >
                  <Typography color="primary" align="center">
                    {team.points || "-"}
                  </Typography>
                </Grid>
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

export default observer(TeamsList);
