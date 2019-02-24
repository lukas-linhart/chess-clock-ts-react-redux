import { Player } from '../types';

export const actionTypes = {
  TOGGLE_CLOCK: 'TOGGLE_CLOCK',
  TICK: 'TICK',
  PAUSE_CLOCK: 'PAUSE_CLOCK',
  RESET_CLOCK_PROMPT: 'RESET_CLOCK_PROMPT',
  RESET_CLOCK_CANCEL: 'RESET_CLOCK_CANCEL',
  RESET_CLOCK_CONFIRM: 'RESET_CLOCK_CONFIRM',
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

export const resetClockPrompt = (timestampFunc = Date.now) => ({
  type: actionTypes.RESET_CLOCK_PROMPT,
  timestamp: timestampFunc(),
});

export const resetClockCancel = () => ({
  type: actionTypes.RESET_CLOCK_CANCEL,
});

export const resetClockConfirm = () => ({
  type: actionTypes.RESET_CLOCK_CONFIRM,
});
