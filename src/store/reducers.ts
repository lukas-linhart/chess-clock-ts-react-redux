import { oppositePlayer } from '../helpers';
import { Reducer } from 'redux';
import { State, initialState } from './state';
import { actionTypes } from './actions';
import { Player } from '../types';


const newTime = (state: State, player: Player, timestamp: number) => (
  state.time[player] - (timestamp - state.previousTime)
);

export const reducer: Reducer<State> = (state = initialState , action): State => {
  switch (action.type) {
    case actionTypes.TOGGLE_CLOCK:
      if (state.clock === 'initial') {
        return {
          ...state,
          clock: 'running',
          playerToMove: oppositePlayer(action.player),
          previousTime: action.timestamp,
        };
      } else if (state.clock === 'running' && action.player === state.playerToMove) {
        return {
          ...state,
          clock: 'running',
          playerToMove: oppositePlayer(action.player),
          previousTime: action.timestamp,
          time: {
            ...state.time,
            [action.player]: newTime(state, action.player, action.timestamp),
          },
        };
      } else {
        return state;
      }

    default:
      return state;
  }
}
