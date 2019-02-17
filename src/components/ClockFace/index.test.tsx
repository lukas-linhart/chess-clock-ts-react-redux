import React from 'react';
import ClockFace from '.';
import ClockDial from './ClockDial';
import { mount } from 'enzyme';

describe('<ClockFace />', () => {
  it('renders two <ClockDial />s', () => {
    expect(
      mount(<ClockFace />).find(ClockDial).length
    ).toBe(2);
  });
});
