import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get } from "../../utilities";
import userInfo from "../modules/userInfo.js";

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
        allUserList: [
          {"name" : "Try1"},
          {"name" : "Try2"}
        ],
    };
  }

  componentDidMount() {
    //API call to get all database users
    // get("/api/all_user_find", {}).then((allUserInfo) => {
    //     this.setState({
    //         allUserList: allUserInfo,
    //     });
    //remember -- api calls go here!
  };

  //print info on each user
  // allUserInfo (userInfo) {
  //   <p>{userInfo.name}</p>
  // };

  render() {

    //Chatbook login protection
    if (!this.props.uid) return <div>Goodbye! Thank you for using Weworld.</div>;
    console.log(this.state.allUserList);
    return (
      <>
        <p>All users are</p>
        {this.state.allUserList.map((u, i) => (
          console.log(u),
          <>
         <userInfo userNameInfo = {u.name} />
         <button>Add friend</button>
         {/* ref: https://www.teachucomp.com/add-a-line-break-in-html-tutorial/ */}
         <br/>
         </>
        ))
        }
      </>
    );
  }
}

export default Friends_1251;
