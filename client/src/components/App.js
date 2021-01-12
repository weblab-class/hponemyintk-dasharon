import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import NavBar from "./modules/NavBar.js";
// import Test_Upload_Medium_Plus_React from "./modules/Test_Upload_Medium_Plus_React.js";
// import Test_Input_Tag_or_Caption from "./modules/Test_Input_Tag_or_Caption.js";
import ImgUpload_with_Mongoose from "./modules/ImgUpload_with_Mongoose.js";
import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

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
        this.setState({ userId: user._id });
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
        <NavBar />
        <br />
        <ImgUpload_with_Mongoose />
        {/* <Test_Upload_Medium_Plus_React />
        <Test_Input_Tag_or_Caption /> */}
          <Router>
            <Skeleton
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <NotFound default />
          </Router>
      </>
    );
  }
}

export default App;
