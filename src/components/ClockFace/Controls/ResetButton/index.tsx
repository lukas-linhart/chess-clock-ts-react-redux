import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { clock$ } from '../../../../store';
import { State } from '../../../../store/state';
import { resetClockPrompt } from '../../../../store/actions';

type StateProps = {
  isEnabled: boolean,
};

type DispatchProps = {
  clickHandler: Function,
};

type Props = StateProps & DispatchProps;

export const ResetButton = ({ isEnabled, clickHandler }: Props)  => {
  const fillColor = isEnabled ? 'black' : '#606060'; // TODO: extract the constant
  return (
    <svg
      className="button resetButton"
      id="resetButton"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 558 558"
      onClick={() => clickHandler()}
    >
    <title>reset button</title>
    <circle cx="279" cy="279" r="279" fill="gray" />
    <path d="M631,390a171,171,0,1,0,40,110" transform="translate(-221 -221)" fill="none" stroke={fillColor} strokeMiterlimit="10" strokeWidth="30" />
    <polygon points="449.51 127.64 364.54 202.48 471.84 238.65 449.51 127.64" fill={fillColor} />
  </svg>
  );
}

const mapState = (state: State) => ({
  isEnabled: clock$(state) !== 'initial',
});

const mapDispatch = (dispatch: Dispatch) => ({
  clickHandler: () => dispatch(resetClockPrompt()),
});

export default connect(mapState, mapDispatch)(ResetButton);
