import React, { Component } from "react";

import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import "./LandingPage.css";
import ReactAnnotate from "../modules/ReactAnnotate.js";
import "../modules/NavBar.css";
import GoogleLogin from "react-google-login";


//TODO: REPLACE WITH YOUR OWN CLIENT_ID
//abcdef123 what is this? How do we get our own GOOGLE_CLIENT_ID? *** sdlf asdlf asldf test to check
//1/12/21 update from id generated
const GOOGLE_CLIENT_ID = "698664222392-6aqs0djjv4hrv2thb2kmjrqfmkavlqak.apps.googleusercontent.com";

class Skeleton extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
            <div className="u-flexColumn u-flex-alignCenter">
            <p className="welcometext">Welcome to WeWorld, where you can tag your way to learning a language!</p>
        <div className="postColumn paddedText" style={{ position: "relative" }}>
        <ReactAnnotate
                  allowEdits={false}
                  img_using="/public/images/WeWorldIntro3.png"
                  onTagSubmit={this.onTagSubmit}
                  annotationslst={[  {
                    "geometry": {
                      "x": 21.255638653320737,
                      "y": 29.256028473810346,
                      "width": 45.5732270503532,
                      "height": 60.38097431763215,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "¡Bienvenido a WeWorld! Pase el mouse sobre la etiqueta para ver cómo las fotos etiquetadas pueden enseñarle un idioma.",
                      "textforBox": "Welcome to WeWorld! Mouse over the tag to see how tagged photos can teach you a language.",
                      "nativeLanguageTag": "Welcome to WeWorld! Mouse over the tag to see how tagged photos can teach you a language.",
                      "learningLanguageTag": "¡Bienvenido a WeWorld! Pase el mouse sobre la etiqueta para ver cómo las fotos etiquetadas pueden enseñarle un idioma.",
                      "id": 0.9203446993622574
                    }
                  }]}
                />
                                <p>  WeWorld is a social language learning website. Users upload their photos and tag them in a
          foreign language they are trying to learn (currently Spanish is being used for this demo).
          Users can also see other users' photos to learn from their lives!</p>

          <div className="NavBar-linkContainerLogoutforInitial">
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          </div>
        </div>
        </div>
      </>
    );
  }
}

export default Skeleton;
