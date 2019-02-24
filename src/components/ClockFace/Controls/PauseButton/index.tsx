import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { clock$ } from '../../../../store';
import { State } from '../../../../store/state';
import { pauseClock } from '../../../../store/actions';

type StateProps = {
  isEnabled: boolean,
};

type DispatchProps = {
  clickHandler: Function,
};

type Props = StateProps & DispatchProps;

export const PauseButton = ({ isEnabled, clickHandler }: Props)  => {
  const fillColor = isEnabled ? 'black' : '#606060'; // TODO: extract the constant
  return (
    <svg
      className="button pauseButton"
      id="pauseButton"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 558 558"
      onClick={() => clickHandler()}
    >
      <title>pause button</title>
      <circle cx="279" cy="279" r="279" fill="gray" />
      <rect x="175.5" y="137.5" width="79" height="283" fill={fillColor} />
      <rect x="303.5" y="137.5" width="79" height="283" fill={fillColor} />
    </svg>
  );
}

const mapState = (state: State) => ({
  isEnabled: clock$(state) === 'running',
});

const mapDispatch = (dispatch: Dispatch) => ({
  clickHandler: () => dispatch(pauseClock()),
});

export default connect(mapState, mapDispatch)(PauseButton);
