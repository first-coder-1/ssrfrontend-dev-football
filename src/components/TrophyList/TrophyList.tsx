import React from "react";

// import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Flag from "../Flag";
import { slugify } from "../../utils";
import { Trophy } from "../../api";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";

const useStyles = makeStyles<{ forceMobile?: boolean }>()((theme, { forceMobile }) => ({
  left: {
    flexGrow: 0,
    maxWidth: forceMobile ? "100%" : "50%",
    flexBasis: forceMobile ? "100%" : "50%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
    },
  },

  right: {
    flexGrow: 0,
    maxWidth: forceMobile ? "100%" : "50%",
    flexBasis: forceMobile ? "100%" : "50%",
    paddingTop: forceMobile ? theme.spacing(2) : 0,
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      flexBasis: "100%",
      paddingTop: theme.spacing(2),
    },
  },

  header: {
    height: 50,
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[300],
  },

  row: {
    display: "flex",
    flexWrap: "wrap",
  },

  cell: {
    flex: 4,
    display: "flex",
    alignItems: "flex-start",
  },

  lastCell: {
    flex: 1,
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-end",
    },
  },

  nameCell: {
    flex: 8,
  },
}));

type Props = {
  map: Map<string, Trophy[]>;
  forceMobile?: boolean;
};

export function TrophyList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { map, forceMobile } = props;
  const { settings } = useMst();
  const { classes, cx } = useStyles({ forceMobile });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <List disablePadding>
      {Array.from(map.entries()).map(([type, trophies]) => (
        <React.Fragment key={type}>
          <ListSubheader className={cx(classes.row, classes.header)}>
            <Typography variant="h6">{intl.get(`teams.${type}`)}</Typography>
          </ListSubheader>
          {trophies.map((trophy, i) => {
            const samePrevLeague = !!trophies[i - 1] && trophies[i - 1].league_id === trophy.league_id;
            const sameNextLeague = !!trophies[i + 1] && trophies[i + 1].league_id === trophy.league_id;
            return (
              <ListItem
                key={`${trophy.league_id}-${trophy.status}`}
                divider={!sameNextLeague && i !== trophies.length - 1}
              >
                <ListItemText
                  disableTypography
                  className={classes.row}
                  primary={
                    <>
                      <Box sx={{ display: "flex" }} className={classes.left}>
                        <Box className={cx(classes.cell, classes.nameCell)}>
                          {!samePrevLeague && (
                            <Link
                              color="secondary"
                              component={NavLink}
                              to={`/soccer/leagues/${slugify(trophy.league)}/${trophy.league_id}/summary`}
                            >
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                {trophy.country_iso2 && <Flag country={trophy.country_iso2} />}
                                <Typography variant="h6" sx={{ ml: theme.spacing(2) }}>
                                  {(!settings.originalNames && trophy.league_name_loc) || trophy.league}
                                </Typography>
                              </Box>
                            </Link>
                          )}
                        </Box>
                        <Box className={classes.cell}>
                          <Typography color="secondary">
                            {intl.get(`leagues.${trophy.status.toLowerCase()}`)}
                          </Typography>
                        </Box>
                        <Box className={cx(classes.cell, classes.lastCell)}>
                          <Typography color="secondary">{`${trophy.times}x`}</Typography>
                        </Box>
                      </Box>
                      {(!(forceMobile || isMobile) || trophy.seasons.length > 0) && (
                        <Box sx={{ display: "flex" }} className={classes.right}>
                          <Box className={classes.cell}>
                            <Typography>{trophy.seasons.map((season) => season.name).join(", ")}</Typography>
                          </Box>
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </React.Fragment>
      ))}
    </List>
  );
}

export default observer(TrophyList);
