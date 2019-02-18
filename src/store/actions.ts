import { Player } from '../types';

export const actionTypes = {
  TOGGLE_CLOCK: 'TOGGLE_CLOCK',
};

export const toggleClock = (player: Player) => ({
  type: actionTypes.TOGGLE_CLOCK,
  player: player,
});
