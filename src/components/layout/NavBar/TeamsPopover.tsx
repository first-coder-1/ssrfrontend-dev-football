import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popover from "@mui/material/Popover";
import Grid from "@mui/material/Grid";
import { getSelectedTeams, MyTeam } from "@/api";
import { PopoverList } from "./PopoverList";
import NavItem from "./NavItem/NavItem";
import { slugify } from "@/utils";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { useRouter } from "next/router";

const useStyles = makeStyles()((theme) => ({
  popover: {
    width: theme.spacing(70),
  },
}));

export function TeamsPopover(): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const [teams, setTeams] = useState<MyTeam[]>([]);
  useEffect(() => {
    const [promise, cancel] = getSelectedTeams();
    promise.then((res) => setTeams(res.data));
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

  const map = (team: MyTeam) => ({
    id: team._id,
    url: `/soccer/teams/${slugify(team.name)}/${team._id}/summary`,
    title: (!settings.originalNames && team.name_loc) || team.name,
    asset: team.logo_path,
  });

  return (
    <>
      <NavItem to={`/soccer/teams`} onClick={handleClick}>
        {intl.get("navbar.teams")}
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
            header={intl.get("teams.domestic")}
            items={teams
              .filter((team) => !team.national_team)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/teams/domestic`}
            onClick={handleClose}
          />
          <PopoverList
            header={intl.get("teams.national")}
            items={teams
              .filter((team) => team.national_team)
              .slice(0, 10)
              .map(map)}
            viewAllUrl={`/soccer/teams/national`}
            onClick={handleClose}
          />
        </Grid>
      </Popover>
    </>
  );
}

export default observer(TeamsPopover);
