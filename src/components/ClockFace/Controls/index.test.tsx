import React from 'react';
import Controls from '.';
import PauseButton from './PauseButton';
import ResetButton from './ResetButton';
import { shallow } from 'enzyme';

describe('<Controls />', () => {
  it('renders <PauseButton />', () => {
    const controls = shallow(<Controls />);
    expect(controls.exists(PauseButton)).toBe(true);
  });

  it('renders <ResetButton />', () => {
    const controls = shallow(<Controls />);
    expect(controls.exists(ResetButton)).toBe(true);
  });
});
