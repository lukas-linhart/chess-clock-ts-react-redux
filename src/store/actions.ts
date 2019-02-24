import { Player } from '../types';

export const actionTypes = {
  TOGGLE_CLOCK: 'TOGGLE_CLOCK',
  TICK: 'TICK',
  PAUSE_CLOCK: 'PAUSE_CLOCK',
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

export const pauseClock = (timestampFunc = Date.now) => ({
  type: actionTypes.PAUSE_CLOCK,
  timestamp: timestampFunc(),
});
