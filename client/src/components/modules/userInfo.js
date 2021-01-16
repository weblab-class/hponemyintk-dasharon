import React, { Component } from "react";

import "../../utilities.css";
import "../pages/Skeleton.css";

//Gives info on a user

class userInfo extends Component {
    constructor(props) {
      super(props);
      // Initialize Default State
      this.state = {
      };
    }

    //Give information on the user
    render() {
        return (
            <>
            <p>TEST ME</p>
            <p>{this.props.userNameInfo}</p>
            </>
        );
    }
}

export default userInfo;