import React, { Component } from "react";
import  { Redirect } from 'react-router-dom' //from https://stackoverflow.com/questions/45089386/what-is-the-best-way-to-redirect-a-page-using-react-router
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
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
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id, username: user.name });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId} />
        <br />
         
        {/* Only show image upload if logged in */}
        {this.state.userId ? (
        <>
        
        </>) : 
          (<p>Welcome to Weworld! You will learn and have fun!. *Please note currently all users can see everyone's content given this is an early testing version of the website. So please do not share any image or text you do not want shared publicly. Also your timestamp of use and name are recorded and associated with your image.*</p>)}

        <br />
          <Router>
            <Skeleton
              path="/"
            />
            <Home_Page
              path="/Home_Page" username = {this.state.username}
            />
            <ImgUpload_1716_try_no_prototype path = "/Upload" uid =  {this.state.userId}/>
            {/*from catbook to link to different user pages*/}
            <View_Flashcards path = "/Flashcards/:userId" userId =  {this.state.userId} userName = {this.state.username}/>
            <Friends_1251 path = "/Friends" userId =  {this.state.userId}/>
            <NotFound default />
          </Router>
      </>
    );
  }
}

export default App;
