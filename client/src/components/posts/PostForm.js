import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  /*Because this is single string don't have to use formData object containing
    several input fields.This is only one input field and it is comment.*/
  const [text, setText] = useState("");

  return (
    <div>
      <div class='post-form'>
        <div class='bg-primary p'>
          <h3>Say Something...</h3>
        </div>
        <form
          class='form my-1'
          onSubmit={(e) => {
            e.preventDefault();
            addPost({ text }); //text is the "formData" param in the addPost function in actions.
            setText("");
          }}
        >
          <textarea
            name='text'
            cols='30'
            rows='5'
            placeholder='Create a post'
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
          <input type='submit' class='btn btn-dark my-1' value='Submit' />
        </form>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
//Won't bring any state from redux
