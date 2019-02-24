import { Player } from '../types';
import { INITIAL_TIME } from '../constants';

export type ClockState = { run: 'initial' }
  | { run: 'running', playerToMove: Player }
  | { run: 'paused', playerToMove: Player }
  | { run: 'ended', playerToMove: Player };

export type View = 'clock' | 'resetDialog';

export type State = {
  view: View,
  clock: ClockState,
  previousTime: number,
  time: {
    player1: number,
    player2: number,
  },
};

export const initialState: State = {
  view: 'clock',
  clock: { run: 'initial' },
  previousTime: 0,
  time: {
    player1: INITIAL_TIME,
    player2: INITIAL_TIME,
  },
};
