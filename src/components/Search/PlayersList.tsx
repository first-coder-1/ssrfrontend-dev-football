import React from "react";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import CircularProgress from "@mui/material/CircularProgress";
import { Position, SearchPlayer } from "@/api";
import { getPositionById, slugify } from "@/utils";
import InfiniteLoaderList from "../InfiniteLoaderList";
import PlayerImage from "../PlayerImage";
import TeamImage from "../TeamImage";
import useStyles from "./styles";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";
import { cx } from "@emotion/css";
import { useRouter } from "next/router";

type Props = {
  players: SearchPlayer[];
  hideHeader?: boolean;
  onClick?: () => void;
  perPage: number;
  isLastPage?: boolean;
  fetchData?: (startIndex: number) => readonly [Promise<any>, any];
  loading?: boolean;
};

export function PlayersList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { players, hideHeader, onClick, perPage, isLastPage, fetchData, loading } = props;
  const { settings } = useMst();
  const { locale } = useRouter();
  return (
    <InfiniteLoader
      isRowLoaded={({ index }) => !!players[index]}
      loadMoreRows={
        isLastPage || !fetchData ? () => Promise.resolve(null) : ({ startIndex }) => fetchData(startIndex)[0]
      }
      rowCount={players.length + perPage}
      minimumBatchSize={perPage}
    >
      {({ onRowsRendered }) => (
        <InfiniteLoaderList
          onRowsRendered={onRowsRendered}
          rowCount={players.length}
          perPage={perPage}
          className={cx(classes.list, { [classes.staticList]: !fetchData })}
        >
          {!hideHeader && (
            <ListItem divider>
              <Typography variant="h6">{intl.get("search.players")}</Typography>
            </ListItem>
          )}
          <ListItem divider>
            <Hidden mdDown>
              <Grid item md={3}>
                <Typography>{intl.get("search.name")}</Typography>
              </Grid>
              <Grid item md={3}>
                <Typography>{intl.get("search.team")}</Typography>
              </Grid>
            </Hidden>
            <Grid container item md={6}>
              <Grid item xs>
                <Typography align="center">{intl.get("search.position")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography align="center">{intl.get("search.age")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography align="center">{intl.get("search.height")}</Typography>
              </Grid>
              <Grid item xs>
                <Typography align="center">{intl.get("search.weight")}</Typography>
              </Grid>
            </Grid>
          </ListItem>
          {players.map((player) => (
            <ListItem
              key={player._id}
              divider
              button
              onClick={onClick}
              component={NavLink}
              to={`/soccer/players/${slugify(player.common_name)}/${player._id}/summary`}
            >
              <Grid container>
                <Grid container item xs={6} md={3} alignItems="center" wrap="nowrap" className={classes.left}>
                  <PlayerImage
                    url={player.image_path}
                    name={(!settings.originalNames && player.common_name_loc) || player.common_name}
                    variant="48x48"
                    className={classes.avatar}
                  />
                  <Typography>{(!settings.originalNames && player.common_name_loc) || player.common_name}</Typography>
                </Grid>
                <Grid container item xs={6} md={3} alignItems="center" wrap="nowrap" className={classes.left}>
                  <TeamImage
                    url={player.team_logo_path}
                    name={(!settings.originalNames && player.team_name_loc) || player.team_name}
                    variant="22x22"
                    className={classes.image}
                  />
                  <Typography>{(!settings.originalNames && player.team_name_loc) || player.team_name}</Typography>
                </Grid>
                <Grid container item xs={12} md={6} alignItems="center" className={classes.right}>
                  <Grid item xs>
                    <Typography align="center">
                      {intl.get(getPositionById(player.position.id || Position.OTHER, true))}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography align="center">{player.age}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography align="center">{player.height}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography align="center">{player.weight}</Typography>
                  </Grid>
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

export default observer(PlayersList);
