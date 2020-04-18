import { REGISTER_SUCCESS, REGISTER_FAIL } from "../actions/types";
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
    case REGISTER_SUCCESS:
      //this will put token in local storage
      //ıf already there,we are setting it up top,
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
