import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Snackbar from 'material-ui/Snackbar';

import { setErrorMessage } from '../actions';

const ErrorSnack = ({ errorMsg, handleClose }) => (
  <Snackbar
    open={errorMsg !== ''}
    message={errorMsg}
    onRequestClose={handleClose}
    action="close"
    onActionClick={handleClose}
  />
);

ErrorSnack.propTypes = {
  errorMsg: PropTypes.string,
  handleClose: PropTypes.func
};

// ------ static styles ------

// const staticStyles = {
//   overlay: {}
// };

// ------ redux container ------

const errorSelector = state => state.errorMsg;

const stateSelector = createSelector(
  errorSelector,
  errorMsg => ({
    errorMsg
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

const mapDispatchToProps = dispatch => ({
  handleClose: () => {
    dispatch(setErrorMessage(''));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((ErrorSnack));
