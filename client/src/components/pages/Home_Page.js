import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";


class Home_Page extends Component {
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
        {/* Use username prop */}
        <p>Welcome {this.props.username}!</p>
        <p>You have logged in! Hooray! Welcome!</p>
      </>
    );
  }
}

export default Home_Page;
