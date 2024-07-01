import React from "react";
// import { useParams } from 'react-router';
// import { NavLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import Grid, { GridSize } from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import PlayerImage from "@/components/PlayerImage";
import LeagueImage from "@/components/LeagueImage";
import TeamImage from "@/components/TeamImage";
import Pagination from "@/components/Pagination";
import { PlayerScorer } from "@/api";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import NavLink from "@/components/shared/NavLink";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  subheader: {
    height: theme.spacing(4.5),
  },

  item: {
    height: theme.spacing(8),
  },

  image: {
    marginRight: theme.spacing(1),
  },

  topCell: {
    [theme.breakpoints.down("md")]: {
      order: 1,
    },
  },

  bottomCell: {
    [theme.breakpoints.down("md")]: {
      order: 2,
    },
  },

  smHidden: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

type Props<T> = {
  scorers: T[];
  columns: React.ReactElement;
  cells: (scorer: T) => React.ReactElement;
  cellSize: GridSize;
  lastPage: number;
  page: number;
  setPage: (page: number) => void;
};

export function Scorers<T extends PlayerScorer>(
  props: Props<T>
): React.ReactElement {
  const { classes, cx } = useStyles();
  const { scorers, columns, cells, cellSize, lastPage, page, setPage } = props;
  const { settings } = useMst();
  const intl = useIntl();
  return (
    <List disablePadding>
      <ListSubheader className={classes.subheader}>
        <Grid container>
          <Grid
            container
            item
            xs={8}
            md
            alignItems="center"
            className={classes.topCell}
          >
            <Typography>{intl.get("players.name")}</Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={7}
            alignItems="center"
            className={classes.smHidden}
          >
            <Grid container item xs>
              <Typography>{intl.get("players.team")}</Typography>
            </Grid>
            <Grid container item xs>
              <Typography>{intl.get("players.competition")}</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={4}
            md={cellSize}
            alignItems="center"
            className={classes.topCell}
          >
            {columns}
          </Grid>
        </Grid>
      </ListSubheader>
      {scorers.map((scorer) => (
        <ListItem divider key={scorer.player_id}>
          <Grid container>
            <Grid
              container
              item
              xs={8}
              md
              alignItems="center"
              wrap="nowrap"
              className={cx(classes.item, classes.topCell)}
            >
              <PlayerImage
                url={scorer.player_image_path}
                name={
                  (!settings.originalNames && scorer.player_name_loc) ||
                  scorer.player_name
                }
                variant="48x48"
                className={classes.image}
              />
              <Typography
                component={NavLink}
                to={`/soccer/players/${slugify(scorer.player_name)}/${
                  scorer.player_id
                }/summary`}
              >
                {(!settings.originalNames && scorer.player_name_loc) ||
                  scorer.player_name}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={7}
              className={cx(classes.item, classes.bottomCell)}
            >
              <Grid container item xs alignItems="center" wrap="nowrap">
                {scorer.team_logo_path && (
                  <TeamImage
                    url={scorer.team_logo_path}
                    name={
                      (!settings.originalNames && scorer.team_name_loc) ||
                      scorer.team_name
                    }
                    variant="28x"
                    className={classes.image}
                  />
                )}
                <Typography
                  component={NavLink}
                  to={`/soccer/teams/${slugify(scorer.team_name)}/${
                    scorer.team_id
                  }/summary`}
                >
                  {(!settings.originalNames && scorer.team_name_loc) ||
                    scorer.team_name}
                </Typography>
              </Grid>
              <Grid container item xs alignItems="center" wrap="nowrap">
                {scorer.league_logo_path && (
                  <LeagueImage
                    url={scorer.league_logo_path}
                    name={
                      (!settings.originalNames && scorer.league_name_loc) ||
                      scorer.league_name
                    }
                    variant="28x"
                    className={classes.image}
                  />
                )}
                <Typography
                  component={NavLink}
                  to={`/soccer/leagues/${slugify(scorer.league_name)}/${
                    scorer.league_id
                  }/summary`}
                >
                  {(!settings.originalNames && scorer.league_name_loc) ||
                    scorer.league_name}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={4}
              md={cellSize}
              alignItems="center"
              className={cx(classes.item, classes.topCell)}
            >
              {cells(scorer)}
            </Grid>
          </Grid>
        </ListItem>
      ))}
      {lastPage > 1 && (
        <ListItem>
          <Pagination
            pageMin={1}
            pageMax={lastPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </ListItem>
      )}
    </List>
  );
}

export default observer(Scorers);
