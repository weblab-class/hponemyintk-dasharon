/*
* From catbook-react code, many thanks to Web Lab team*
*/

import React, { Component } from "react";
import { Link } from "@reach/router";

import "./NavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock">WeWorld</div>
        <div className="NavBar-linkContainer u-inlineBlock">
          <Link to="/" className="NavBar-link">
            Home
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Flashcards
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Quizzes
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Friends
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Scavenger Hunts
          </Link>
          <Link to="/profile/" className="NavBar-link">
            Logout
          </Link>
        </div>
      </nav>
    );
  }
}

export default NavBar;
