import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Dialog from "@mui/material/Dialog";
import ListItemIcon from "@mui/material/ListItemIcon";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { TimezoneMenu } from "./TimezoneMenu";
import CloseIcon from "@/components/icons/CloseIcon";
import CreditCardIcon from "@/components/icons/CreditCardIcon";
import DashboardIcon from "@/components/icons/DashboardIcon";
import DollarIcon from "@/components/icons/DollarIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import LockIcon from "@/components/icons/LockIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import OpacityIcon from "@/components/icons/OpacityIcon";
import RemoveIcon from "@/components/icons/RemoveIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import SliderIcon from "@/components/icons/SliderIcon";
import TimeIcon from "@/components/icons/TimeIcon";
import { BookmakerSelect } from "./BookmakerSelect";
import { PasswordForm } from "./PasswordForm";
import Checkbox from "@/components/Checkbox";
import { useMst } from "@/store";
import { DeleteAccount } from "./DeleteAccount";
import CountrySelect, { CountryProvider } from "@/components/CountrySelect";
// import { Link as RouterLink } from 'react-router-dom';
import Link from "@mui/material/Link";
import { TimeFormat } from "@/api";
import TimeTz from "@/components/TimeTz";
import OddsFormatSwitch from "@/components/OddsFormatSwitch";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { ThemeSwitch } from "./ThemeSwitch";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";
import { ORDER_MATCHES_BY } from "@/constants/enums";

const useStyles = makeStyles()((theme) => ({
  paper: theme.scrollbar as {},

  appBar: {
    position: "relative",
    padding: "0 !important",
  },

  toolbar: {
    paddingLeft: theme.spacing(2),
    minHeight: theme.spacing(5),
  },

  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },

  iconContainer: {
    minWidth: theme.spacing(3),
  },

  checkbox: {
    marginLeft: "-7px",
  },

  subheader: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.grey[theme.palette.mode === "dark" ? 300 : 50],
    height: theme.spacing(5.2),
  },

  theme: {
    height: theme.spacing(6),
  },
}));

type Props = {
  open: boolean;
  onClose: () => void;
};

