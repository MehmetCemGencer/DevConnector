import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
} from "../actions/types";

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
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(
          (post) => post._id !== payload /*Payload is just id*/
        ),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload, //came from actions/post file
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(
          (post) =>
            post._id === payload.id ? { ...post, likes: payload.likes } : post
          /*Payload comes in is id and likes,from both of the actions. */
        ),
        loading: false,
      };
    default:
      return state;
  }
}
