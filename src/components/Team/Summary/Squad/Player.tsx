import React from "react";

import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import SoccerIcon from "../../../../components/icons/SoccerIcon";
import { PlayerShort as PlayerType } from "../../../../api";
import { age as calcAge, slugify } from "../../../../utils";
import Flag from "../../../../components/Flag";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import PlayerImage from "../../../../components/PlayerImage";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "@/components/shared/NavLink/NavLink";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: theme.spacing(11),
  },

  name: {
    ...theme.textOverflow,
  },

  appearences: {
    width: 11,
    height: 15,
    borderRadius: 6,
    backgroundColor: theme.palette.success.main,
  },
}));

type Props = {
  player: PlayerType;
  appearences?: number | null;
  goals?: number | null;
  disableLink?: boolean;
};

export function Player(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { player, appearences, goals, disableLink } = props;
  const { settings } = useMst();
  const date = new Date();
  const age = player.birthdate ? calcAge(player.birthdate, date) : null;

  return (
    <Box component={Paper} sx={{ p: 2, display: "flex" }} className={classes.root}>
      <PlayerImage
        disableMargin
        url={player.image_path || undefined}
        name={(!settings.originalNames && player.common_name_loc) || player.common_name}
        variant="60x60"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          justifyContent: "space-between",
          ml: 2,
          overflow: "hidden",
        }}
      >
        {disableLink ? (
          <Typography variant="h3" className={classes.name}>
            {(!settings.originalNames && player.common_name_loc) || player.common_name}
          </Typography>
        ) : (
          <Typography
            variant="h3"
            className={classes.name}
            component={NavLink}
            to={`/soccer/players/${slugify(player.common_name)}/${player._id}/summary`}
          >
            {(!settings.originalNames && player.common_name_loc) || player.common_name}
          </Typography>
        )}
        {age && <Typography>{intl.get("years-old", { age })}</Typography>}
        <Box sx={{ display: "flex", mt: 0.5 }}>
          {appearences !== undefined && (
            <Box sx={{ width: 32, display: "flex", alignItems: "center", justifyContent: "space-between", mr: 1.5 }}>
              <div className={classes.appearences} />
              <Typography>{appearences || 0}</Typography>
            </Box>
          )}
          {goals !== undefined && (
            <Box sx={{ width: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SoccerIcon color="action" viewBox="0 0 17 17" fontSize="small" />
              <Typography>{goals || 0}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      {player.country_iso2 && <Flag country={player.country_iso2} />}
    </Box>
  );
}

export default observer(Player);
