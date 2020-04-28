import { GET_POSTS, POST_ERROR } from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}, //work like profile error works
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload, //came from action file
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload, //came from actions/post file
        loading: false,
      };
    default:
      return state;
  }
}