function SettingsForm(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings, auth } = useMst();
  const { open, onClose } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const timestamp = new Date().getTime() / 1000;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
      classes={{ paper: classes.paper }}
    >
      <AppBar color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <SliderIcon color="primary" />
          <Typography variant="h2" className={classes.title}>
            {intl.get("settings.title")}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon color="action" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper elevation={isMobile ? 0 : 1}>
        <List disablePadding>
          <ListItem className={classes.theme}>
            <ListItemIcon>
              <OpacityIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={intl.get("sidebar.theme")} primaryTypographyProps={{ variant: "subtitle1" }} />
            <ListItemSecondaryAction>
              <ThemeSwitch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <TimeIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {intl.get("settings.timezone")}
            </Typography>
          </ListItem>
          <ListItem divider>
            <TimezoneMenu
              value={settings.timeZone}
              onChange={(timeZone) => settings.changeTimeZone(timeZone)}
              timeFormat={settings.timeFormat}
            />
          </ListItem>
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <SettingsIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {intl.get("settings.general-settings")}
            </Typography>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormLabel component="legend" color="secondary">
                {intl.get("settings.order-matches-by")}:
              </FormLabel>
              <RadioGroup
                row
                value={settings.orderMatchesBy}
                onChange={(e) => settings.changeOrderMatchesBy(e.target.value as ORDER_MATCHES_BY)}
              >
                <FormControlLabel
                  value={ORDER_MATCHES_BY.LEAGUE_NAME}
                  control={<Radio color="primary" checked={settings.orderMatchesBy === ORDER_MATCHES_BY.LEAGUE_NAME} />}
                  label={intl.get("settings.league-name")}
                />
                <FormControlLabel
                  value={ORDER_MATCHES_BY.MATCH_START_TIME}
                  control={
                    <Radio color="primary" checked={settings.orderMatchesBy === ORDER_MATCHES_BY.MATCH_START_TIME} />
                  }
                  label={intl.get("settings.match-start-time")}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox checked={settings.friendly} onChange={() => settings.changeFriendly(!settings.friendly)} />
                }
                label={intl.get("settings.friendly")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormControlLabel
                control={<Checkbox checked={settings.women} onChange={() => settings.changeWomen(!settings.women)} />}
                label={intl.get("settings.women")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox checked={settings.openOdds} onChange={() => settings.changeOpenOdds(!settings.openOdds)} />
                }
                label={intl.get("settings.open-odds")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.openLeagues}
                    onChange={() => settings.changeOpenLeagues(!settings.openLeagues)}
                  />
                }
                label={intl.get("settings.open-leagues")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormControlLabel
                control={<Checkbox checked={settings.originalNames} onChange={() => settings.toggleOriginalNames()} />}
                label={intl.get("settings.original-names")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem divider>
            <FormControl component="fieldset">
              <FormLabel component="legend" color="secondary">
                {intl.get("settings.time-format")}:
              </FormLabel>
              <RadioGroup
                row
                value={settings.timeFormat}
                onChange={(e) => settings.changeTimeFormat(e.target.value as TimeFormat)}
              >
                <FormControlLabel
                  value={TimeFormat.HHmm}
                  control={<Radio color="primary" checked={settings.timeFormat === TimeFormat.HHmm} />}
                  label={<TimeTz timeFormat={TimeFormat.HHmm}>{timestamp}</TimeTz>}
                />
                <FormControlLabel
                  value={TimeFormat.hhmma}
                  control={<Radio color="primary" checked={settings.timeFormat === TimeFormat.hhmma} />}
                  label={<TimeTz timeFormat={TimeFormat.hhmma}>{timestamp}</TimeTz>}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <HeartIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {`${intl.get("settings.favorites")} / ${intl.get("teams.show")}`}
            </Typography>
          </ListItem>
          <ListItem divider>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.extendedFavoritesTime}
                    onChange={() => settings.changeExtendedFavoritesTime(!settings.extendedFavoritesTime)}
                  />
                }
                label={intl.get("settings.extended-favorites-time")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <CreditCardIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {intl.get("settings.livebar")}
            </Typography>
          </ListItem>
          <ListItem divider>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.hideLivebar}
                    onChange={() => settings.changeHideLiveBar(!settings.hideLivebar)}
                  />
                }
                label={intl.get("settings.hide-livebar")}
                className={classes.checkbox}
              />
            </FormControl>
          </ListItem>
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <NotificationIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {intl.get("settings.notifications")}
            </Typography>
          </ListItem>
          {auth.user ? (
            <>
              <ListItem>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.notifications}
                        onChange={() => settings.changeNotifications(!settings.notifications)}
                      />
                    }
                    label={intl.get("settings.send-notifications")}
                    className={classes.checkbox}
                  />
                </FormControl>
              </ListItem>
              <ListItem divider>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.bedtimeMode}
                        onChange={() => settings.changeBedtimeMode(!settings.bedtimeMode)}
                      />
                    }
                    label={`${intl.get("settings.bedtime-mode")} (${intl.get("settings.bedtime-mode-message")})`}
                    className={classes.checkbox}
                  />
                </FormControl>
              </ListItem>
            </>
          ) : (
            <ListItem divider>
              <Typography>{intl.get("settings.notifications-login-alert")}</Typography>
            </ListItem>
          )}
          {settings.openOdds && (
            <>
              <ListItem className={classes.subheader}>
                <ListItemIcon classes={{ root: classes.iconContainer }}>
                  <DollarIcon color="action" fontSize="small" />
                </ListItemIcon>
                <Typography variant="h4" component="span">
                  {intl.get("settings.bookmaker")}
                </Typography>
              </ListItem>
              <ListItem>
                <BookmakerSelect />
              </ListItem>
              <ListItem divider>
                <OddsFormatSwitch format={settings.oddsFormat} onChange={settings.changeOddsFormat} />
              </ListItem>
            </>
          )}
          {auth.user && (
            <>
              <ListItem className={classes.subheader}>
                <ListItemIcon classes={{ root: classes.iconContainer }}>
                  <Typography variant="body2" component="span">
                    <DashboardIcon color="action" fontSize="small" />
                  </Typography>
                </ListItemIcon>
                <Typography variant="h4" component="span">
                  {intl.get("hide-ads")}
                </Typography>
              </ListItem>
              <ListItem divider>
                <Link
                  color="secondary"
                  onClick={onClose}
                  //@TODO: RouterLink replace
                  // component={RouterLink}
                  component={NavLink}
                  to="referrals"
                >
                  {intl.get("hide-ads-text")}
                </Link>
              </ListItem>
            </>
          )}
          <ListItem className={classes.subheader}>
            <ListItemIcon classes={{ root: classes.iconContainer }}>
              <GlobeIcon color="action" fontSize="small" />
            </ListItemIcon>
            <Typography variant="h4" component="span">
              {intl.get("search.country")}
            </Typography>
          </ListItem>
          <ListItem>
            <CountryProvider>
              <FormControl fullWidth>
                <CountrySelect
                  value={settings.country}
                  onChange={(value) => settings.changeCountry(value)}
                  property="country_iso2"
                />
              </FormControl>
            </CountryProvider>
          </ListItem>
          {auth.user && (
            <>
              <ListItem className={classes.subheader}>
                <ListItemIcon classes={{ root: classes.iconContainer }}>
                  <LockIcon color="action" fontSize="small" />
                </ListItemIcon>
                <Typography variant="h4" component="span">
                  {intl.get("auth.password")}
                </Typography>
              </ListItem>
              <ListItem>
                <PasswordForm auth={auth} />
              </ListItem>
              <ListItem className={classes.subheader}>
                <ListItemIcon classes={{ root: classes.iconContainer }}>
                  <RemoveIcon color="action" fontSize="small" />
                </ListItemIcon>
                <Typography variant="h4" component="span">
                  {intl.get("auth.delete-account")}
                </Typography>
              </ListItem>
              <ListItem>
                <DeleteAccount auth={auth} onDelete={onClose} />
              </ListItem>
            </>
          )}
        </List>
      </Paper>
    </Dialog>
  );
}

export default observer(SettingsForm);
