import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popover from "@mui/material/Popover";
import Grid from "@mui/material/Grid";
import { getSelectedLeagues, LeagueType, MyLeague } from "@/api";
import NavItem from "./NavItem/NavItem";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { PopoverList } from "./PopoverList";

const useStyles = makeStyles()((theme) => ({
  popover: {
    width: theme.spacing(140),
  },
}));

export function LeaguesPopover(): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const [leagues, setLeagues] = useState<MyLeague[]>([]);
  useEffect(() => {
    const [promise, cancel] = getSelectedLeagues();
    promise.then((res) => {
      setLeagues(res.data);
    });
    return cancel;
  }, []);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDesktop) {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const map = (league: MyLeague) => ({
    id: league._id,
    url: `/soccer/leagues/${slugify(league.name)}/${league._id}/summary`,
    title: (!settings.originalNames && league.name_loc) || league.name,
    asset: league.logo_path,
  });

  return (
    <>
      <NavItem to={`/soccer/leagues`} onClick={handleClick}>
        {intl.get("navbar.competitions")}
      </NavItem>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          className: classes.popover,
        }}
      >
        <Grid container>
          <PopoverList
            header={intl.get("leagues.domestic")}
            items={leagues
              .filter((league) => league.type === LeagueType.DOMESTIC)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/leagues/domestic`}
            onClick={handleClose}
          />
          <PopoverList
            header={intl.get("leagues.international")}
            items={leagues
              .filter((league) => league.type === LeagueType.INTERNATIONAL)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/leagues/international`}
            onClick={handleClose}
          />
          <PopoverList
            header={intl.get("leagues.domestic_cup")}
            items={leagues
              .filter((league) => league.type === LeagueType.DOMESTIC_CUP)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/leagues/domestic-cup`}
            onClick={handleClose}
          />
          <PopoverList
            header={intl.get("leagues.cup_international")}
            items={leagues
              .filter((league) => league.type === LeagueType.CUP_INTERNATIONAL)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/leagues/cup-international`}
            onClick={handleClose}
          />
        </Grid>
      </Popover>
    </>
  );
}

export default observer(LeaguesPopover);
