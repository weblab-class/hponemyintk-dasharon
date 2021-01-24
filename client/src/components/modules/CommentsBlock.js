//This is from Catbook code-many thanks to Kye for indicating we can use this! (https://piazza.com/class/kic6jaqsarc70r?cid=1049)

import React, { Component } from "react";
import SingleComment from "./SingleComment.js";
import { NewComment } from "./NewComment.js";
import "./CommentHover.css"
import { get } from "../../utilities";
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
    this.state = {
      nativeLanguage: "", //what is the user's native language/language in which they want to learn?
      learningLanguage: "", //what language is the user learning?
    };
  }

    //get language preference user has currently set
    componentDidMount() {
      // remember -- api calls go here!, get call adapted from catbook
      //run get request to get first image of the user, will build up to getting images one by
      //one or all on one page
      //onyl make req if logged in
      if (this.props.viewingUserId) {
        this.languageInfoLoad();
      } else {
        console.log("SHOULD LOG OUT");
      }
    }
  
    //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
    componentDidUpdate(prevProps) {
      if (this.props.viewingUserId && prevProps.viewingUserId !== this.props.viewingUserId) {
        this.languageInfoLoad();
      } else {
        console.log("SHOULD LOG OUT");
      }
    }
  
    languageInfoLoad = () => {
      get("/api/singleUserFind", { checkUserId: this.props.viewingUserId }).then((userLanguageInfo) => {
        this.setState({
          nativeLanguage: userLanguageInfo.nativeLanguage,
          learningLanguage: userLanguageInfo.learningLanguage,
        });
        console.log("Loading language info");
        console.log("User native language", this.state.nativeLanguage);
        console.log("User learns", this.state.learningLanguage);
      });
    };

  render() {
    // console.log("PHOTO IS", this.props.photo);
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
          {/* Pass is props- photo infom comment function and user language */}
          {this.props.viewingUserId && (
            <NewComment photoforComment={this.props.photo} addNewComment={this.props.addNewComment} translateLanguage={this.state.learningLanguage}/>
          )}
        </div>
      </div>
    );
  }
}

export default CommentsBlock;
