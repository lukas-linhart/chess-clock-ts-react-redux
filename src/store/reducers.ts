import { oppositePlayer } from '../helpers';
import { Reducer } from 'redux';
import { State, initialState } from './state';
import { actionTypes } from './actions';
import { Player } from '../types';
import { INITIAL_TIME } from '../constants';


const getNewTime = (state: State, player: Player, timestamp: number) => (
  state.time[player] - (timestamp - state.previousTime)
);

export const reducer: Reducer<State> = (state = initialState , action): State => {
  switch (action.type) {
    case actionTypes.TOGGLE_CLOCK:
      if (state.clock.run === 'initial') {
        return {
          ...state,
          clock: {
            run: 'running',
            playerToMove: oppositePlayer(action.player),
          },
          previousTime: action.timestamp,
        };
      } else if (state.clock.run === 'paused' && action.player === oppositePlayer(state.clock.playerToMove)) {
        return {
          ...state,
          clock: {
            ...state.clock,
            run: 'running',
          },
          previousTime: action.timestamp,
        };
      } else if (state.clock.run === 'running' && action.player === state.clock.playerToMove) {
        return {
          ...state,
          clock: {
            run: 'running',
            playerToMove: oppositePlayer(action.player),
          },
          previousTime: action.timestamp,
          time: {
            ...state.time,
            [action.player]: getNewTime(state, action.player, action.timestamp),
          },
        };
      } else {
        return state;
      }

    case actionTypes.PAUSE_CLOCK:
      if (state.clock.run === 'running') {
        const player = state.clock.playerToMove;
        return {
          ...state,
          clock: {
            ...state.clock,
            run: 'paused',
          },
          previousTime: action.timestamp,
          time: {
            ...state.time,
            [player]: getNewTime(state, player, action.timestamp),
          },
        };
      } else {
        return state;
      }

    case actionTypes.TICK:
      if (state.clock.run === 'running') {
        const player = state.clock.playerToMove;
        const newTime = getNewTime(state, player, action.timestamp);
        return {
          ...state,
          previousTime: action.timestamp,
          clock: (newTime <= 0) ? {
            ...state.clock,
            run: 'ended',
          } : {
            ...state.clock,
            run: 'running',
          },
          time: {
            ...state.time,
            [player]: newTime,
          },
        };
      } else {
        return state;
      }

    case actionTypes.RESET_CLOCK_PROMPT:
      if (state.clock.run === 'initial') {
        return state;
      } else if (state.clock.run === 'running') {
        const player = state.clock.playerToMove;
        return {
          ...state,
          view: 'resetDialog',
          clock: {
            ...state.clock,
            run: 'paused',
          },
          previousTime: action.timestamp,
          time: {
            ...state.time,
            [player]: getNewTime(state, player, action.timestamp),
          },
        };
      } else  {
        return {
          ...state,
          view: 'resetDialog',
        };
      }

    case actionTypes.RESET_CLOCK_CANCEL:
      return {
        ...state,
        view: 'clock',
      };

    case actionTypes.RESET_CLOCK_CONFIRM:
      return {
        ...state,
        view: 'clock',
        clock: { run: 'initial' },
        time: {
          player1: INITIAL_TIME,
          player2: INITIAL_TIME,
        },
      };

    default:
      return state;
  }
}
