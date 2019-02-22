/* eslint-disable no-loop-func */
import { Store } from 'redux';
import { players } from '../types';
import { createStore, playersTime$ } from './';
import { clockTimerSubscription } from './subscriptions';
import { TICK_INTERVAL } from '../constants';
import { toggleClock } from './actions';
import { oppositePlayer } from '../helpers';

jest.useFakeTimers();

describe('clockTimerSubscription', () => {
  let store: Store;
  let currentTime: number;
  let getCurrentTime = () => currentTime;

  const advanceTimeBy = (ms: number) => {
    currentTime += ms;
    jest.advanceTimersByTime(ms);
  }

  beforeEach(() => {
    store = createStore(false);
    currentTime = 0;
    clockTimerSubscription(store, getCurrentTime);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('given the clock is not running', () => {
    const elapsedTime = 5 * TICK_INTERVAL;
    let playersTime: any = {};

    describe(`when ${elapsedTime}ms elapse`, () => {
      beforeEach(() => {
        for (let player of players) {
          playersTime[player] = playersTime$(store.getState(), player);
        }
        advanceTimeBy(elapsedTime);
      });

      for (let player of players) {
        it(`${(player)}'s time is unchanged`, () => {
          expect(
            playersTime$(store.getState(), player)
          ).toEqual(playersTime[player]);
        });
      }
    });
  });


  describe('given the clock is running', () => {
    for (let player of players) {
      describe(`and ${player} is to move`, () => {
        const elapsedTime = 500;
        let playerToMoveTime: number, oppositePlayerTime: number;

        beforeEach(() => {
          store.dispatch(toggleClock(oppositePlayer(player), getCurrentTime));
          playerToMoveTime = playersTime$(store.getState(), player);
          oppositePlayerTime = playersTime$(store.getState(), oppositePlayer(player));
        });

        describe(`when ${elapsedTime}ms elapse`, () => {
          beforeEach(() => {
            advanceTimeBy(elapsedTime);
          });

          it(`${player}'s time is decreased correctly`, () => {
            expect(
              playersTime$(store.getState(), player)
            ).toEqual(playerToMoveTime - elapsedTime);
          });

          it(`${oppositePlayer(player)}'s time is unchanged`, () => {
            expect(
              playersTime$(store.getState(), oppositePlayer(player))
            ).toEqual(oppositePlayerTime);
          });

          describe('TODO and the clock is stopped', () => {
            describe('TODO and some more time elapses', () => {
              it.skip('TODO both players\' time is unchanged', () => {
                expect(true).toBe(false);
              });
            });
          });
        });
      });
    }
  });
});
