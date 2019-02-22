import { Player } from '../types';

export type ClockState = { run: 'initial' }
  | { run: 'running', playerToMove: Player }
  | { run: 'ended', playerToMove: Player };

export type State = {
  clock: ClockState,
  previousTime: number,
  time: {
    player1: number,
    player2: number,
  },
};

export const initialState: State = {
  clock: { run: 'initial' },
  previousTime: 0,
  time: {
    player1: 5000,
    player2: 5000,
  },
};
