import React from "react";
// import { useParams } from "react-router";
// import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import BulbIcon from "../icons/BulbIcon";
import ListBulletIcon from "../icons/ListBulletIcon";
import { Logo } from "../Logo";
import { useMst } from "../../store";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";
import { observer } from "mobx-react-lite";

const useStyles = makeStyles()((theme) => ({
  root: {
    ...(theme.palette.mode === "dark"
      ? {
          background: "linear-gradient(0deg, rgba(49, 64, 90, 0.5), rgba(49, 64, 90, 0.5)), #3C4C68",
        }
      : {
          backgroundColor: theme.palette.grey[50],
        }),
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(6),
    flexShrink: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      height: theme.spacing(23.5),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },

  texts: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },

  logo: {
    margin: theme.spacing(2, 0),
  },

  text1: {
    marginTop: theme.spacing(3),
  },

  text2: {
    marginTop: theme.spacing(1),
  },

  item: {
    height: theme.spacing(4),
  },

  arrow: {
    opacity: 0.5,
    marginRight: 2,
  },

  navigation: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(1.5),
    },
  },

  support: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1.5),
    },
  },

  apps: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(3),
    },
  },

  link: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(3),
      display: "block",
    },
    [theme.breakpoints.down("md")]: {
      marginRight: theme.spacing(1.5),
      display: "block",
    },
  },

  linkContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.background.paper,
    paddingRight: 0,
    padding: theme.spacing(1.5),
  },

  linkText: {
    display: "inline-block",
    marginLeft: theme.spacing(1),
  },

  appText: {
    [theme.breakpoints.up("lg")]: {
      fontSize: "0.75rem",
    },
    [theme.breakpoints.between("md", "xl")]: {
      fontSize: "0.6rem",
    },
  },
}));

