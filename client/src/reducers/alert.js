import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

//Will be empty as always
const initialState = [];

//action object will contain actionType and payload that contains data
//sometimes data could be empty
export default function (state = initialState, action) {
  //type is need to evaluate and will be using switch
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      //this is immutable so we have to use spread operator
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); //this payload just id
    default:
      return state;
  }
}
