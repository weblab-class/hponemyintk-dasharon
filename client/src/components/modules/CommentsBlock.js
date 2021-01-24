//This is from Catbook code-many thanks to Kye for indicating we can use this! (https://piazza.com/class/kic6jaqsarc70r?cid=1049)

import React, { Component } from "react";
import SingleComment from "./SingleComment.js";
import { NewComment } from "./NewComment.js";
import "./CommentHover.css"

/**
 * @typedef ContentObject
 * @property {string} _id of story/comment
 * @property {string} creator_name
 * @property {string} contentTranslated of the story/comment
 */

/**
 * Component that holds all the comments for a story
 *
 * Proptypes
 * @param {ContentObject[]} comments
 * @param {ContentObject} story
 */
class CommentsBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("PHOTO IS", this.props.photo);
    return (
        
      <div className="Card-commentSection">
        <div className="story-comments">
            <div className = "commentbox">
          {this.props.comments.map((comment) => (
            <SingleComment
              key={`SingleComment_${comment._id}`}
              _id={comment._id}
              creator_name={comment.creator_name}
              creator_id={comment.creator_id}
              contentTranslated={comment.contentTranslated}
              contentOriginal={comment.contentOriginal}
              showInNativeLanguage={this.props.showInNativeLanguage}
            />
          ))}
          </div>
          {this.props.viewingUserId && (
            <NewComment photoforComment={this.props.photo} addNewComment={this.props.addNewComment} />
          )}
        </div>
      </div>
    );
  }
}

export default CommentsBlock;
