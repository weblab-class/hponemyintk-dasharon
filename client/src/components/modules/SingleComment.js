//This is from catbook, many thanks to Kye for indicating we can use this! (https://piazza.com/class/kic6jaqsarc70r?cid=1049)

import React, { Component } from "react";
import { Link } from "@reach/router";
import "./CommentHover.css";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} contentTranslated of the comment
 */
class SingleComment extends Component {
  constructor(props) {
    super(props);
  }

  //text popup
  render() {
    return (
      <div className="Card-commentBody">
        <Link to={`/Flashcards/${this.props.creator_id}`} className="u-link">
          {this.props.creator_name}
        </Link>
        {/*user decides whether to show in native language*/}
        {this.props.showInNativeLanguage ? (
          <span className="tooltip">
            {" | " + this.props.contentOriginal}
            <span className="tooltiptext">{this.props.contentTranslated}</span>
          </span>
        ) : (
          <span className="tooltip">
            {" | " + this.props.contentTranslated}
            <span className="tooltiptext">{this.props.contentOriginal}</span>
          </span>
        )}
      </div>
    );
  }
}

export default SingleComment;
