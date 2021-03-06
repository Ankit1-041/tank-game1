import {withRouter} from 'react-router-dom';
import FullRow from "../components/FullRow.js";
import React from "react";
import {connect} from 'react-redux';
import {clearError} from '../actions/coreAction.js';
import PropTypes from 'prop-types';

export class ErrorPanel extends React.Component {

  render() {
    let errors = Object.keys(this.props.errors)
      .filter((key) => this.props.errors[key])
      .map((key, index) => (
        <div key={index} className="card text-white bg-danger error-box">
          <div className="card-header">
            <i className="fas fa-exclamation-triangle"></i> Error
            <button type="button" className="btn-close btn-close-white float-end close" aria-label="Close" onClick={() => this.props.clearError(key)}></button>
          </div>
          <div className="card-body">
            <p className="card-text">{this.props.errors[key]}</p>
          </div>
        </div>
      ));

    return <FullRow>
            {errors}
          </FullRow>;
  }
}

ErrorPanel.defaultProps = {
  errors: [],
  clearError: () => {}
};

ErrorPanel.propTypes = {
  clearError: PropTypes.func
};

const mapStateToProps = (state) => ({
  errors: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  clearError: (type) => {
    dispatch(clearError(type));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ErrorPanel));
