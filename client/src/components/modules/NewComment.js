//This is from catbook, many thanks to Kye for indicating we can use this! (https://piazza.com/class/kic6jaqsarc70r?cid=1049)

import React, { Component } from "react";

import "./NewComment.css";
import { post } from "../../utilities";

/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */
class NewPostInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  // called whenever the user types in the new post input box
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  // called when the user hits "Submit" for a new post
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.value);
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="u-flex">
        <input
          type="text"
          placeholder={this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          className="NewPostInput-input"
        />
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} photoId to add comment to
 */
class NewComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      learningLanguage: "", //what language is the user learning?
    };
  }

  addComment = (value) => {
    // console.log(this.props.photoforComment);
    // // 1run translation
    const submitTime = Date.now(); //set submit time
    const submitTimePrintable = new Date(submitTime).toLocaleString([], {
      //this is as not easily sortable but is readable
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }); //record date, from https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i, https://stackoverflow.com/questions/17913681/how-do-i-use-tolocaletimestring-without-displaying-seconds
    post("/api/translation", {
      translationInput: value,

      userTranslationLanguage: this.props.translateLanguage,
    })
      .then((
        translatedString //2 post request with translation and original
      ) =>
        // console.log("translated", translatedString.output);
        // console.log("translated0", translatedString.output[0]);
        //const body = { parent: this.props.photoforComment._id, content: translatedString.output[0] };s

        post("/api/comment", {
          parent: this.props.photoforComment._id,
          contentTranslated: translatedString.output[0],
          contentOriginal: value,
          submit_stamp_raw: submitTime,
          submit_stamp: submitTimePrintable,
        })
      )
      .then((comment) => {
        //3 display
        // display this comment on the screen
        this.props.addNewComment(comment);

        // post("/api/comment", {
        //   parent: this.props.photoforComment._id,
        //   contentTranslated: "test", //translatedString.output[0],
        //   contentOriginal: value,
        //   submit_stamp_raw: submitTime,
        //   submit_stamp: submitTimePrintable
        //   }).then((comment) => { //3 display
        // // display this comment on the screen
        // this.props.addNewComment(comment);
      });
  };

  render() {
    return <NewPostInput defaultText="New comment" onSubmit={this.addComment} />;
  }
}

export { NewComment };
