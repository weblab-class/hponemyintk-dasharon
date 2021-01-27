import React, { Component } from "react";
import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import ReactAnnotate from "../modules/ReactAnnotate.js";

class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="u-flex u-flex-justifyCenter">
      <div className="postColumn paddedText" style={{ position: "relative" }}>
        <p>Nosotros nos disculpamos: We apologize! We regret the page you are looking for cannot be found. Please try to navigate to another page!</p>
        </div>
        </div>
    );
  }
}

export default NotFound;
