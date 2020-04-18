import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
//to connect redux
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

//because there are certain props we dont pass just "props" ,pass the needed ones
const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //Destructring formData !!!!! use this
  const { email, password } = formData;
  //because of this destructring we can say value={name}

  function handleChange(event) {
    const { name, value } = event.target;
    return setFormData({ ...formData, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    login(email, password);
  }

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={handleChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

//Auth state has authentication if there is so look there(reducers/auth)
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

//
export default connect(mapStateToProps, { login })(Login);
