import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import { setViewMode } from '../actions';

const ViewToggle = ({ classes, toggleViewMode }) => (
  <div className={classes.outer}>
    <RadioButtonGroup
      name="view"
      defaultSelected="geo"
      onChange={toggleViewMode}
    >
      <RadioButton
        value="geo"
        label="Map"
        style={{ marginBottom: 5 }}
        iconStyle={{ marginRight: 8 }}
      />
      <RadioButton
        value="grid"
        label="Geo Grid"
        style={{ marginBottom: 5 }}
        iconStyle={{ marginRight: 8 }}
      />
    </RadioButtonGroup>
  </div>
);

// <RadioButton
//   value="clusterGrid"
//   label="Cluster Grid"
//   iconStyle={{ marginRight: 8 }}
// />

ViewToggle.propTypes = {
  classes: PropTypes.object,
  toggleViewMode: PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  outer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: 200
  }
};

// ------ redux container ------

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  toggleViewMode: (e, val) => {
    dispatch(setViewMode(val));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(ViewToggle));
