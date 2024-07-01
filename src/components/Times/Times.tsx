import React, { useEffect, useState } from "react";

// import { Link } from 'react-router-dom';
import { EventType, Fixture, FixtureEvent, FixtureStatus, getFixtureEvents } from "../../api";
import { isFinished, isLive, slugify } from "../../utils";
import SingleTime from "../SingleTime";
import TimeRow from "../TimeRow";
import VideoIcon from "../icons/VideoIcon";
// import { useParams } from "react-router";
import { useIntl } from "@/hooks/useIntl";
import NavLink from "../shared/NavLink/NavLink";

const sortEvents = (a: FixtureEvent, b: FixtureEvent) =>
  b.minute + (b.extra_minute || 0) - (a.minute + (a.extra_minute || 0));

const eventTypes = [
  EventType.YELLOW_CARD,
  EventType.RED_CARD,
  EventType.GOAL,
  EventType.OWN_GOAL,
  EventType.PENALTY,
  EventType.SUBSTITUTION,
];

type Props = {
  fixture: Fixture;
};

export function Times(props: Props): React.ReactElement | null {
  const intl = useIntl();
  // const { locale } = useParams();
  const { fixture } = props;
  const [events, setEvents] = useState<FixtureEvent[]>([]);
  useEffect(() => {
    if (fixture._id) {
      const [promise, cancel] = getFixtureEvents(fixture._id);
      promise.then((res) => setEvents(res.data.events.sort(sortEvents)));
      return cancel;
    }
  }, [fixture._id]);
  if (!isLive(fixture.time.status) && !isFinished(fixture.time.status)) {
    return null;
  }
  const otEvents = events.filter((event) => event.minute > 90 && eventTypes.includes(event.type));
  const ftEvents = events.filter((event) => event.minute > 45 && event.minute <= 90 && eventTypes.includes(event.type));
  const htEvents = events.filter((event) => event.minute <= 45 && eventTypes.includes(event.type));
  const scores = fixture.scores;
  return (
    <>
      {fixture.time.status === FixtureStatus.AET && otEvents.length > 0 && (
        <SingleTime
          title={`${intl.get(`teams.over-time`)} (${
            scores.et_score || `${scores.localteam_score}-${scores.visitorteam_score}`
          })`}
        >
          {otEvents.map((event, i) => (
            <TimeRow
              key={i + "otEventsTimeRow" + event.fixture_id + event.team_id + event.id}
              event={event}
              localteamId={fixture.localteam._id}
              visitorteamId={fixture.visitorteam._id}
              color="action"
            >
              {event.has_video && (
                <NavLink
                  to={`/soccer/fixtures/${slugify(fixture.localteam.name)}/${slugify(fixture.visitorteam.name)}/${
                    fixture._id
                  }/videos`}
                  // state={{ event: event.id }} @TODO: give state to NavLink type
                >
                  <VideoIcon color="action" />
                </NavLink>
              )}
            </TimeRow>
          ))}
        </SingleTime>
      )}
      {ftEvents.length > 0 && (
        <SingleTime
          title={`${intl.get(`teams.full-time`)} (${
            scores.ft_score || `${scores.localteam_score}-${scores.visitorteam_score}`
          })`}
        >
          {ftEvents.map((event, i) => (
            <TimeRow
              key={i + "ftEventsTimeRow" + event.fixture_id + event.team_id + event.id}
              event={event}
              localteamId={fixture.localteam._id}
              visitorteamId={fixture.visitorteam._id}
              color="secondary"
            >
              {event.has_video && (
                <NavLink
                  to={`/soccer/fixtures/${slugify(fixture.localteam.name)}/${slugify(fixture.visitorteam.name)}/${
                    fixture._id
                  }/videos`}
                  // state={{ event: event.id }} @TODO: give state to NavLink type
                >
                  <VideoIcon color="action" />
                </NavLink>
              )}
            </TimeRow>
          ))}
        </SingleTime>
      )}
      {htEvents.length > 0 && (
        <SingleTime
          title={`${intl.get(`teams.half-time`)} (${
            fixture.scores.ht_score || `${scores.localteam_score}-${scores.visitorteam_score}`
          })`}
        >
          {htEvents.map((event, i) => (
            <TimeRow
              key={i + "htEventsTimeRow" + event.fixture_id + event.team_id + event.id}
              event={event}
              localteamId={fixture.localteam._id}
              visitorteamId={fixture.visitorteam._id}
              color="primary"
            >
              {event.has_video && (
                <NavLink
                  to={`/soccer/fixtures/${slugify(fixture.localteam.name)}/${slugify(fixture.visitorteam.name)}/${
                    fixture._id
                  }/videos`}
                  // state={{ event: event.id }} @TODO: give state to NavLink type
                >
                  <VideoIcon color="action" />
                </NavLink>
              )}
            </TimeRow>
          ))}
        </SingleTime>
      )}
    </>
  );
}

export default Times;
