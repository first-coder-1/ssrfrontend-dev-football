import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { getVenuesBySeason, League, LeagueSeason, SeasonVenue } from "../../../api";
import Asset from "../../../components/Asset";
import PlaceholderGrid from "@/components/PlaceholderGrid";
import { useMst } from "../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  card: {
    height: "100%",
  },

  image: {
    width: "100%",
  },

  item: {
    paddingBottom: 0,
  },

  action: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

type Props = {
  league: League;
  season?: LeagueSeason;
  venues: SeasonVenue[];
};

export function Venues(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { season, venues: initialVenues } = props;
  const { settings } = useMst();
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<SeasonVenue[]>(initialVenues);
  useEffect(() => {
    if (season) {
      setLoading(true);
      const [promise, cancel] = getVenuesBySeason(season._id);
      promise
        .then(
          (res) => setVenues(res.data),
          () => setVenues([])
        )
        .finally(() => setLoading(false));
      return cancel;
    }
  }, [season]);
  if (loading) {
    return <PlaceholderGrid size={500} />;
  }
  return (
    <Grid container spacing={3}>
      {venues.map((venue) => (
        <Grid key={venue._id} item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>{venue.image_path && <Asset src={venue.image_path} className={classes.image} />}</CardContent>
            <CardHeader
              title={venue.name}
              titleTypographyProps={{
                variant: "h3",
              }}
            />
            <CardMedia>
              <List disablePadding>
                <ListItem disableGutters className={classes.item}>
                  <ListItemText primary={intl.get("venue.team")} />
                  <ListItemSecondaryAction className={classes.action}>
                    <Typography>{(!settings.originalNames && venue.team_name_loc) || venue.team_name}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem disableGutters className={classes.item}>
                  <ListItemText primary={intl.get("venue.city")} />
                  <ListItemSecondaryAction className={classes.action}>
                    <Typography>{venue.city}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem disableGutters className={classes.item}>
                  <ListItemText primary={intl.get("venue.capacity")} />
                  <ListItemSecondaryAction className={classes.action}>
                    <Typography>{venue.capacity}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem disableGutters className={classes.item}>
                  <ListItemText primary={intl.get("venue.address")} />
                  <ListItemSecondaryAction className={classes.action}>
                    <Typography>{venue.address}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardMedia>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default observer(Venues);
