import React from 'react';
import ClockDial from './ClockDial';
import { players } from '../../constants';

const ClockFace = () => (
  <div className="clockFace">
    {players.map(player =>
      <ClockDial key={player} player={player} state="inactive" />
    )}
  </div>
);

export default ClockFace;
