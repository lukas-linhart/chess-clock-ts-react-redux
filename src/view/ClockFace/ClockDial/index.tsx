import React from 'react';
import { Player } from '../../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { playerToMove$, playersTime$, clock$ } from '../../../store';
import { State } from '../../../store/state';
import { toggleClock } from '../../../store/actions';
import { formattedTime } from '../../../helpers';

export type DialState = 'inactive' | 'active' | 'ended' | 'paused';

type OwnProps = {
  player: Player,
};

type StateProps = {
  state: DialState,
  time: number,
};

type DispatchProps = {
  clickHandler: Function,
};

type Props = OwnProps & StateProps & DispatchProps;

export const ClockDial = ({ player, state, time, clickHandler }: Props) => (
  <div
    className={`clockDial ${state}`}
    id={player}
    onClick={() => clickHandler()}
  >
    {formattedTime(time)}
  </div>
);

const mapState = (state: State, ownProps: OwnProps): StateProps => {
  const player = ownProps.player;
  const playerToMove = playerToMove$(state);
  return {
    state: (
      (player !== playerToMove && 'inactive')
      || (clock$(state) === 'running' && 'active')
      || (clock$(state) === 'paused' && 'paused')
      || 'ended'
    ),
    time: playersTime$(state, player),
  };
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): DispatchProps => ({
  clickHandler: () => dispatch(toggleClock(ownProps.player)),
});

export default connect(mapState, mapDispatch)(ClockDial);
