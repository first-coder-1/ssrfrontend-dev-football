import React, { useContext } from "react";

import { format } from "date-fns";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Hidden from "@/components/Hidden/Hidden";
import { getPositionById, parse, slugify } from "@/utils";
import PlayerImage from "@/components/PlayerImage";
import TeamImage from "@/components/TeamImage";
import { Player, Position } from "@/api";
import { Chart } from "./Chart";
// import { Context } from "@/locales/LocaleProvider";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";
import { Context } from "@/locales/LocaleProvider";

const useStyles = makeStyles()((theme) => ({
  box: {
    position: "relative",
    backgroundColor: theme.palette.grey[theme.palette.mode === "dark" ? 300 : 200],
    [theme.breakpoints.up("md")]: {
      borderRadius: 10,
      padding: theme.spacing(2.5),
      margin: theme.spacing(2.5),
    },
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(1),
    },
  },

  number: {
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    borderBottomRightRadius: 10,
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      borderTopLeftRadius: 10,
    },
  },

  avatar: {
    width: 150,
    height: 150,
  },

  nameContainer: {
    height: 150,
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },

  name: {
    textTransform: "none",
  },

  image: {
    width: 24,
    height: 24,
  },
}));

type Props = {
  player: Player;
};

export function Passport(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { player } = props;
  const { settings } = useMst();

  const { dateLocale } = useContext(Context);

  const birthdate = player.birthdate
    ? format(parse(player.birthdate, new Date(), "yyyy-MM-dd"), "MMM dd, yyyy", {
        locale: dateLocale,
      })
    : "-";

  return (
    <Card>
      <CardHeader
        title={
          <Grid container>
            <Grid item xs={12} md={7}>
              <Typography variant="h2">{intl.get("players.passport")}</Typography>
            </Grid>
          </Grid>
        }
        disableTypography
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={7}>
            <Box className={classes.box}>
              {player.number && <Box className={classes.number}>{player.number}</Box>}
              <Grid container>
                <Grid container item xs={12}>
                  <PlayerImage
                    url={player.image_path}
                    name={player.display_name}
                    className={classes.avatar}
                    variant="150x"
                    square
                  />
                  <Box className={classes.nameContainer}>
                    <Box>
                      <Typography variant="h1" className={classes.name}>
                        {player.display_name}
                      </Typography>
                      <Typography variant="body2">{player.lastname}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TeamImage
                        url={player.team_logo_path}
                        name={(!settings.originalNames && player.team_name_loc) || player.team_name}
                        variant="24x"
                        className={classes.image}
                      />
                      <Typography
                        component={NavLink}
                        to={`/soccer/teams/${slugify(player.team_name)}/${player.team_id}/summary`}
                      >
                        {(!settings.originalNames && player.team_name_loc) || player.team_name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <List>
                    <ListItem divider>
                      <ListItemText primary={intl.get("players.nationality")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">{player.nationality}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary={intl.get("players.birthdate")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">{birthdate[0].toUpperCase() + birthdate.substr(1)}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary={intl.get("players.position")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">
                          {intl.get(getPositionById(player.position_id || Position.OTHER, true))}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary={intl.get("players.age")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">{player.age}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                      <ListItemText primary={intl.get("players.height")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">{player.height}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={intl.get("players.weight")} />
                      <ListItemSecondaryAction>
                        <Typography variant="body2">{player.weight}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Hidden mdDown>
            <Grid container item xs={12} md={5} justifyContent="center">
              <Chart player={player} />
            </Grid>
          </Hidden>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default observer(Passport);
