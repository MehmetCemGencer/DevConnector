import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    //set the token in the header if there is one
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data, //backend will send user which is in the data
      //this(dispatch) will send the payload to the action type in the reducer
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  //preparing the data to send
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      //data we get back in this case token
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login user
export const login = (email, password) => async (dispatch) => {
  //since this is 2 fields won't use object
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  //preparing the data to send
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      //data we get back in this case token
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};