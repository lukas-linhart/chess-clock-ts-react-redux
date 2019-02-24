import React from 'react';
import ClockDial from './ClockDial';
import Controls from './Controls';
import { players } from '../../types';

const ClockFace = () => (
  <div className="clockFace">
    {players.map(player =>
      <ClockDial key={player} player={player} />
    )}
    <Controls />
  </div>
);

export default ClockFace;
