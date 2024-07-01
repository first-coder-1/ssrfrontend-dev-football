import React from "react";
// import { useParams } from "react-router";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Asset from "../Asset";
import { Venue as VenueType } from "../../api";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme) => ({
  image: {
    width: "100%",
  },

  content: {
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(4),
    },
  },

  box: {
    margin: theme.spacing(0, 2, 3, 2),
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
      "&:last-child": {
        marginBottom: theme.spacing(3),
        borderBottom: "none",
      },
    },
  },
}));

const BodyText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  marginBottom: theme.spacing(1),
}));

type Props = {
  venue: VenueType;
};

export function Venue(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { venue } = props;
  const { locale } = useRouter();
  return (
    <>
      <Card>
        <CardHeader
          title={venue.name}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <Grid container spacing={3} className={classes.content}>
            <Grid item xs={12} md={venue.image_path ? 7 : 12}>
              {venue.image_path && <Asset src={venue.image_path} className={classes.image} />}
            </Grid>
            <Grid container item xs={12} md={venue.image_path ? 5 : 12} direction="column">
              {venue.city && (
                <Box className={classes.box}>
                  <BodyText variant="body2">{intl.get("venue.city")}:</BodyText>
                  <Typography>{venue.city}</Typography>
                </Box>
              )}
              {venue.address && (
                <Box className={classes.box}>
                  <BodyText variant="body2">{intl.get("venue.address")}:</BodyText>
                  <Typography>{venue.address}</Typography>
                </Box>
              )}
              {venue.capacity && (
                <Box className={classes.box}>
                  <BodyText variant="body2">{intl.get("venue.capacity")}:</BodyText>
                  <Typography>{venue.capacity}</Typography>
                </Box>
              )}
              {venue.surface && (
                <Box className={classes.box}>
                  <BodyText variant="body2">{intl.get("venue.surface")}:</BodyText>
                  <Typography>{venue.surface}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {venue.coordinates && (
        <Card>
          <CardHeader
            title={intl.get("map")}
            titleTypographyProps={{
              variant: "h2",
            }}
          />
          <CardContent>
            <iframe
              title="google-map"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_API_KEY}&center=${venue.coordinates}&zoom=16&maptype=satellite&language=${locale}`}
              allowFullScreen
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Venue;
