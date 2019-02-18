import React from 'react';
import App from '.';
import ClockFace from '../ClockFace';
import { mount } from 'enzyme';
import { createStore } from '../../store';
import { Store } from 'redux';

describe('<App />', () => {
  let store: Store;
  const getMountedComponent = () => mount(<App store={store} />);

  beforeEach(() => {
    store = createStore();
  });

  it('renders without crashing', () => {
    getMountedComponent();
  });

  it('renders <ClockFace />', () => {
    expect(
      getMountedComponent().find(ClockFace).exists()
    ).toBe(true);
  });
});
