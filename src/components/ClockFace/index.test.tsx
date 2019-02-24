/* eslint-disable no-loop-func */
import React from 'react';
import { shallow } from 'enzyme';
import { ClockFace } from '.';
import ClockDial from './ClockDial';
import Controls from './Controls';

describe('<ClockFace />', () => {
  let clockFace: any;
  const getComponent = () => shallow(<ClockFace isBlurred={false} />);

  beforeEach(() => {
    clockFace = getComponent();
  });

  it('renders two <ClockDial />s', () => {
    expect(clockFace.find(ClockDial).length).toBe(2);
  });

  it('renders <Controls />', () => {
    expect(clockFace.exists(Controls)).toBe(true);
  });
});
