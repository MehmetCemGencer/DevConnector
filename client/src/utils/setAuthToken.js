//not make a req with axios,just adding a global header
import axios from "axios";

const setAuthToken = (token) => {
  //check token in the local storage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
  //with this function don't choose specific request , send it with every request
};

export default setAuthToken;
