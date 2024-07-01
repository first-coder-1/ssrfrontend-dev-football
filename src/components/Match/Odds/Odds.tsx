import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import Paper from "@mui/material/Paper";
import { Fixture, getFixtureOdds, Odds as OddsType } from "../../../api";
import PlaceholderList from "../../../components/PlaceholderList";
import { AlertStore } from "../../../store/AlertStore";
import { Alert, AlertSeverity } from "../../../models/Alert";
import { ODDS_MODE, SettingsStore } from "../../../store";
import Markets from "../Markets";
import Predictions from "../Predictions";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  fixture: Fixture;
  settings: SettingsStore;
  alerts: AlertStore;
  odds: OddsType;
};

const DEFAULT_BOOKMAKER = 2;

export function Odds({ fixture, settings, alerts, odds }: Props) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<OddsType | undefined>(odds);
  const [bookmaker, setBookmaker] = useState<number>();

  const showLoader = loading || !response;

  useEffect(() => {
    if (
      !showLoader &&
      response &&
      response.odds.every((market) => market.bookmaker.length === 0) &&
      bookmaker !== DEFAULT_BOOKMAKER
    ) {
      setBookmaker(DEFAULT_BOOKMAKER);
      alerts.addAlert(new Alert(intl.get("bookmaker-warning"), AlertSeverity.warning));
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [loading, response, bookmaker]);

  useEffect(() => {
    settings.fetchBookmaker().then((val) => {
      setBookmaker(val);
    });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [promise] = getFixtureOdds(fixture._id, bookmaker);
      promise.then(
        (res) => {
          setResponse(res.data);
          setLoading(false);
        },
        () => {
          setResponse(undefined);
          setLoading(false);
        }
      );
    })();
  }, [fixture, bookmaker]);

  if (showLoader) {
    return (
      <Paper>
        <PlaceholderList size={100} />
      </Paper>
    );
  }

  return settings.oddsMode === ODDS_MODE.ODDS ? (
    <Markets markets={response.odds} oddsFormat={settings.oddsFormat} />
  ) : (
    <Predictions predictions={response.predictions} />
  );
}

export default Odds;
