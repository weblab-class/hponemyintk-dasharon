import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get } from "../../utilities";
import UserInfo from "../modules/UserInfo.js";

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
        allUserList: [
          {name : "Try1"},
          {name : "Try2"}
        ],
    };
  }

  // remember -- api calls go here!, get call adapted from catbook
  //run get request to get first image of the user, will build up to getting images one by
  //one or all on one page
  //only make req if logged in
componentDidMount() {
  if (this.props.userId)
    {
      this.getUsers();
    }
}

//redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
componentDidUpdate(prevProps) {
  if (this.props.userId && prevProps.userId !== this.props.userId)
    {
      this.getUsers();
    }
}

getUsers = () => {
  get("/api/all_user_find").then((allUserInfo) => {
    this.setState({
        allUserList: allUserInfo,
    });
  });
}


  render() {

    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>;
    console.log(this.state.allUserList);
    return (
      <>
        {/* map syntax from chatbook */}
        <p>All users are</p>
        {this.state.allUserList.map((u, i) => (
          console.log(u),
        <>
         <UserInfo userNameInfo = {u.name} userId =  {this.props.userId} key = {i}/>
         <button>Add friend </button>
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
