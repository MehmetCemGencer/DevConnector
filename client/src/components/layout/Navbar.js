import React, { Fragment } from "react";
import { Link } from "react-router-dom";
//Connect to redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

//loading needed because want to make sure loading is done before putting the links
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <a onClick={logout} href='#!'>
          <i classname='fas fa-sign-out-alt'></i>
          {"  "}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <a href='#!'>Developers</a> {/*#! goes nowhere*/}
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired, //function
  auth: PropTypes.object.isRequired, //state
};

const mapStateToProps = (state) => ({
  auth: state.auth, //reducers/auth
});

export default connect(mapStateToProps, { logout })(Navbar);
