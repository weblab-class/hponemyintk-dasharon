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
                  alt="A welcome image"
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
          <ReactAnnotate
                  allowEdits={false}
                  img_using="/public/images/WebsiteforFirstPage.jpg"
                  alt="An invitation to log in"
                  onTagSubmit={this.onTagSubmit}
                  annotationslst={[{
                    "geometry": {
                      "x": 11.616620778069107,
                      "y": 5.915959961772547,
                      "width": 30.482256173683062,
                      "height": 87.02532065791459,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "¿Entonces, Qué esperas?",
                      "textforBox": "So what are you waiting for?",
                      "nativeLanguageTag": "So what are you waiting for?",
                      "learningLanguageTag": "¿Entonces, Qué esperas?",
                      "id": 0.9813935506893599
                    }
                  },
                  {
                    "geometry": {
                      "x": 51.65301694648865,
                      "y": 7.726790402897239,
                      "width": 45.7233842605246,
                      "height": 85.97046828630351,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "¡Inicie sesión para comenzar el aprendizaje y la diversión!",
                      "textforBox": "Please log in to get the learning and fun started!",
                      "nativeLanguageTag": "Please log in to get the learning and fun started!",
                      "learningLanguageTag": "¡Inicie sesión para comenzar el aprendizaje y la diversión!",
                      "id": 0.5074685876815184
                    }
                  }
                ]}
                />

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
