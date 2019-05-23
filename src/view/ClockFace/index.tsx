import React from 'react';
import { connect } from 'react-redux';
import ClockDial from './ClockDial';
import Controls from './Controls';
import { players } from '../../types';
import { State } from '../../store/state';
import { view$ } from '../../store';

type Props = {
  isBlurred: boolean,
};

export const ClockFace = ({ isBlurred }: Props) => (
  <div className={`clockFace${isBlurred ? ' blurred' : ''}`}>
    {players.map(player =>
      <ClockDial key={player} player={player} />
    )}
    <Controls />
  </div>
);

const mapState = (state: State): Props => ({
  isBlurred: view$(state) !== 'clock'
})

export default connect(mapState)(ClockFace);
