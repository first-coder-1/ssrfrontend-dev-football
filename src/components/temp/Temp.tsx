import React from "react";
import Link from "next/link";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Hidden from "@/components/Hidden/Hidden";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteLoaderList from "@/components/InfiniteLoaderList";
import { SearchTeam } from "@/api";
import useStyles from "./styles";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { cx } from "@emotion/css";
import { useTranslations } from "next-intl";
// import TeamImage from "../TeamImage";
// import Flag from "../Flag";
// import LeagueImage from "../LeagueImage";

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
  const { classes } = useStyles();
  const { teams, hideHeader, onClick, perPage, isLastPage, fetchData, loading } = props;
  const { settings } = useMst();
  //
  const t = useTranslations("search");
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
              <Typography variant="h6">{t("teams")}</Typography>
            </ListItem>
          )}
          <ListItem divider>
            <Hidden smDown>
              <Grid container item xs={12} sm={7}>
                <Grid item xs={6}>
                  <Typography>{t("name")}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{t("competition")}</Typography>
                </Grid>
              </Grid>
            </Hidden>
            <Grid item xs={6} sm={3}>
              <Typography>{t("country")}</Typography>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Typography align="center">{t("rating")}</Typography>
            </Grid>
          </ListItem>
          {teams.map((team) => (
            <ListItemButton
              key={team._id}
              divider
              onClick={onClick}
              component={Link}
              href={`/soccer/teams/${slugify(team.name)}/${team._id}/summary`}
            >
              <Grid container>
                <Grid container item xs={12} sm={7} className={classes.left}>
                  <Grid container item xs={6} alignItems="center" wrap="nowrap">
                    {/* TODO: <TeamImage
                      url={team.logo_path}
                      name={
                        (!settings.originalNames && team.name_loc) || team.name
                      }
                      variant="32x"
                      className={classes.image}
                    /> */}
                    <Typography>{(!settings.originalNames && team.name_loc) || team.name}</Typography>
                  </Grid>
                  <Grid container item xs={6} alignItems="center" wrap="nowrap">
                    {team.league_name && (
                      <>
                        {/* TODO: <LeagueImage
                          url={team.league_logo_path}
                          name={
                            (!settings.originalNames && team.league_name_loc) ||
                            team.league_name
                          }
                          variant="22x22"
                          className={classes.image}
                        /> */}
                        <Typography>{(!settings.originalNames && team.league_name_loc) || team.league_name}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid container item xs={6} sm={3} alignItems="center" wrap="nowrap" className={classes.right}>
                  {team.country_iso2 && (
                    <>
                      {/* TODO:
                      <Flag
                        country={team.country_iso2}
                        className={classes.image}
                      /> */}
                    </>
                  )}
                  {team.country_iso2 ? (
                    <Typography>
                      {/*TODO: {t(`countries.${team.country_iso2}`)} */}
                      TEST
                    </Typography>
                  ) : (
                    ""
                  )}
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
            </ListItemButton>
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
