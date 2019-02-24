/* eslint-disable no-loop-func */
import { Store } from 'redux';
import { players } from '../types';
import { createStore, playersTime$ } from './';
import { clockTimerSubscription } from './subscriptions';
import { TICK_INTERVAL } from '../constants';
import { toggleClock, pauseClock } from './actions';
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
    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        const elapsedTime = 5 * TICK_INTERVAL;
        const playersTime: any = {};

        beforeEach(() => {
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          for (let player of players) {
            playersTime[player] = playersTime$(store.getState(), player);
          }
        });

        describe(`when ${elapsedTime}ms elapse`, () => {
          beforeEach(() => {
            advanceTimeBy(elapsedTime);
          });

          it(`${playerToMove}'s time is decreased correctly`, () => {
            expect(
              playersTime$(store.getState(), playerToMove)
            ).toEqual(playersTime[playerToMove] - elapsedTime);
          });

          it(`${oppositePlayer(playerToMove)}'s time is unchanged`, () => {
            expect(
              playersTime$(store.getState(), oppositePlayer(playerToMove))
            ).toEqual(playersTime[oppositePlayer(playerToMove)]);
          });

          describe('and the clock is paused', () => {
            beforeEach(() => {
              store.dispatch(pauseClock(getCurrentTime));
            });

            describe(`and another ${elapsedTime}ms elapse`, () => {
              beforeEach(() => {
                advanceTimeBy(elapsedTime);
              });

              for (let player of players) {
                it(`${player}'s time is unchanged`, () => {
                  const expectedTime = (player === playerToMove)
                    ? playersTime[player] - elapsedTime
                    : playersTime[player];
                  expect(
                    playersTime$(store.getState(), player)
                  ).toBe(expectedTime);
                });
              }
            });
          });
        });
      });
    }
  });
});
