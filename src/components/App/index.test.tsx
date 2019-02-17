import React from 'react';
import App from '.';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<App />);
});
