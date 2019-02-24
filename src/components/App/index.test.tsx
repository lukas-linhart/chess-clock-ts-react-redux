/* eslint-disable no-loop-func */
import React from 'react';
import App from '.';
import { PauseButton } from '../ClockFace/Controls/PauseButton';
import { mount, ReactWrapper } from 'enzyme';
import { players, Player } from '../../types';
import { Store } from 'redux';
import { createStore, clock$, playerToMove$, playersTime$ } from '../../store';
import { toggleClock, tick, pauseClock } from '../../store/actions';
import { oppositePlayer } from '../../helpers';

describe('<App />', () => {
  let store: Store;
  let app: ReactWrapper;
  let currentTime: number;

  const getApp = () => mount(<App store={store} />);
  const getDialElem = (selector: Player) => app.find(`#${selector}`);
  const getDialComponent = (selector: Player) => getDialElem(selector).parent();
  const getDialState = (selector: Player) => getDialComponent(selector).props().state;
  const getPauseButton = () => app.find(PauseButton);
  const getCurrentTime = () => currentTime;

  beforeEach(() => {
    store = createStore();
    app = getApp();
  });

  afterEach(() => {
    app.unmount();
  });

  describe('Given the app is freshly rendered', () => {
    it('clock should be in initial state', () => {
      expect(clock$(store.getState())).toEqual('initial');
    });

    it('pause button should be disabled', () => {
      expect(
        getPauseButton().props().isEnabled
      ).toBe(false);
    });

    for (let player of players) {
      it(`${player}'s clock dial should be inactive`, () => {
        expect(getDialState(player)).toEqual('inactive');
      });

      describe(`when ${player}'s dial is clicked`, () => {
        beforeEach(() => {
          getDialElem(player).simulate('click');
        });

        it('clock should be running', () => {
          expect(clock$(store.getState())).toEqual('running');
        });

        it(`${oppositePlayer(player)} is to move`, () => {
          expect(playerToMove$(store.getState())).toEqual(oppositePlayer(player));
        });

        it(`${player}'s dial is inactive`, () => {
          expect(getDialState(player)).toEqual('inactive');
        });

        it(`${oppositePlayer(player)}'s dial is active`, () => {
          expect(
            getDialState(oppositePlayer(player))
          ).toEqual('active');
        });
      });
    }
  });

  describe('Given the clock is running', () => {
    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          app = getApp();
        });

        it('pause button should be enabled', () => {
          expect(
            getPauseButton().props().isEnabled
          ).toBe(true);
        });

        describe('when time runs out', () => {
          beforeEach(() => {
            const timeToElapse = playersTime$(store.getState(), playerToMove) + 100;
            currentTime += timeToElapse;
            store.dispatch(tick(getCurrentTime));
            app = getApp();
          });

          it(`${playerToMove}'s dial should be ended`, () => {
            expect(getDialState(playerToMove)).toEqual('ended');
          });
        });

        describe('when pause button is clicked', () => {
          beforeEach(() => {
            getPauseButton().simulate('click');
          });

          it('clock should be paused', () => {
            expect(clock$(store.getState())).toEqual('paused');
          });

          it('pause button should be disabled', () => {
            expect(
              getPauseButton().props().isEnabled
            ).toBe(false);
          });

          it(`${playerToMove}'s dial should be paused`, () => {
            expect(getDialState(playerToMove)).toEqual('paused');
          });

          it(`${oppositePlayer(playerToMove)}'s dial should remain inactive`, () => {
            expect(
              getDialState(oppositePlayer(playerToMove))
            ).toEqual('inactive');
          });
        });

        for (let clickedPlayer of players) {
          describe(`when ${clickedPlayer}'s dial is clicked`, () => {
            const isValidClick = () => playerToMove === clickedPlayer;

            beforeEach(() => {
              getDialElem(clickedPlayer).simulate('click');
            });

            it('clock should remain running', () => {
              expect(clock$(store.getState())).toEqual('running');
            });

            it(`${playerToMove}'s dial should ${isValidClick() ? 'become inactive' : 'remain active'}`, () => {
              expect(
                getDialState(playerToMove)
              ).toEqual(isValidClick() ? 'inactive' : 'active');
            });

            it(`${oppositePlayer(playerToMove)}'s dial should ${isValidClick() ? 'become active' : 'remain inactive'}`, () => {
              expect(
                getDialState(oppositePlayer(playerToMove))
              ).toEqual(isValidClick() ? 'active' : 'inactive');
            });
          });
        }
      });
    }
  });

  describe('Given the clock is paused', () => {
    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          store.dispatch(toggleClock(oppositePlayer(playerToMove)));
          store.dispatch(pauseClock());
          app = getApp();
        });

        for (let clickedPlayer of players) {
          describe(`when ${clickedPlayer}'s dial is clicked`, () => {
            const isValidClick = () => playerToMove !== clickedPlayer;

            beforeEach(() => {
              getDialElem(clickedPlayer).simulate('click');
            });

            it(`${playerToMove}'s dial should ${isValidClick() ? 'become active' : 'remain paused'}`, () => {
              expect(
                getDialState(playerToMove)
              ).toEqual(isValidClick() ? 'active' : 'paused');
            });

            it(`${oppositePlayer(playerToMove)}'s dial should remain inactive`, () => {
              expect(
                getDialState(oppositePlayer(playerToMove))
              ).toEqual('inactive');
            });
          });
        }
      });
    }
  });

  describe('Given the clock is ended', () => {
    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          const timeToElapse = playersTime$(store.getState(), playerToMove) + 100;
          currentTime += timeToElapse;
          store.dispatch(tick(getCurrentTime));
          app = getApp();
        });

        for (let clickedPlayer of players) {
          describe(`when ${clickedPlayer}'s dial is clicked`, () => {
            beforeEach(() => {
              getDialElem(clickedPlayer).simulate('click');
            });

            it('clock should remain ended', () => {
              expect(clock$(store.getState())).toEqual('ended');
            });

            it(`${playerToMove}'s dial should remain ended`, () => {
              expect(getDialState(playerToMove)).toEqual('ended');
            });

            it(`${oppositePlayer(playerToMove)}'s dial should remain inactive`, () => {
              expect(
                getDialState(oppositePlayer(playerToMove))
              ).toEqual('inactive');
            });
          });
        }
      });
    }
  });
});
