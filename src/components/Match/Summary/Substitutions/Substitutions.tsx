import React from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Fixture, FixtureEvent, Lineups, Squad, Squads } from "../../../../api";
import SubstitutionList from "./SubstitutionList";
import { useTeamReserves } from "../../../../hooks/useTeamReserves";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()(() => ({
  content: {
    display: "flex",
  },
}));

type Props = {
  fixture: Fixture;
  lineups: Lineups;
  events: FixtureEvent[];
  reservesSquads: { localReserves: Squad[]; visitorReserves: Squad[] };
};

export function Substitutions(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { fixture, lineups, events, reservesSquads } = props;
  // const localReserves = useTeamReserves(fixture.localteam._id, fixture.season_id, lineups, events);
  // const visitorReserves = useTeamReserves(fixture.visitorteam._id, fixture.season_id, lineups, events);
  if (reservesSquads) {
    return null;
  }

  const { localReserves, visitorReserves } = reservesSquads;

  return (
    <Card>
      <CardHeader
        title={intl.get("match.substitutions")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent className={classes.content}>
        <SubstitutionList reserves={localReserves} events={events} />
        <SubstitutionList reserves={visitorReserves} events={events} />
      </CardContent>
    </Card>
  );
}

export default Substitutions;
