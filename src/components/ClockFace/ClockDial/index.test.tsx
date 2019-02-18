import React from 'react';
import { ClockDial, DialState } from '.';
import { mount } from 'enzyme';
import { players } from '../../../types';
import { formattedTime } from '../../../helpers';

describe('<ClockDial />', () => {
  let dial;
  let state: DialState;
  let time = 0;

  const getMountedComponent = () => mount(
    <ClockDial
      player={players[0]}
      state={state}
      clickHandler={jest.fn()}
      time={time}
    />
  );

  it('uses "state" prop within its className', () => {
    state = 'inactive';
    dial = getMountedComponent();

    expect(
      dial.getDOMNode().classList.contains(state)
    ).toBe(true);
  });

  it('displays formatted time', () => {
    time = 1234;
    dial = getMountedComponent();

    expect(
      dial.getDOMNode().textContent
    ).toEqual(
      formattedTime(time)
    );
  });
});

