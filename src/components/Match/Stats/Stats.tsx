import React from "react";
import { Comment, Fixture, FixtureStats } from "../../../api";
import Chart from "./Chart";
import { Comments } from "./Comments";

type Props = {
  fixture: Fixture;
  stats: FixtureStats;
  comments: Comment[];
};

export function Stats(props: Props): React.ReactElement {
  const { fixture, stats, comments } = props;
  return (
    <>
      <Chart fixture={fixture} stats={stats} />
      <Comments comments={comments} fixture={fixture} />
    </>
  );
}

export default Stats;
