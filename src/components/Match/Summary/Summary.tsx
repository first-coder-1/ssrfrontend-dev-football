import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import {
  AdditionalInfo,
  Fixture,
  FixtureEvent,
  getFixtureEvents,
  getFixtureLineup,
  Lineups,
  Squad,
} from "../../../api";
import Info from "./Info";
import About from "./About";
import StartingLineup from "./StartingLineup";
import Substitutions from "./Substitutions";
import Additional from "./Additional";
import FixturesCard from "@/components/FixturesCard";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";
import { Response } from "@/components/TeamFixtureList";
import { TReservesSquads } from "@/pages/soccer/fixtures/[leftTeam]/[rightTeam]/[matchId]/summary";

type Props = {
  fixture: Fixture;
  events: FixtureEvent[];
  lineups: Lineups;
  reservesSquads: TReservesSquads;
  fixturesRes: { localFixtures: Response; visitorFixtures: Response };
  fixtureAddInfo: AdditionalInfo | undefined;
};

export function Summary(props: Props): React.ReactElement {
  const {
    fixture,
    events: initialEvents,
    lineups: initialLineups,
    reservesSquads,
    fixturesRes,
    fixtureAddInfo,
  } = props;
  const intl = useIntl();
  const { settings } = useMst();
  const [events, setEvents] = useState<FixtureEvent[]>(initialEvents);
  const [lineups, setLineups] = useState<Lineups | undefined>(initialLineups);

  useEffect(() => {
    const [promise, cancel] = getFixtureEvents(fixture._id);
    promise.then((res) => setEvents(res.data.events));
    return cancel;
  }, [fixture]);

  useEffect(() => {
    const [promise, cancel] = getFixtureLineup(fixture._id);
    promise.then((res) => setLineups(res.data));
    return cancel;
  }, [fixture]);

  return (
    <>
      <Info fixture={fixture} />
      {lineups && <StartingLineup fixture={fixture} lineups={lineups} events={events} />}
      {lineups && reservesSquads && (
        <Substitutions fixture={fixture} lineups={lineups} events={events} reservesSquads={reservesSquads} />
      )}
      <Additional fixture={fixture} fixtureAddInfo={fixtureAddInfo} />
      <FixturesCard
        teamId={fixture.localteam._id}
        seasonId={fixture.season_id}
        title={intl.get("match.team-matches", {
          team: (!settings.originalNames && fixture.localteam.name_loc) || fixture.localteam.name,
        })}
        fixtureRes={fixturesRes.localFixtures}
      />
      <FixturesCard
        teamId={fixture.visitorteam._id}
        seasonId={fixture.season_id}
        title={intl.get("match.team-matches", {
          team: (!settings.originalNames && fixture.visitorteam.name_loc) || fixture.visitorteam.name,
        })}
        fixtureRes={fixturesRes.visitorFixtures}
      />
      <About fixture={fixture} />
    </>
  );
}

export default observer(Summary);
