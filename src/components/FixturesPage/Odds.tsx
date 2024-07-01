import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
// import intl from 'react-intl-universal';
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { FixtureLeague, getLivescoreOdds, FixtureWithMarket } from "../../api";
import { OddsLeagueItem } from "./OddsLeagueItem";
import { PlaceholderList } from "./PlaceholderList";
import { sortLeagues } from "../../utils";
import { FavoritesStore, SettingsStore } from "../../store";
import { FixtureLeagueModel } from "../../models/FixtureLeagueModel";
import { ItemList } from "./ItemList";
import { useIntl } from "@/hooks/useIntl";

type Response = {
  loading: boolean;
  leagues: FixtureLeagueModel<FixtureLeague<FixtureWithMarket>>[];
};

type Props = {
  favorites: FavoritesStore;
  settings: SettingsStore;
};

const initialState = { loading: true, leagues: [] };

export const Odds = observer(function OddsFnc(props: Props): React.ReactElement {
  const intl = useIntl();
  const { favorites, settings } = props;
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const [response, setResponse] = useState<Response>(initialState);
  useEffect(() => {
    (async () => {
      setResponse(initialState);
      await settings.fetchBookmaker();
      const [promise] = getLivescoreOdds(settings.bookmaker, settings.esoccer, settings.friendly, settings.women);
      promise.then(
        (res) =>
          setResponse({
            loading: false,
            leagues: res.data.map((league) => new FixtureLeagueModel(league, settings.country, settings.openLeagues)),
          }),
        () => setResponse(initialState)
      );
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [settings.bookmaker, settings.esoccer, settings.friendly, settings.women, settings.country, settings.openLeagues]);

  const favoriteLeagues = favorites.leagues.values();
  const sortedLeagues = useMemo(() => {
    return response.leagues.slice().sort(sortLeagues(Array.from(favoriteLeagues), settings.country, !!settings.fl));
  }, [response.leagues, favoriteLeagues, settings.country, settings.fl]);

  if (response.loading) {
    return <PlaceholderList endWidth="5%" />;
  }

  return (
    <>
      {!settings.oddsSwitchPositionNotified && (
        <Alert severity="warning" onClose={settings.notifyOddsSwitchPosition}>
          {intl.get("settings.switch-odds-info")}
        </Alert>
      )}
      <Box
        sx={(theme) => ({
          height: `calc(100% - ${68 + (settings.oddsSwitchPositionNotified ? 0 : 48)}px)`,
          [theme.breakpoints.down("md")]: {
            height: `calc(100% - ${88 + (settings.oddsSwitchPositionNotified ? 0 : 48)}px)`,
          },
        })}
      >
        <ItemList leagues={sortedLeagues} subItemSize={isMobile ? 120 : 40}>
          {(leagues) =>
            ({ index, style, key }) => (
              <div key={key} style={style}>
                <OddsLeagueItem
                  favorites={favorites}
                  settings={settings}
                  leagueModel={leagues[index] as FixtureLeagueModel<FixtureLeague<FixtureWithMarket>>}
                  format={settings.oddsFormat}
                />
              </div>
            )}
        </ItemList>
      </Box>
    </>
  );
});
