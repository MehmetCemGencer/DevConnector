import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
/*Anytime you want interact a component with redux  calling an action
or getting the state, you want to use connect.
*/
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

//defining incoming props type
Alert.propTypes = {
  alerts: PropTypes.array.isRequired, //ptar is shortcut
};

//Actually mapping the redux state to a prop in this component to access it.
//In this case array of alert
const mapStateToProps = (state) => ({
  alerts: state.alert, //root reducer(reducers/index.js )
});
//Don't have any action to call,if there was it would go second
export default connect(mapStateToProps)(Alert);
//want to get alert state
