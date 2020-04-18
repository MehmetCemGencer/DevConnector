import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
} from "../actions/types";
//reason for doing this(creating initialState) is not to put
//all parameters to the function params place
const initialState = {
  //We store the token in local storage.
  //To access token in local storage with vanilla js
  token: localStorage.getItem("token"),
  //if valid this will be true and access protected routes
  isAuthenticated: null,
  //if user auth is true and get response from backend
  //we make sure loading is done and make it false.
  loading: true,
  // api/auth will get our user and it will filled with it.
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, //payload includes user
        //name email avatar but no password(in the back end we dont send pass)
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      //this will put token in local storage
      //ıf already there,we are setting it up top(initial state),
      //if no we put it in localstorage in here
      localStorage.setItem("token", payload.token);
      return {
        //state is immutable so put everything already in there
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        //even failed loading is done
        loading: false,
      };
    default:
      return state;
  }
}
