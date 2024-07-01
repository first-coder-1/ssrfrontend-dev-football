import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
// import { useLocation } from "react-router";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TimeRow from "../../../components/TimeRow";
import { Fixture, FixtureEvent, Highlight } from "../../../api";

const useStyles = makeStyles()((theme) => ({
  video: {
    backgroundColor: theme.palette.grey[300],
  },
}));

type Props = {
  fixture: Fixture;
  video: Highlight;
  event?: FixtureEvent;
};

const tabsMargin = 150;

function Video(props: Props) {
  const { classes } = useStyles();
  const { fixture, video, event } = props;
  // const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (event && (location.state as any)?.event === event.id && ref.current) {
  //     window.scrollTo(0, ref.current.offsetTop - tabsMargin);
  //   }
  // }, [location, event]);
  return (
    <Card ref={ref}>
      <CardContent className={classes.video}>
        <ReactPlayer url={video.location} controls light width="100%" playing />
      </CardContent>
      {event && (
        <CardActions>
          <TimeRow
            event={event}
            localteamId={fixture.localteam._id}
            visitorteamId={fixture.visitorteam._id}
            color="secondary"
          />
        </CardActions>
      )}
    </Card>
  );
}

export default Video;
