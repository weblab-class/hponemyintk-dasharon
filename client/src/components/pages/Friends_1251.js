import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get } from "../../utilities";

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
        allUserList: null,
    };
  }

  componentDidMount() {
    //API call to get all database users
    // get("/api/all_user_find", {}).then((allUserInfo) => {
    //     this.setState({
    //         allUserList: allUserInfo,
    //     });
    // remember -- api calls go here!
    };

  //print info on each user
  allUserInfo (userInfo) {
    <p>{userInfo.name}</p>
  }

  render() {

    //Chatbook login protection
    if (!this.props.uid) return <div>Goodbye! Thank you for using Weworld.</div>;

    return (
      <>
        {/* Use username prop */}
        <p>All users are</p>
        {/* {for ()
        <p>{this.allUserInfo(this.allUserList)}</p>
  } */}
      </>
    );
  }
}

export default Friends_1251;
