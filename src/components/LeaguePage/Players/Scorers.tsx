import React from "react";
// import intl from 'react-intl-universal';
// import { Link as RouterLink } from 'react-router-dom';
// import { useParams } from "react-router";
import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Hidden from "@mui/material/Hidden";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Grid from "@mui/material/Grid";
import PlayerImage from "../../../components/PlayerImage";
import TeamImage from "../../../components/TeamImage";
import { Scorer } from "../../../api";
import Pagination from "../../../components/Pagination";
import { slugify } from "../../../utils";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";

const useStyles = makeStyles()((theme) => ({
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  box: {
    display: "flex",
    alignItems: "center",
  },

  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
  },

  logo: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },

  subheader: {
    height: 36,
  },

  row: {
    height: 50,
  },

  cell: {
    display: "flex",
    alignItems: "center",
  },

  left: {
    [theme.breakpoints.down("md")]: {
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
  },

  right: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      height: 40,
      lineHeight: "40px",
      justifyContent: "center",
    },
  },
}));

type Props<T> = {
  scorers: T[];
  columns: React.ReactElement;
  cells: (scorer: T) => React.ReactElement;
  lastPage: number;
  page: number;
  setPage: (page: number) => void;
};

export function Scorers<T extends Scorer>(props: Props<T>): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { settings } = useMst();
  // const { locale } = useParams();
  const { scorers, columns, cells, lastPage, page, setPage } = props;
  return (
    <List disablePadding>
      <ListSubheader className={classes.subheader}>
        <Grid container>
          <Hidden mdDown>
            <Grid container item xs={12} md={7}>
              <Grid item xs={6}>
                {intl.get("leagues.name")}
              </Grid>
              <Grid item xs={6}>
                {intl.get("leagues.team")}
              </Grid>
            </Grid>
          </Hidden>
          <Grid container item xs={12} md={5} className={cx(classes.cell, classes.right)}>
            {columns}
          </Grid>
        </Grid>
      </ListSubheader>
      {scorers.map((scorer) => (
        <ListItem key={scorer.player_id} divider className={classes.item}>
          <Grid container>
            <Grid container item xs={12} md={7} className={cx(classes.row, classes.cell, classes.left)}>
              <Grid item xs={6}>
                <Box className={classes.box}>
                  <PlayerImage
                    url={scorer.player_image_path}
                    name={(!settings.originalNames && scorer.player_name_loc) || scorer.player_name}
                    variant="48x48"
                    className={classes.avatar}
                  />
                  <Typography
                    component={NavLink}
                    to={`/soccer/players/${slugify(scorer.player_name)}/${scorer.player_id}/summary`}
                  >
                    {(!settings.originalNames && scorer.player_name_loc) || scorer.player_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className={classes.box}>
                  <TeamImage
                    url={scorer.team_logo_path}
                    name={(!settings.originalNames && scorer.team_name_loc) || scorer.team_name}
                    variant="24x"
                    className={classes.logo}
                  />
                  <Typography
                    component={NavLink}
                    to={`/soccer/teams/${slugify(scorer.team_name)}/${scorer.team_id}/summary`}
                  >
                    {(!settings.originalNames && scorer.team_name_loc) || scorer.team_name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container item xs={12} md={5} className={cx(classes.row, classes.cell, classes.right)}>
              {cells(scorer)}
            </Grid>
          </Grid>
        </ListItem>
      ))}
      {lastPage > 1 && (
        <ListItem disableGutters>
          <Pagination pageMin={1} pageMax={lastPage} currentPage={page} onPageChange={setPage} />
        </ListItem>
      )}
    </List>
  );
}

export default observer(Scorers);
