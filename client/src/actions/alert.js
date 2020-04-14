//Dispatch these.Call the case put in the reducer(reducers/alert.js)
import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

//Want to dispatch more than 1 action type from this function
export const setAlert = (msg, alertType) => (dispatch) => {
  //this is because thunk middleware (arrows)
  const id = uuidv4();
  //dispatch this will go to reducers/alert.js and resolve there
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });
};
