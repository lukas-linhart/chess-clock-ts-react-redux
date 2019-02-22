import { createStore as createReduxStore } from 'redux';
import { Player } from '../types';
import { reducer } from './reducers';
import { State, initialState } from './state';
import { clockTimerSubscription } from './subscriptions';


export const clock$ = (state: State) => state.clock.run;
export const playerToMove$ = (state: State)  => (
  (state.clock.run === 'initial') ? null : state.clock.playerToMove
);
export const playersTime$ = (state: State, player: Player) => state.time[player];
export const previousTime$ = (state: State) => state.previousTime;

export const createStore = (shouldSubscribe = true) => {
  const store = createReduxStore(reducer, initialState);
  if (shouldSubscribe) clockTimerSubscription(store);
  return store;
}
