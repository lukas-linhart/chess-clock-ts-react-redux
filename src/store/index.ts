import { createStore as createReduxStore, Reducer } from 'redux';
import { actionTypes } from './actions';
import { Player } from '../types';
import { oppositePlayer } from '../helpers';

export type ClockState = 'initial' | 'running';

export type State = {
  clock: ClockState,
  playerToMove: Player | null,
  time: {
    player1: number,
    player2: number,
  },
};

const initialState: State = {
  clock: 'initial',
  playerToMove: null,
  time: {
    player1: 5000,
    player2: 5000,
  },
};

const reducer: Reducer<State> = (state = initialState , action): State => {
  switch (action.type) {
    case actionTypes.TOGGLE_CLOCK:
      return {
        ...state,
        clock: 'running',
        playerToMove: oppositePlayer(action.player),
      };
    default:
      return state;
  }
}

export const clock$ = (state: State) => state.clock;
export const playerToMove$ = (state: State) => state.playerToMove;
export const playerTime$ = (state: State, player: Player) => state.time[player];

export const createStore = () => {
  return createReduxStore(reducer, initialState);
}
