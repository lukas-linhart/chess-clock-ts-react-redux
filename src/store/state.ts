import { Player } from '../types';

export type ClockState = 'initial' | 'running';

export type State = {
  clock: ClockState,
  playerToMove: Player | null,
  previousTime: number,
  time: {
    player1: number,
    player2: number,
  },
};

export const initialState: State = {
  clock: 'initial',
  playerToMove: null,
  previousTime: 0,
  time: {
    player1: 5000,
    player2: 5000,
  },
};