export function Footer(): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={classes.root}>
      <Grid container direction={isMobile ? "column-reverse" : "row"}>
        <Grid
          container
          item
          xs={12}
          md={5}
          xl={7}
          direction="column"
          alignItems={isMobile ? "center" : "flex-start"}
          className={classes.texts}
        >
          <NavLink to={`/`}>
            <Logo className={classes.logo} />
          </NavLink>
          <Typography variant="body1">{intl.get("footer.copyright")}</Typography>
          <Typography variant="body2" className={classes.text1}>
            {intl.get("home-about.about")} {intl.get("footer.text")} {intl.get("footer.sportmonks-text")}{" "}
            <Link href="https://www.sportmonks.com/" rel="noopener noreferrer" color="primary" target={`_blank`}>
              {intl.get("footer.sportmonks-link")}
            </Link>{" "}
          </Typography>
          {settings.openOdds && (
            <Typography variant="body2" className={classes.text2}>
              {intl.get("footer.info")}{" "}
              <Link href="https://www.begambleaware.org/" rel="noopener noreferrer" color="primary" target={`_blank`}>
                {intl.get("footer.link")}
              </Link>
            </Typography>
          )}
        </Grid>
        <Grid container item xs={12} md={7} xl={5}>
          <Grid container item xs={12} md={9}>
            <Grid item xs={12} sm={6}>
              <List className={classes.navigation}>
                <ListItem divider className={classes.item}>
                  <ListItemText
                    primaryTypographyProps={{
                      color: theme.palette.mode === "dark" ? "textPrimary" : "secondary",
                    }}
                  >
                    {intl.get("footer.navigation")}
                  </ListItemText>
                  <ListItemSecondaryAction color="primary">
                    <ListBulletIcon color="primary" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/fixtures`}>
                  <ListItemText>{intl.get("navbar.fixtures")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/soccer/leagues`}>
                  <ListItemText>{intl.get("navbar.competitions")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/soccer/teams`}>
                  <ListItemText>{intl.get("navbar.teams")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/soccer/players`}>
                  <ListItemText>{intl.get("navbar.players")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List className={classes.support}>
                <ListItem divider className={classes.item}>
                  <ListItemText
                    primaryTypographyProps={{
                      color: theme.palette.mode === "dark" ? "textPrimary" : "secondary",
                    }}
                  >
                    {intl.get("footer.support")}
                  </ListItemText>
                  <ListItemSecondaryAction color="primary">
                    <BulbIcon color="primary" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/pages/terms-of-use`}>
                  <ListItemText>{intl.get("footer.terms")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/pages/privacy-policy`}>
                  <ListItemText>{intl.get("footer.policy")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/pages/legal-information`}>
                  <ListItemText>{intl.get("pages.legal-information")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.item} button component={NavLink} to={`/pages/cookie-policy`}>
                  <ListItemText>{intl.get("footer.cookies")}</ListItemText>
                  <ListItemSecondaryAction>
                    <ArrowRightIcon color="primary" fontSize="small" className={classes.arrow} />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={3} alignItems="center">
            <Grid item xs={6} md={12}>
              <Link
                className={classes.link}
                href="https://play.google.com/store/apps/details?id=com.penalty.app"
                rel="noopener noreferrer"
                target={`_blank`}
              >
                <Paper className={classes.linkContent}>
                  <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.4063 12.7969L4.375 0.710938L19.6875 9.51562L16.4063 12.7969ZM1.20313 0C0.401042 0.401042 0 1.03906 0 1.91406V26.0859C0 26.9609 0.401042 27.599 1.20313 28L15.2578 14L1.20313 0ZM24.4453 12.3594L21.2188 10.4453L17.6641 14L21.2188 17.5L24.5 15.6406C25.0104 15.276 25.2474 14.7292 25.2109 14C25.2109 13.2708 24.9557 12.724 24.4453 12.3594ZM4.375 27.2891L19.6875 18.4844L16.4063 15.2031L4.375 27.2891Z"
                      fill="#FB6340"
                    />
                  </svg>
                  <div className={classes.linkText}>
                    <Typography variant="body2" className={classes.appText}>
                      {intl.get("footer.google-play")}
                    </Typography>
                    <Typography variant="body1" className={classes.appText}>
                      Google Play
                    </Typography>
                  </div>
                </Paper>
              </Link>
            </Grid>
            <Grid item xs={6} md={12}>
              <Link
                className={classes.link}
                href="https://appgallery.huawei.com/app/C104918593"
                rel="noopener noreferrer"
                target={`_blank`}
              >
                <Paper className={classes.linkContent}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 13 4 C 10.97 4 9.4052969 5.7677656 9.4042969 9.0097656 C 9.4042969 11.126766 12.608219 16.5575 15.449219 21.3125 C 15.449219 9.0005 15.146 7.667 13 4 z M 19 4 C 16.812 7.604 16.550781 8.9995 16.550781 21.3125 C 19.391781 16.5575 22.595703 11.126766 22.595703 9.0097656 C 22.594703 5.7667656 21.03 4 19 4 z M 6 8 C 3.021 10.079 4.0009062 15.000422 5.5039062 16.607422 C 6.4969063 17.647422 10.35 19.52 14 22 L 6 8 z M 26 8 L 18 22 C 21.65 19.52 25.503094 17.647422 26.496094 16.607422 C 27.999094 15.000422 28.979 10.079 26 8 z M 2 16 C 2.048 21.542 5.4307969 23 7.7167969 23 L 13.431641 23 L 2 16 z M 30 16 L 18.568359 23 L 24.283203 23 C 26.569203 23 29.952 21.542 30 16 z M 5.1171875 24 C 5.4361875 25.654 6.1573281 27 8.2363281 27 C 10.315328 27 12.325641 25.8 13.431641 24 L 5.1171875 24 z M 18.568359 24 C 19.674359 25.8 21.684672 27 23.763672 27 C 25.842672 27 26.563813 25.654 26.882812 24 L 18.568359 24 z"
                      fill="#FB6340"
                    />
                  </svg>
                  <div className={classes.linkText}>
                    <Typography variant="body2" className={classes.appText}>
                      {intl.get("footer.app-store")}
                    </Typography>
                    <Typography variant="body1" className={classes.appText}>
                      AppGallery
                    </Typography>
                  </div>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default observer(Footer);
