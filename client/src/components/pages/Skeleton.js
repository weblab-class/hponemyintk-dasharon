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
                  img_using="/public/images/WeWorldIntro_rev.png"
                  alt="A welcome image"
                  onTagSubmit={this.onTagSubmit}
                  annotationslst={[ {
                    "geometry": {
                      "x": 25.720351246489624,
                      "y": 29.325771925611953,
                      "width": 37.76160093157752,
                      "height": 60.8771563236512,
                      "type": "RECTANGLE"
                    },
                    "data": {
                      "text": "欢迎来到WeWorld！ 将鼠标悬停在标签上，可以查看带有标签的照片如何帮助您学习语言。",
                      "textforBox": "Welcome to WeWorld! Mouse over the tag to see how tagged photos can help teach you a language.",
                      "nativeLanguageTag": "Welcome to WeWorld! Mouse over the tag to see how tagged photos can help teach you a language.",
                      "learningLanguageTag": "欢迎来到WeWorld！ 将鼠标悬停在标签上，可以查看带有标签的照片如何帮助您学习语言。",
                      "id": 0.021150724844722135
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
                      "text": "你还在等什么？",
                      "textforBox": "So what are you waiting for?",
                      "nativeLanguageTag": "So what are you waiting for?",
                      "learningLanguageTag": "你还在等什么？",
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
                      "text": "请登录以开始学习和娱乐！",
                      "textforBox": "Please log in to get the learning and fun started!",
                      "nativeLanguageTag": "Please log in to get the learning and fun started!",
                      "learningLanguageTag": "请登录以开始学习和娱乐！",
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
