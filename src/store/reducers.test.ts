/* eslint-disable no-loop-func */
import { reducer } from './reducers';
import { toggleClock, tick } from './actions';
import { players } from '../types';
import { State } from './state';
import { previousTime$, playersTime$, clock$ } from '.';
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

    describe(`and clock ticks after ${timeToElapse}`, () => {
      beforeEach(() => {
        currentTime += timeToElapse;
        newState = reducer(state, tick(getCurrentTime));
      });

      it('state should remain unchanged', () => {
        expect(newState).toEqual(state);
      });
    });
  });

  describe('given the clock is running', () => {
    for (let player of players) {
      describe(`and ${player} is to move`, () => {
        let playersTime: number;
        let oppositePlayersTime: number;

        beforeEach(() => {
          state = reducer(state, toggleClock(oppositePlayer(player), getCurrentTime));
          playersTime = playersTime$(state, player);
          oppositePlayersTime = playersTime$(state, oppositePlayer(player));
        });

        describe(`and ${oppositePlayer(player)} attempts to toggle the clock after ${timeToElapse}ms`, () => {
          beforeEach(() => {
            currentTime += timeToElapse;
            newState = reducer(state, toggleClock(oppositePlayer(player), getCurrentTime));
          });

          it('state should remain unchanged', () => {
            expect(newState).toEqual(state);
          });
        });

        describe(`and clock ticks after ${timeToElapse}ms`, () => {
          beforeEach(() => {
            currentTime += timeToElapse;
            newState = reducer(state, tick(getCurrentTime));
          });

          it(`${player}'s time should be decreased to ${playersTime - timeToElapse}ms`, () => {
            expect(
              playersTime$(newState, player)
            ).toEqual(playersTime - timeToElapse);
          });

          it(`${oppositePlayer(player)}'s time should remain unchanged`, () => {
            expect(
              playersTime$(newState, oppositePlayer(player))
            ).toEqual(oppositePlayersTime);
          });

          it('previous time is set to current time', () => {
            expect(previousTime$(newState)).toEqual(currentTime);
          });
        });

        describe(`and clock ticks after longer than ${player}'s remaining time`, () => {
          beforeEach(() => {
            currentTime += (playersTime + timeToElapse);
            newState = reducer(state, tick(getCurrentTime));
          });

          it('clock state should be ended', () => {
            expect(clock$(newState)).toEqual('ended');
          });

          it(`${player}'s time should be non-positive`, () => {
            expect(playersTime$(newState, player) <= 0).toBe(true);
          });
        });
      });
    }
  });
});
