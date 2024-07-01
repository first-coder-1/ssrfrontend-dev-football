import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import { Fixture, FixtureEvent, getFixtureEvents, getFixtureHighlights, Highlight } from "../../../api";
import Video from "./Video";

type Props = {
  fixture: Fixture;
  events: FixtureEvent[];
  highlights: Highlight[];
};

const transformEvents = (events: FixtureEvent[]) => {
  return events.reduce((map, event) => map.set(event.id, event), new Map());
};

export function Videos(props: Props): React.ReactElement {
  const { fixture, events: initialEvents, highlights: initialHighlights } = props;
  const [events, setEvents] = useState<Map<number, FixtureEvent>>(transformEvents(initialEvents));
  const [videos, setVideos] = useState<Highlight[]>(initialHighlights);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const [eventPromise, cancelEvents] = getFixtureEvents(fixture._id);
    const [highlightPromise, cancelHighlights] = getFixtureHighlights(fixture._id, "clip");
    Promise.all([eventPromise, highlightPromise])
      .then((values) => {
        setEvents(values[0].data.events.reduce((map, event) => map.set(event.id, event), new Map()));
        setVideos(values[1].data);
      })
      .finally(() => setLoading(false));
    return () => {
      cancelEvents();
      cancelHighlights();
    };
  }, [fixture]);
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton width="100%" animation="wave" sx={{ height: 250 }} />
        </CardContent>
        <CardActions>
          <Skeleton width="100%" animation="wave" sx={{ height: 25 }} />
        </CardActions>
      </Card>
    );
  }
  return (
    <>
      {videos.map((video, i) => {
        const event = video.event_id && events.has(video.event_id) ? events.get(video.event_id) : undefined;
        return <Video key={video.location! + i + video.created_at} fixture={fixture} video={video} event={event} />;
      })}
    </>
  );
}

export default Videos;
