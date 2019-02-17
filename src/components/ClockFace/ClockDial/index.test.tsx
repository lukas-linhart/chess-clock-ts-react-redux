import React from 'react';
import ClockDial from '.';
import { mount } from 'enzyme';
import { players } from '../../../constants';

describe('<ClockDial />', () => {
  it('uses "state" prop within its className', () => {
    const state = 'inactive';
    const dial = mount(<ClockDial player={players[0]} state={state} />);
    expect(
      dial.getDOMNode().classList.contains(state)
    ).toBe(true);
  });
});

