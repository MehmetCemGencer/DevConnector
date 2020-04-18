import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types"; //impt is shortcut

const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  //Destructring formData !!!!! use this
  const { name, email, password, password2 } = formData;
  //because of this destructring we can say value={name}

  function handleChange(event) {
    const { name, value } = event.target;
    return setFormData({ ...formData, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== password2) {
      //this is for now change it later
      setAlert("Passwords do not match", "danger", 3000);
      //This will send a msg to out actions/alert and alertType
      //danger is for css to determine alert color
    } else {
      register({ name, email, password }); //destructure it in formdata
    }
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={handleChange}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired, //ptfr is shortcut
  register: PropTypes.func.isRequired,
};
//When use connect need to export it.Every component be in "()"
/* When import action pass it in to connect.connect takes 2 things ,
first state that you want to map(lets say wanna get state from alert or profile 
  put that in),
second OBJECT(use "{}") with any actions you want to use.
We don't need anything right now so we put null.*/
export default connect(null, { setAlert, register })(Register);
//{setAlert} allow us to access that function in props(props.setAlert)
//instead of using as a props destructure it up top
//pass it in Register()
