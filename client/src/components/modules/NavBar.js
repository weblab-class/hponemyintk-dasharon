/*
* From catbook-react code, many thanks to Web Lab team*
*/

import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./NavBar.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
//abcdef123 what is this? How do we get our own GOOGLE_CLIENT_ID? *** sdlf asdlf asldf test to check
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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

          {this.props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
            className="NavBar-link NavBar-login"
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
            className="NavBar-link NavBar-login"
          />
        )}

        </div>
      </nav>
    );
  }
}

export default NavBar;
