/* eslint-disable no-loop-func */
import React from 'react';
import ClockFace from '.';
import ClockDial from './ClockDial';
import { mount, ReactWrapper } from 'enzyme';
import { players } from '../../types';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { createStore, clock$, playerToMove$ } from '../../store';
import { toggleClock } from '../../store/actions';
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
    for (let playerToMove of players) {
      describe(`and ${playerToMove} is to move`, () => {
        beforeEach(() => {
          store.dispatch(toggleClock(oppositePlayer(playerToMove)));
          clockFace = getMountedComponent();
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
});
