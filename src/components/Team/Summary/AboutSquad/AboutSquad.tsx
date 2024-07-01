import React, { useMemo, useState } from 'react';
import { Team } from '../../../../api';
import { useSeasons } from '../../../../hooks/useSeasons';
import { Current } from './Current';

type Props = {
  team: Team,
  showSidelined?: boolean,
}

export function AboutSquad(props: Props): React.ReactElement | null {
  const { team } = props;
  const [active] = useState(0);
  const options = useMemo(() => ({
    withSquads: active !== 2,
    withSidelined: active === 2,
  }), [active]);
  // eslint-disable-next-line
  const [seasons, activeSeason] = useSeasons(team._id, team.current_season_id, options);

  return (
    <>
      {active === 0 && <Current team={team} activeSeason={activeSeason}/>}
    </>
  );
}

export default AboutSquad;
