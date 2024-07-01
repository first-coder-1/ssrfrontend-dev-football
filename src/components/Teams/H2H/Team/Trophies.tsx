import React, { useState } from 'react';
import TrophyList from '../../../../components/TrophyList';
import { useTrophies } from '../../../../hooks/useTrophies';
import { Team } from '../../../../api';
import PlaceholderList from '../../../../components/PlaceholderList';

type Props = {
  team: Team,
}

export function Trophies(props: Props): React.ReactElement {
  const { team } = props;
  const [loading, setLoading] = useState(true);
  const map = useTrophies(team._id, setLoading);
  if (loading) {
    return <PlaceholderList size={50}/>;
  }
  return (
    <TrophyList map={map} forceMobile/>
  );
}
