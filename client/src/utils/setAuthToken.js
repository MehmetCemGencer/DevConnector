//not make a req with axios,just adding a global header
import axios from "axios";

const setAuthToken = (token) => {
  //check token in the local storage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
  //If have token,won't choose specific function.Send the token with the every request made,because need authentication.
};

export default setAuthToken;
