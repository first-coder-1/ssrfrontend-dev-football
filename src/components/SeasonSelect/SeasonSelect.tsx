import React, { useMemo } from "react";

import { makeStyles } from "tss-react/mui";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { ActiveSeason } from "../../api";
import Select from "../Select";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  button: {
    width: "100%",
  },

  label: {
    ...theme.textOverflow,
  },

  child: {
    paddingLeft: theme.spacing(2),
  },

  group: {
    fontWeight: theme.typography.fontWeightMedium,
  },

  competition: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

type Props = {
  activeSeason?: ActiveSeason;
  setActiveSeason: (season?: ActiveSeason) => void;
  seasons: ActiveSeason[];
  className?: string;
  useSeasonName?: boolean;
  hideTitle?: boolean;
};

export function SeasonSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes, cx } = useStyles();
  const { activeSeason, setActiveSeason, seasons, className, useSeasonName, hideTitle } = props;
  const { settings } = useMst();
  const [groups, isGrouped] = useMemo(() => {
    let isGrouped = false;
    const groups = seasons.reduce((map, season) => {
      const key = (!settings.originalNames && season.league.name_loc) || season.league.name;
      if (map.has(key)) {
        const entry = map.get(key)!;
        entry.push(season);
        isGrouped = true;
      } else {
        map.set(key, [season]);
      }
      return map;
    }, new Map<string, ActiveSeason[]>());
    return [groups, isGrouped] as const;
  }, [seasons, settings]);

  return (
    <Select
      label={
        <Box>
          {!hideTitle && (
            <span className={cx({ [classes.competition]: !useSeasonName, [classes.bold]: useSeasonName })}>
              {intl.get(useSeasonName ? "teams.date" : "teams.competition")}:
            </span>
          )}
          &nbsp;
          <span className={classes.label}>
            {isGrouped
              ? activeSeason?.name
              : (!settings.originalNames && activeSeason?.league.name_loc) || activeSeason?.league.name}
          </span>
        </Box>
      }
      className={cx(classes.button, className)}
    >
      {(onClose) =>
        Array.from(groups.entries()).map(([name, seasons]) => {
          const menu: React.ReactElement[] = [];
          if (isGrouped) {
            menu.push(
              <MenuItem key={name}>
                <ListItemText
                  primary={name}
                  primaryTypographyProps={{ variant: "h4" }}
                  classes={{ primary: classes.group }}
                />
              </MenuItem>
            );
          }
          seasons.forEach((season) =>
            menu.push(
              <MenuItem
                key={season._id}
                selected={season === activeSeason}
                disabled={!season.has_fixtures}
                onClick={() => {
                  setActiveSeason(season);
                  onClose();
                }}
              >
                <ListItemText
                  primary={
                    isGrouped ? season.name : (!settings.originalNames && season.league.name_loc) || season.league.name
                  }
                  className={cx({ [classes.child]: isGrouped })}
                />
              </MenuItem>
            )
          );

          return menu;
        })
      }
    </Select>
  );
}

export default observer(SeasonSelect);
