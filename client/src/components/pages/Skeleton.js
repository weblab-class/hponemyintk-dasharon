import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";


class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default Skeleton;
