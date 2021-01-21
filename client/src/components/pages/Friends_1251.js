import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get } from "../../utilities";
// import UserInfo from "../modules/UserInfo.js";
import { Link } from "@reach/router";
import View_Flashcards from "../pages/View_Flashcards.js";

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      allUserList: [], //set initial user list to be empty
    };
  }

  // remember -- api calls go here!, get call adapted from catbook
  //run get request to get first image of the user, will build up to getting images one by
  //one or all on one page
  //only make req if logged in
  componentDidMount() {
    if (this.props.userId) {
      this.getUsers();
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.getUsers();
    }
  }

  getUsers = () => {
    get("/api/all_user_find").then((allUserInfo) => {
      this.setState({
        allUserList: allUserInfo,
      });
    });
  };

  //if requesting user's cards are being visualized, return my, otherwise return possessive of name
  getPossessive = (reqUser, visUser, visUserName) => {
    if (reqUser === visUser)
    {return "my" } else
    {return visUserName + "'s"};
  }

  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    console.log(this.state.allUserList);

    //get all users who uploaded, JavaScript lecture slide 32
    let allUploadedUserList = this.state.allUserList.filter(userCheck => userCheck.everUploaded == true);
    return (
      <div className="u-flexColumn u-flex-alignCenter">
        {/*Many thanks to Justin for Piazza link advice*/}
        {/*https://stackoverflow.com/questions/30115324/pass-props-in-link-react-router link for passing props */}
        {/* map syntax from chatbook br is html line break* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br*/}
        <h1 className="u-textCenter">
          Showing one photo from each user in the database! <br />
          (There are also links for showing all the photo from the users.)
        </h1>
        {allUploadedUserList.map((u, i) => (
          <>
            {console.log(u)}
            <View_Flashcards onlyOne={true} userId={u._id} key={i} />
            {/* <UserInfo userNameInfo={u.name} userId={u._id} key={i} /> */}
            {/* either print my or the user with a possessive */}
            <Link to={"/Flashcards/" + u._id}>I want to see all of {this.getPossessive(u._id, this.props.userId, u.name)} flashcards!</Link>
            <br />
          </>
        ))}
      </div>
    );
  }
}

export default Friends_1251;
