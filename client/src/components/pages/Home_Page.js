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
    if (!this.props.userId) return <div>Goodbye! Thank you so much for using Weworld.</div>; //login protect
    return (
      <div className="u-flex u-flex-justifyCenter">
        <div className="postColumn">
          {/* Use username prop */}
          <p>Welcome {this.props.username}!</p>
          <p>You have logged in! Hooray! Welcome!</p>
          <img src="https://powerlanguage.net/wp-content/uploads/2019/09/welcome.jpg" />
        </div>
      </div>
    );
  }
}

export default Home_Page;
