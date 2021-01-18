import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom"; //from https://stackoverflow.com/questions/45089386/what-is-the-best-way-to-redirect-a-page-using-react-router
import { Router, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
import Quiz from "./modules/Quiz.js";
import ImgUpload_1716_try_no_prototype from "./modules/ImgUpload_1716_try_no_prototype.js";
import Home_Page from "./pages/Home_Page.js";
import View_Flashcards from "./pages/View_Flashcards.js";
import Friends_1251 from "./pages/Friends_1251.js";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

import "../utilities.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      allUserList: [],
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id, username: user.name });
      }
    });
    if (this.props.userId && prevProps.userId !== this.props.userId) {
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

  //Many thanks to Kye for help with navigate
  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({ userId: user._id });
        post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => navigate("/Home_Page"));
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout").then(() => navigate("/Home_Page"));
  };

  render() {
    return (
      <>
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        <br />

        {/* Only show image upload if logged in */}
        {this.state.userId ? (
          <></>
        ) : (
          <p>
            Welcome to Weworld! You will learn and have fun!. *Please note currently all users can
            see everyone's content given this is an early testing version of the website. So please
            do not share any image or text you do not want shared publicly. Also your timestamp of
            use and name are recorded and associated with your image.*
          </p>
        )}

        <br />
        <Router>
          {/* don't see 2 pages at once https://stackoverflow.com/questions/45122800/react-router-switch-behavior */}
          {/* <Skeleton path="/" /> */}
          <Home_Page path="/Home_Page" username={this.state.username} userId={this.state.userId} />
          <ImgUpload_1716_try_no_prototype path="/Upload" userId={this.state.userId} />
          {/*from catbook to link to different user pages*/}
          {/*from catbook to link to different user pages, also used https://stackoverflow.com/questions/57058879/how-to-create-dynamic-routes-with-react-router-dom*/}
          {/* {this.state.allUserList.map((u,i) => 
            <Link to={"/Flashcards/" + u._id}/>)}
            <Route path="Flashcards/:id" component = {View_Flashcards}/> */}

          {/* {this.state.allUserList.map((u,i) => 
            <Link to={"/Flashcards/" + u._id} key = {i}/>)}
            {this.state.allUserList.map((u,i) => 
            <View_Flashcards path={"/Flashcards/" + u._id} username = {u.name} key = {i}/>)} */}
          {/*Thanks to Justin for Piazza post on this! */}

          <View_Flashcards path="/Flashcards/:userId" userName={this.state.username} />

          <Friends_1251 path="/Friends" userId={this.state.userId} />
          <Quiz path="/Quiz" />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
