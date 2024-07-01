import React from "react";

import { SxProps } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Hidden from "@/components/Hidden/Hidden";
import useMediaQuery from "@mui/material/useMediaQuery";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Asset from "@/components/Asset";
import { Team } from "@/api";
import { asset, normalizeVenueImage } from "@/utils";
import TeamImage from "@/components/TeamImage";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

type StyleProps = {
  image?: string | null;
};

const useStyles = makeStyles<StyleProps>()((theme, { image }) => ({
  background: {
    height: theme.spacing(23),
    [theme.breakpoints.up("md")]: {
      background: image ? `url("${asset(image)}") center / cover` : "none",
      filter: "blur(1.5px)",
      "-webkit-filter": "blur(1.5px)",
    },
  },

  container: {
    height: 100,
    width: "100%",
    top: theme.spacing(11),
    padding: theme.spacing(0, 3),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  venue: {
    width: 100,
    maxWidth: 100,
    maxHeight: 100,
    borderRadius: theme.spacing(1),
  },

  venueMobile: {
    width: "100%",
  },

  name: {
    [theme.breakpoints.up("md")]: {
      color: image
        ? theme.palette.primary.contrastText
        : theme.palette.mode === "dark"
        ? theme.palette.grey[200]
        : theme.palette.grey[600],
      textShadow: `${theme.palette.grey[900]} 1px 0 2px`,
    },
    [theme.breakpoints.down("md")]: {
      color: `${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[800]}`,
    },
  },

  link: {
    padding: theme.spacing(1, 1.5),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.spacing(4),
  },

  title: {
    color: theme.palette.primary.contrastText,
    textShadow: `${theme.palette.grey[900]} 1px 0 2px`,
    fontWeight: theme.typography.fontWeightMedium,
  },

  value: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(0.3, 1),
  },

  subName: {
    [theme.breakpoints.down("md")]: {
      fontWeight: 600,
    },
  },

  subValue: {
    [theme.breakpoints.up("md")]: {
      borderBottom: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[500]}`,
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "50%",
    },
  },

  venueCard: {
    marginTop: theme.spacing(4),
  },
}));

type Props = {
  team: Team;
};

export function Info(props: Props): React.ReactElement {
  const intl = useIntl();
  const { team } = props;
  const { settings } = useMst();
  const venueImage = normalizeVenueImage(team.venue?.image_path);
  const { classes } = useStyles({ image: venueImage });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const boxProps: SxProps = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    justifyContent: "space-between",
    height: isMobile ? "auto" : 48,
    m: isMobile ? 1 : 3,
  };
  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("teams.info")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <div className={classes.background} />
          <Box sx={{ position: "absolute" }} className={classes.container}>
            <Box sx={{ display: "flex" }}>
              <TeamImage
                url={team.logo_path}
                name={(!settings.originalNames && team.name_loc) || team.name}
                variant="100x"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-evenly",
                  ml: 2,
                }}
              >
                <Typography variant="h1" component="span" className={classes.name}>
                  {(!settings.originalNames && team.name_loc) || team.name}
                </Typography>
                {team.website && (
                  <Link href={team.website} className={classes.link} target="_blank">
                    {intl.get("teams.website")}
                  </Link>
                )}
              </Box>
            </Box>
            {!!team.venue && (
              <Hidden mdDown>
                <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                  {venueImage && <Asset src={venueImage} alt={team.name} variant="100x" className={classes.venue} />}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      ml: 4,
                      height: "100%",
                    }}
                  >
                    <Typography variant="body1" className={classes.title}>
                      {intl.get("venue.name")}:
                    </Typography>
                    <Typography variant="body1" className={classes.title}>
                      {intl.get("venue.city")}:
                    </Typography>
                    <Typography variant="body1" className={classes.title}>
                      {intl.get("venue.capacity")}:
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "space-around",
                      ml: 3,
                      color: "#fff",
                      height: "100%",
                    }}
                  >
                    <span className={classes.value}>{team.venue.name}</span>
                    <span className={classes.value}>{team.venue.city}</span>
                    <span className={classes.value}>{team.venue.capacity}</span>
                  </Box>
                </Box>
              </Hidden>
            )}
          </Box>
        </CardContent>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between" }}>
            <Box sx={boxProps}>
              <Typography className={classes.subName}>{intl.get("venue.country")}</Typography>
              {team.country_iso2 ? (
                <Typography className={classes.subValue}>{intl.get(`countries.${team.country_iso2}`)}</Typography>
              ) : (
                "-"
              )}
            </Box>
            {team.venue && (
              <Box sx={boxProps}>
                <Typography className={classes.subName}>{intl.get("venue.address")}</Typography>
                <Typography className={classes.subValue}>{team.venue.address}</Typography>
              </Box>
            )}
            {!!team.founded && (
              <Box sx={boxProps}>
                <Typography className={classes.subName}>{intl.get("venue.founded")}</Typography>
                <Typography className={classes.subValue}>{team.founded}</Typography>
              </Box>
            )}
            {!!team.twitter && (
              <Box sx={boxProps}>
                <Typography className={classes.subName}>Twitter</Typography>
                <Typography className={classes.subValue}>
                  <Link href={`https://twitter.com/${team.twitter.replace("@", "")}`} target="_blank">
                    {team.twitter}
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {team.venue && (
        <Hidden mdUp>
          <Card className={classes.venueCard}>
            <CardHeader
              title={intl.get("teams.venue")}
              titleTypographyProps={{
                variant: "h2",
              }}
            />
            <CardContent>
              {venueImage && <Asset src={venueImage} alt={team.name} className={classes.venueMobile} />}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={boxProps}>
                  <Typography className={classes.subName}>{intl.get("venue.name")}</Typography>
                  <Typography className={classes.subValue}>{team.venue.name}</Typography>
                </Box>
                <Box sx={boxProps}>
                  <Typography className={classes.subName}>{intl.get("venue.city")}</Typography>
                  <Typography className={classes.subValue}>{team.venue.city}</Typography>
                </Box>
                <Box sx={boxProps}>
                  <Typography className={classes.subName}>{intl.get("venue.capacity")}</Typography>
                  <Typography className={classes.subValue}>{team.venue.capacity}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Hidden>
      )}
    </>
  );
}

export default observer(Info);
