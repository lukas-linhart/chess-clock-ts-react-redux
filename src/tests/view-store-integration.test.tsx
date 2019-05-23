/* eslint-disable no-loop-func */
import React from 'react';
import View from '../view/View';
import { PauseButton } from '../view/ClockFace/Controls/PauseButton';
import { ResetButton } from '../view/ClockFace/Controls/ResetButton';
import { mount, ReactWrapper } from 'enzyme';
import { players, Player } from '../types';
import { Store } from 'redux';
import { createStore, clock$, playerToMove$, playersTime$ } from '../store';
import { toggleClock, tick, pauseClock, resetClockPrompt } from '../store/actions';
import { oppositePlayer } from '../helpers';

const RESET_DIALOG_SELECTOR = '#resetDialog';

describe('<View />', () => {
  let store: Store;
  let app: ReactWrapper;
  let currentTime: number;

  const getApp = () => mount(<View store={store} />);
  const getDialElem = (selector: Player) => app.find(`#${selector}`);
  const getDialComponent = (selector: Player) => getDialElem(selector).parent();
  const getDialState = (selector: Player) => getDialComponent(selector).props().state;
  const getPauseButton = () => app.find(PauseButton);
  const getResetButton = () => app.find(ResetButton);
  const getCurrentTime = () => currentTime;
  const getResetClockCancelButton = () => app.find('#cancelResetButton');
  const getResetClockConfirmButton = () => app.find('#confirmResetButton');

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

    it('reset button should be disabled', () => {
      expect(
        getResetButton().props().isEnabled
      ).toBe(false);
    });

    it('reset dialog should not be rendered', () => {
      expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(false);
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

        it('reset button should be enabled', () => {
          expect(
            getResetButton().props().isEnabled
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

        describe('when reset button is clicked', () => {
          beforeEach(() => {
            getResetButton().simulate('click');
          });

          it('clock should be paused', () => {
            expect(clock$(store.getState())).toEqual('paused');
          });

          it('reset dialog should be rendered', () => {
            expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(true);
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
        let playersInitialTime: any = {};
        beforeEach(() => {
          for (let player of players) {
            playersInitialTime[player] = playersTime$(store.getState(), player);
          }
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          currentTime += 100;
          store.dispatch(pauseClock(getCurrentTime));
          app = getApp();
        });

        it('pause button should be disabled', () => {
          expect(
            getPauseButton().props().isEnabled
          ).toBe(false);
        });

        it('reset button should be enabled', () => {
          expect(
            getResetButton().props().isEnabled
          ).toBe(true);
        });

        describe('when reset button is clicked', () => {
          beforeEach(() => {
            getResetButton().simulate('click');
          });

          it('reset dialog should be rendered', () => {
            expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(true);
          });
        });

        describe('and reset dialog is displayed', () => {
          beforeEach(() => {
            store.dispatch(resetClockPrompt());
            app = getApp();
          });

          describe('when cancel button is clicked', () => {
            beforeEach(() => {
              getResetClockCancelButton().simulate('click');
            });

            it('reset dialog is hidden', () => {
              expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(false);
            });

            it('clock remains paused', () => {
              expect(clock$(store.getState())).toEqual('paused');
            });
          });

          describe('when confirm button is clicked', () => {
            beforeEach(() => {
              getResetClockConfirmButton().simulate('click');
            });

            it('reset dialog is hidden', () => {
              expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(false);
            });

            it('clock should get reset to initial state', () => {
              expect(clock$(store.getState())).toEqual('initial');
            });

            for (let player of players) {
              it(`${player}'s time should be reset to initial`, () => {
                expect(
                  playersTime$(store.getState(), player)
                ).toEqual(playersInitialTime[player]);
              });

              it(`${player}'s dial should be inactive`, () => {
                expect(getDialState(player)).toEqual('inactive');
              });
            }
          });
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

  describe('Given the clock has run out of time', () => {
    for (let playerToMove of players) {
      describe(`and ${playerToMove} was to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          const timeToElapse = playersTime$(store.getState(), playerToMove) + 100;
          currentTime += timeToElapse;
          store.dispatch(tick(getCurrentTime));
          app = getApp();
        });

        it('pause button should be disabled', () => {
          expect(
            getPauseButton().props().isEnabled
          ).toBe(false);
        });

        it('reset button should be enabled', () => {
          expect(
            getResetButton().props().isEnabled
          ).toBe(true);
        });

        describe('when reset button is clicked', () => {
          beforeEach(() => {
            getResetButton().simulate('click');
          });

          it('reset dialog should be rendered', () => {
            expect(app.exists(RESET_DIALOG_SELECTOR)).toBe(true);
          });
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
