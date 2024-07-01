import React from "react";
// import intl from 'react-intl-universal';
// import { useParams } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { EventType, FixtureEvent, Squad } from "../../../../api";
import ReplyIcon from "../../../../components/icons/ReplyIcon";
import Flag from "../../../../components/Flag";
import { slugify } from "../../../../utils";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink";

const useStyles = makeStyles()((theme) => ({
  root: {
    flexBasis: "50%",
    "&:first-of-type": {
      borderRight: `1px solid ${theme.palette.grey[500]}`,
    },
  },

  item: {
    minHeight: 50,
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.grey[300],
    },
    [theme.breakpoints.down("md")]: {
      minHeight: 100,
      flexDirection: "column",
      justifyContent: "center",
    },
  },

  left: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "row-reverse",
    },
  },

  position: {
    width: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(2),
    },
  },

  substitution: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },

  icon: {
    color: theme.palette.success.main,
    transform: "scaleX(-1)",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2),
    },
  },
}));

type Props = {
  events: FixtureEvent[];
  reserves: Squad[];
};

export function SubstitutionList(props: Props): React.ReactElement {
  const { classes } = useStyles();
  const { reserves, events } = props;
  const { settings } = useMst();
  // const { locale } = useParams();
  const intl = useIntl();
  return (
    <List disablePadding className={classes.root}>
      {reserves.map((squad) => {
        const event = events.find(
          (event) => event.type === EventType.SUBSTITUTION && event.player_id === squad.player_id
        );
        return (
          <ListItem key={squad.player_id} className={classes.item}>
            <Box className={classes.left}>
              <Typography align="right" className={classes.position}>
                {squad.number}
              </Typography>
              {squad.player!.country_iso2 && <Flag country={squad.player!.country_iso2} />}
            </Box>
            <Typography
              className={classes.substitution}
              component={NavLink}
              to={
                squad.player?.common_name
                  ? `/soccer/players/${slugify(squad.player?.common_name)}/${squad.player_id}/summary`
                  : `/soccer/players`
              }
            >
              {event
                ? intl.get("match.substitution", {
                    player_out: event.player_name!,
                    player_in: event.related_player_name!,
                    time: event.minute + (event.extra_minute || 0),
                  })
                : (!settings.originalNames && squad.player?.common_name_loc) || squad.player?.common_name}
            </Typography>
            {event && <ReplyIcon fontSize="small" className={classes.icon} />}
          </ListItem>
        );
      })}
    </List>
  );
}

export default observer(SubstitutionList);
