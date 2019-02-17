import React from 'react';
import { Player } from '../../../constants';

type Props = {
  player: Player,
  state: 'inactive',
};

const ClockDial = ({ player, state }: Props) => (
  <div className={`clockDial ${state}`} id={player}>
    {player}
  </div>
);


export default ClockDial;
