import React, { Component } from "react";

import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import "./LandingPage.css";
import ReactAnnotate from "../modules/ReactAnnotate.js";

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
            <div className="u-flex u-flex-justifyCenter">
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
        </div>
        </div>
      </>
    );
  }
}

export default Skeleton;
