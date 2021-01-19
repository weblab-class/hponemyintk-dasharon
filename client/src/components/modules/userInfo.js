import React, { Component } from "react";

import "../../utilities.css";
import "../pages/Skeleton.css";
import View_Flashcards from "../pages/View_Flashcards.js";

//Gives information on a user on a user for flashcards this will give information

class UserInfo extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  //Give information on the user
  render() {
    return (
      <>
        {/* <p>{this.props.userNameInfo}</p> */}
        <View_Flashcards
          userId={this.props.userId}
          userName={this.props.userNameInfo}
          onlyOne={true}
        />
      </>
    );
  }
}

export default UserInfo;
