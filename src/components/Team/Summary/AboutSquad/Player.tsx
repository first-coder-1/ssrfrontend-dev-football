import React from 'react';
import { PlayerShort as PlayerType } from '../../../../api';
import { observer } from 'mobx-react-lite';

type Props = {
  player: PlayerType,
}

export function Player(props: Props): React.ReactElement {
  const { player } = props;
  return (
      <>
       {player.common_name} {' '}
      </>
  );
}

export default observer(Player);
