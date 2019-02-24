import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { view$ } from '../../store';
import { State } from '../../store/state';
import { resetClockCancel, resetClockConfirm } from '../../store/actions';

type StateProps = {
  isVisible: boolean,
};

type DispatchProps = {
  handleCancelClick: Function,
  handleConfirmClick: Function,
};

type Props = StateProps & DispatchProps;

const ResetDialog = ({ isVisible, handleCancelClick, handleConfirmClick }: Props) => (
  (isVisible || null) && (
    <div id="resetDialog" className="dialogOverlay hidden">
      <div className="dialogWindow">
        <div className="dialogCell dialogSection">
          Do you want to reset the clock ?
        </div>
        <div className="dialogButtons">
          <div id="cancelResetButton" className="dialogCell dialogButton" onClick={() => handleCancelClick()}>No</div>
          <div id="confirmResetButton" className="dialogCell dialogButton" onClick={() => handleConfirmClick()}>Yes</div>
        </div>
      </div>
    </div>
  )
);

const mapState = (state: State) => ({
  isVisible: view$(state) === 'resetDialog',
});

const mapDispatch = (dispatch: Dispatch) => ({
  handleCancelClick: () => dispatch(resetClockCancel()),
  handleConfirmClick: () => dispatch(resetClockConfirm()),
});

export default connect(mapState, mapDispatch)(ResetDialog);
