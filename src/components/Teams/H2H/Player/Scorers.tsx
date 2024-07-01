import React from "react";

// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Scorer, Team } from "../../../../api";
import TeamImage from "../../../../components/TeamImage";
import PlayerImage from "../../../../components/PlayerImage";
import { slugify } from "../../../../utils";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  item: {
    height: theme.spacing(7.5),
  },

  team: {
    flex: "1 0 auto",
    display: "flex",
    alignItems: "center",
  },

  player: {
    flex: "1 0 auto",
    display: "flex",
    alignItems: "stretch",
  },

  name: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: theme.spacing(1),
  },

  column: {
    width: theme.spacing(4.5),
  },
}));

type Props<T> = {
  team: Team;
  scorers: T[];
  columns: (className: string) => React.ReactElement;
  cells: (scorer: T, className: string) => React.ReactElement;
};

export function Scorers<T extends Scorer>(props: Props<T>): React.ReactElement {
  const { team, scorers, columns, cells } = props;
  const { settings } = useMst();
  const { classes } = useStyles();

  return (
    <List disablePadding>
      <ListItem divider className={classes.item}>
        <Box className={classes.team}>
          <TeamImage
            url={team.logo_path}
            name={(!settings.originalNames && team.name_loc) || team.name}
            variant="24x"
          />
          <Typography variant="h5" component={NavLink} to={`/soccer/teams/${slugify(team.name)}/${team._id}/summary`}>
            {(!settings.originalNames && team.name_loc) || team.name}
          </Typography>
        </Box>
        {columns(classes.column)}
      </ListItem>
      {scorers.map((scorer) => (
        <ListItem key={`${scorer.player_id}-${scorer.position}`} divider className={classes.item}>
          <Box className={classes.player}>
            <PlayerImage
              url={scorer.player_image_path}
              name={(!settings.originalNames && scorer.player_name_loc) || scorer.player_name}
              variant="48x48"
            />
            <Box className={classes.name}>
              <Typography
                component={NavLink}
                to={`/soccer/players/${slugify(scorer.player_name)}/${scorer.player_id}/summary`}
              >
                {(!settings.originalNames && scorer.player_name_loc) || scorer.player_name}
              </Typography>
              <Typography variant="body2">
                {(!settings.originalNames && scorer.team_name_loc) || scorer.team_name}
              </Typography>
            </Box>
          </Box>
          {cells(scorer, classes.column)}
        </ListItem>
      ))}
    </List>
  );
}

export default observer(Scorers);
