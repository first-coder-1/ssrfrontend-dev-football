import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {
  getFixturesByStage,
  getStagesBySeason,
  League,
  LeagueSeason,
  Stage,
  TeamSeasonDoubleFixture,
} from "../../../../api";
import { Stages } from "./Stages";
import PlaceholderList from "../../../../components/PlaceholderList";
import { isFinished } from "../../../../utils";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  league: League;
  season?: LeagueSeason;
  doubleFixtures: TeamSeasonDoubleFixture[][];
};

export function Qualification(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { season, doubleFixtures } = props;
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [fixtures, setFixtures] = useState<TeamSeasonDoubleFixture[][]>(doubleFixtures);

  useEffect(() => {
    if (season?._id) {
      setLoading(true);
      const [promise, cancel] = getStagesBySeason(season._id);
      promise.then(
        (res) => setStages(res.data),
        () => setStages([])
      );
      return cancel;
    }
  }, [season?._id]);

  useEffect(() => {
    const returns = stages.map((stage) => getFixturesByStage(stage._id));
    const groupStageIndex = stages.findIndex((stage) => stage.type === "Group Stage");
    Promise.all(returns.map((result) => result[0])).then(
      (results) =>
        setFixtures(
          results.map((result, i) => {
            setLoading(false);
            return result.data.reduce<TeamSeasonDoubleFixture[]>((fixtures, fixture) => {
              const prev = fixtures.find(
                (prev) => prev.localteam_id === fixture.visitorteam_id && prev.visitorteam_id === fixture.localteam_id
              );
              const finished = isFinished(fixture.time.status);
              if (prev && i > groupStageIndex) {
                if (finished) {
                  prev.localteam_scores.push(fixture.visitorteam_score);
                  prev.visitorteam_scores.push(fixture.localteam_score);
                }
              } else {
                fixtures.push({
                  ...fixture,
                  localteam_scores: finished ? [fixture.localteam_score] : [],
                  visitorteam_scores: finished ? [fixture.visitorteam_score] : [],
                });
              }

              return fixtures;
            }, []);
          })
        ),
      () => setLoading(false)
    );
  }, [stages]);

  if (!season?.is_draw) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={intl.get("leagues.draw")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        {loading ? <PlaceholderList size={40} /> : <Stages stages={stages} fixtures={fixtures} />}
      </CardContent>
    </Card>
  );
}

export default Qualification;
