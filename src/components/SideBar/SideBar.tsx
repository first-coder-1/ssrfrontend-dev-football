import React, { SetStateAction, useCallback } from "react";

// import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Hidden from "@/components/Hidden/Hidden";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "../icons/MenuIcon";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { useMyFavorites } from "../../hooks/useMyFavorites";
import { Dots } from "./Dots";
import { NavigationList } from "./NavigationList";
import FavoriteList from "./FavoriteList";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "sticky",
    top: 0,
    left: "auto",
    right: 0,
    overflowX: "hidden",
    zIndex: theme.zIndex.appBar + 1,
    width: theme.spacing(6),
  },

  lists: {
    width: theme.spacing(6),
    [theme.breakpoints.down("md")]: {
      height: `calc(100vh - ${theme.spacing(6)})`,
      display: "none",
    },
  },

  dotsItem: {
    width: theme.spacing(6),
    paddingLeft: 0,
    paddingRight: 0,
  },

  show: {
    width: theme.spacing(20),
    [theme.breakpoints.down("md")]: {
      display: "block",
      width: "100vw",
      backgroundColor: theme.palette.background.paper,
    },
  },

  list: {
    backgroundColor: theme.palette.background.paper,
    width: theme.spacing(20),
    [theme.breakpoints.down("md")]: {
      width: "100vw",
    },
  },

  listHeight: {
    maxHeight: theme.spacing(35), // show max 10 items: 10 * 3.5
  },

  titleItem: {
    height: theme.spacing(6),
  },

  button: {
    width: theme.spacing(6),
  },
}));

interface IProps {
  show: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}
export function SideBar({ setShow, show }: IProps) {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  //   const { locale } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const toggleShow = useCallback(() => {
    setShow((val) => !val);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const { leagues, teams } = useMyFavorites();
  const rootClassName = cx(classes.root, { [classes.show]: show });
  const listsClassName = cx(classes.lists, { [classes.show]: show });

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div className={rootClassName}>
        <div className={classes.button}>
          <IconButton onClick={toggleShow} sx={{ padding: (theme) => theme.spacing(1.5) }}>
            <MenuIcon color="secondary" />
          </IconButton>
        </div>
        <div className={listsClassName}>
          <List component="nav" disablePadding className={classes.list}>
            <NavigationList onClick={() => setShow(false)} />
            <ListItem
              divider
              button
              onClick={() => {
                navigate(`/favorites/leagues`);
                setShow(false);
              }}
              className={classes.titleItem}
              sx={{ pl: (theme) => theme.spacing(1.5) }}
            >
              <ListItemIcon>
                <HeartIcon />
              </ListItemIcon>
              <ListItemText
                primary={intl.get("sidebar.my-leagues")}
                primaryTypographyProps={{ variant: "subtitle1" }}
              />
            </ListItem>
          </List>
          <List component="nav" disablePadding className={cx(classes.list, classes.listHeight)}>
            {isMobile ? (
              <Grid container component="li" className="MuiListItem-divider">
                <Grid item xs={6}>
                  <List>
                    <FavoriteList
                      items={leagues.slice(0, Math.ceil(leagues.length / 2))}
                      utlTemplate={`/soccer/leagues/%s`}
                      onClick={() => setShow(false)}
                    />
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <FavoriteList
                      items={leagues.slice(Math.ceil(leagues.length / 2))}
                      utlTemplate={`/soccer/leagues/%s`}
                      onClick={() => setShow(false)}
                    />
                  </List>
                </Grid>
              </Grid>
            ) : (
              <FavoriteList items={leagues} utlTemplate={`/soccer/leagues/%s`} onClick={() => setShow(false)} />
            )}
          </List>
          <List component="nav" disablePadding className={classes.list}>
            <Hidden mdDown>
              <ListItem divider className={cx(classes.dotsItem, { [classes.show]: show })}>
                <Dots />
              </ListItem>
            </Hidden>
            <ListItem
              divider
              button
              onClick={() => {
                navigate(`/favorites/teams`);
                setShow(false);
              }}
              className={classes.titleItem}
              sx={{ pl: (theme) => theme.spacing(1.5) }}
            >
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary={intl.get("sidebar.my-teams")} primaryTypographyProps={{ variant: "subtitle1" }} />
            </ListItem>
          </List>
          <List component="nav" disablePadding className={cx(classes.list, classes.listHeight)}>
            {isMobile ? (
              <Grid container component="li" className="MuiListItem-divider">
                <Grid item xs={6}>
                  <List>
                    <FavoriteList
                      items={teams.slice(0, Math.ceil(teams.length / 2))}
                      utlTemplate={`/soccer/teams/%s`}
                      onClick={() => setShow(false)}
                    />
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <FavoriteList
                      items={teams.slice(Math.ceil(teams.length / 2))}
                      utlTemplate={`/soccer/teams/%s`}
                      onClick={() => setShow(false)}
                    />
                  </List>
                </Grid>
              </Grid>
            ) : (
              <FavoriteList items={teams} utlTemplate={`/soccer/teams/%s`} onClick={() => setShow(false)} />
            )}
          </List>
          <List component="nav" disablePadding className={classes.list}>
            <Hidden mdDown>
              <ListItem divider className={cx(classes.dotsItem, { [classes.show]: show })}>
                <Dots />
              </ListItem>
            </Hidden>
          </List>
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default observer(SideBar);
