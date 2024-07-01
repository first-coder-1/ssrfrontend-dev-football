import React from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "../../components/Select";
import { LeagueSeason } from "../../api";
import { matchPath } from "react-router";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useMst } from "@/store";

type Props = {
  seasons: LeagueSeason[];
  activeSeason?: LeagueSeason;
  setActiveSeason: (season: LeagueSeason) => void;
};

export const SeasonSelect = observer(({ setActiveSeason, seasons, activeSeason }: Props) => {
  const location = useRouter();

  const { intermediate } = useMst();

  if (
    matchPath({ path: "/soccer/leagues/:name/:id/sidelined" }, location.pathname) ||
    matchPath({ path: "/soccer/leagues/:name/:id/transfers" }, location.pathname) ||
    matchPath({ path: "/soccer/leagues/:name/:id/trophies" }, location.pathname) ||
    matchPath({ path: "/soccer/leagues/:name/:id/venues" }, location.pathname)
  ) {
    return null;
  }

  return (
    <Select label={activeSeason?.name}>
      {(onClose) =>
        seasons.map((season) => (
          <MenuItem
            key={season._id}
            selected={activeSeason?._id === season._id}
            disabled={!season.has_fixtures}
            onClick={() => {
              intermediate.setActiveSeason(season);
              setActiveSeason(season);
              onClose();
            }}
          >
            <ListItemText primary={season.name} />
          </MenuItem>
        ))
      }
    </Select>
  );
});
