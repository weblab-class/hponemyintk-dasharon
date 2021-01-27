import React, { Component } from "react";
import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import ReactAnnotate from "../modules/ReactAnnotate.js";

class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="u-flex u-flex-justifyCenter">
      <div className="postColumn paddedText" style={{ position: "relative" }}>
      <ReactAnnotate
                  allowEdits={false}
                  img_using="/public/images/Grumpy1a.png"
                  alt="Image of website team regretting that the page you are looking for cannot be found"
                  onTagSubmit={this.onTagSubmit}
                  annotationslst={[{
                    "geometry": {
                      "x": 2.978875721668669,
                      "y": 5.996514368249209,
                      "width": 41.53809757193652,
                      "height": 83.73309962698151,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "Lamentamos que no se pueda encontrar la página que está buscando.",
                      "textforBox": "We are sorry that the page you are looking for cannot be found.",
                      "nativeLanguageTag": "We are sorry that the page you are looking for cannot be found.",
                      "learningLanguageTag": "Lamentamos que no se pueda encontrar la página que está buscando.",
                      "id": 0.6667065903657198
                    }
                  }, {
                    "geometry": {
                      "x": 53.06195336554641,
                      "y": 7.490185431217167,
                      "width": 45.57322705035322,
                      "height": 81.77060510447411,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "Intente navegar a otra página.",
                      "textforBox": "Please try to navigate to another page.",
                      "nativeLanguageTag": "Please try to navigate to another page.",
                      "learningLanguageTag": "Intente navegar a otra página.",
                      "id": 0.9928377178559871
                    }
                  }]}
                />
        </div>
        </div>
    );
  }
}

export default NotFound;
