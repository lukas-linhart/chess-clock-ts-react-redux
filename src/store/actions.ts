import { Player } from '../types';

export const actionTypes = {
  TOGGLE_CLOCK: 'TOGGLE_CLOCK',
  TICK: 'TICK',
};

export const toggleClock = (player: Player, timestampFunc = Date.now) => ({
  type: actionTypes.TOGGLE_CLOCK,
  player: player,
  timestamp: timestampFunc(),
});

export const tick = (timestampFunc = Date.now) => ({
  type: actionTypes.TICK,
  timestamp: timestampFunc(),
});
