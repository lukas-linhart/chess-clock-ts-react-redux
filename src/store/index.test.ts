/* eslint-disable no-loop-func */
import { createStore, playersTime$ } from '.';
import { players } from '../types';
import { toggleClock } from './actions';
import { oppositePlayer } from '../helpers';
import { Store } from 'redux';

describe('store', () => {
  let store: Store;
  let currentTime: number;
  const timeToElapse = 500;
  const getCurrentTime = () => currentTime;
  const playersTime: any = {};
  const expectedTime: any = {};

  beforeEach(() => {
    store = createStore();
  });

  describe('given the clock is running', () => {

    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          for (let player of players) {
            playersTime[player] = playersTime$(store.getState(), player);
            expectedTime[player] = (player === playerToMove)
              ? (playersTime[player] - timeToElapse)
              : playersTime[player];
          }
        });

        describe(`and ${timeToElapse}ms elapsed`, () => {
          beforeEach(() => {
            currentTime += timeToElapse;
          });

          describe('when clock is toggled', () => {
            beforeEach(() => {
              store.dispatch(toggleClock(playerToMove, getCurrentTime));
            });

            it(`${playerToMove}'s time should be decreased by ${timeToElapse}ms`, () => {
              expect(
                playersTime$(store.getState(), playerToMove)
              ).toEqual(expectedTime[playerToMove]);
            });

            it(`${oppositePlayer(playerToMove)}'s time should remain unchanged`, () => {
              expect(
                playersTime$(store.getState(), oppositePlayer(playerToMove))
              ).toEqual(expectedTime[oppositePlayer(playerToMove)]);
            });
          });
        });
      });
    }
  });
});
