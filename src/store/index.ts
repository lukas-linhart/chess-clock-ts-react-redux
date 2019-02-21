import { createStore as createReduxStore } from 'redux';
import { Player } from '../types';
import { reducer } from './reducers';
import { State, initialState } from './state';


export const clock$ = (state: State) => state.clock;
export const playerToMove$ = (state: State) => state.playerToMove;
export const playersTime$ = (state: State, player: Player) => state.time[player];
export const previousTime$ = (state: State) => state.previousTime;

export const createStore = () => {
  return createReduxStore(reducer, initialState);
}
