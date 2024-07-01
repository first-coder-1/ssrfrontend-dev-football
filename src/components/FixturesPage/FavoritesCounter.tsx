import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { useTheme, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { getFavoriteCount } from "../../api";
import { useMst } from "../../store";
import { useIntl } from "@/hooks/useIntl";

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  "& .MuiBadge-badge": {
    transform: "scale(1) translate(80%, -70%)",
  },
}));

export const FavoritesCounter = observer(() => {
  const intl = useIntl();
  const { favorites } = useMst();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [count, setCount] = useState(0);

  const leagues = Array.from(favorites.leagues.values());
  const teams = Array.from(favorites.teams.values());
  const fixtures = Array.from(favorites.fixtures.values());

  useEffect(() => {
    const [promise, cancel] = getFavoriteCount(leagues, teams, fixtures);
    promise.then(
      (res) => setCount(res.data.length),
      () => setCount(0)
    );

    return cancel;
  }, [leagues, teams, fixtures]);

  return (
    <StyledBadge badgeContent={count.toString()} color="primary">
      {intl.get(`fixtures.my${isMobile ? "-mobile" : ""}`)}
    </StyledBadge>
  );
});
