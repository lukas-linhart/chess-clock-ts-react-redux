import React from 'react';
import App from '.';
import ClockFace from '../ClockFace';
import { mount } from 'enzyme';

describe('<App />', () => {
  it('renders without crashing', () => {
    mount(<App />);
  });

  it('renders <ClockFace />', () => {
    expect(
      mount(<App />).find(ClockFace).exists()
    ).toBe(true);
  });
});
