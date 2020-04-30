import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
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
    case GET_POST:
      return {
        ...state,
        post: payload, //it is just sending single post
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts], //If put payload after state.posts show after old post not the top
        //All the post that is already in there and new post which is in the payload
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
    case ADD_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: payload, //payload is just comments,backend will return comments array,as i type in actions/post.js
        } /*This is going to be in the single post page
        so manipulate only post part of it */,
        loading: false,
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            (comment) => comment._id !== payload
          ),
        },
        loading: false,
      };
    default:
      return state;
  }
}
