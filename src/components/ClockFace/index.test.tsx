import React from 'react';
import ClockFace from '.';
import ClockDial from './ClockDial';
import { mount, ReactWrapper } from 'enzyme';
import { players } from '../../constants';

describe('<ClockFace />', () => {
  let clockFace: ReactWrapper;

  const getMountedComponent = () => mount(<ClockFace />);
  const getDialElem = (selector: string) => clockFace.find(`#${selector}`);
  const getDialComponent = (selector: string) => getDialElem(selector).parent();

  beforeEach(() => {
    clockFace = getMountedComponent();
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
    }
  });
});
