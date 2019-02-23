/* eslint-disable no-loop-func */
import React from 'react';
import ClockFace from '.';
import ClockDial from './ClockDial';
import { mount, ReactWrapper } from 'enzyme';
import { players } from '../../types';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { createStore, clock$, playerToMove$, playersTime$ } from '../../store';
import { toggleClock, tick } from '../../store/actions';
import { oppositePlayer } from '../../helpers';

describe('connected <ClockFace />', () => {
  let clockFace: ReactWrapper;
  let store: Store;

  const getMountedComponent = () => mount(
    <Provider store={store}>
      <ClockFace />
    </Provider>
  );

  const getDialElem = (selector: string) => clockFace.find(`#${selector}`);
  const getDialComponent = (selector: string) => getDialElem(selector).parent();

  beforeEach(() => {
    store = createStore();
    clockFace = getMountedComponent();
  });

  afterEach(() => {
    clockFace.unmount();
  });

  it('renders two <ClockDial />s', () => {
    expect(clockFace.find(ClockDial).length).toBe(2);
  });


  describe('Given the clock is freshly rendered', () => {
    for (let player of players) {
      it(`${player}'s clock dial should be inactive`, () => {
        const dial = getDialComponent(player);
        expect(dial.props().state).toEqual('inactive');
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
          expect(
            getDialComponent(player).props().state
          ).toEqual('inactive');
        });

        it(`${oppositePlayer(player)}'s dial is active`, () => {
          expect(
            getDialComponent(oppositePlayer(player)).props().state
          ).toEqual('active');
        });
      });
    }
  });

  describe('Given the clock is running', () => {
    let currentTime: number;
    const getCurrentTime = () => currentTime;

    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          clockFace = getMountedComponent();
        });

        describe('when time runs out', () => {
          beforeEach(() => {
            const timeToElapse = playersTime$(store.getState(), playerToMove) + 100;
            currentTime += timeToElapse;
            store.dispatch(tick(getCurrentTime));
            clockFace = getMountedComponent();
          });

          it(`${playerToMove}'s dial should be ended`, () => {
            expect(
              getDialComponent(playerToMove).props().state
            ).toEqual('ended');
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
                getDialComponent(playerToMove).props().state
              ).toEqual(isValidClick() ? 'inactive' : 'active');
            });

            it(`${oppositePlayer(playerToMove)}'s dial should ${isValidClick() ? 'become active' : 'remain inactive'}`, () => {
              expect(
                getDialComponent(oppositePlayer(playerToMove)).props().state
              ).toEqual(isValidClick() ? 'active' : 'inactive');
            });
          });
        }
      });
    }
  });

  describe('Given the clock is ended', () => {
    let currentTime: number;
    const getCurrentTime = () => currentTime;

    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          currentTime = 0;
          store.dispatch(toggleClock(oppositePlayer(playerToMove), getCurrentTime));
          const timeToElapse = playersTime$(store.getState(), playerToMove) + 100;
          currentTime += timeToElapse;
          store.dispatch(tick(getCurrentTime));
          clockFace = getMountedComponent();
        });

        for (let clickedPlayer of players) {
          describe(`when ${clickedPlayer}'s dial is clicked`, () => {
            it('clock should remain ended', () => {
              expect(clock$(store.getState())).toEqual('ended');
            });

            it(`${playerToMove}'s dial should remain ended`, () => {
              expect(
                getDialComponent(playerToMove).props().state
              ).toEqual('ended');
            });

            it(`${oppositePlayer(playerToMove)}'s dial should remain inactive`, () => {
              expect(
                getDialComponent(oppositePlayer(playerToMove)).props().state
              ).toEqual('inactive');
            });
          });
        }
      });
    }
  });
});
