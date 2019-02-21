/* eslint-disable no-loop-func */
import { reducer } from './reducers';
import { toggleClock } from './actions';
import { players } from '../types';
import { State } from './state';
import { previousTime$, playersTime$ } from '.';
import { oppositePlayer } from '../helpers';

const unknownAction = { type: 'UNKNOWN' };

describe('reducer', () => {
  let state: State;
  let newState: State;
  let currentTime: number;
  const getCurrentTime = () => currentTime;
  const timeToElapse = 500;

  beforeEach(() => {
      currentTime = 1000;
  });

  describe('given initial state', () => {
    beforeEach(() => {
      state = reducer(undefined, unknownAction);
    });

    for (let player of players) {
      describe(`when ${player} toggles the clock`, () => {
        beforeEach(() => {
          newState = reducer(state, toggleClock(player, getCurrentTime));
        });

        it('previous time is set to current time', () => {
          expect(previousTime$(newState)).toEqual(currentTime);
        });

        it(`${player}'s time is unchanged`, () => {
          expect(playersTime$(newState, player)).toEqual(playersTime$(state, player));
        });
      });
    }
  });

  describe('given the clock is running', () => {
    for (let player of players) {
      describe(`and ${player} is to move`, () => {
        beforeEach(() => {
          state = reducer(state, toggleClock(player, getCurrentTime));
        });

        describe(`and ${oppositePlayer(player)} attempts to toggle the clock after ${timeToElapse}`, () => {
          beforeEach(() => {
            currentTime += timeToElapse;
            newState = reducer(state, toggleClock(player, getCurrentTime));
          });

          it('state should remain unchanged', () => {
            expect(newState).toEqual(state);
          });
        });
      });
    }
  });
});
