import React, { Component } from "react";

import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import "./LandingPage.css";

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
        {/* using circle method ref in css file  and try to put in larger circle to prevent browser resizing 
      ref helping: https://stackoverflow.com/questions/15427125/how-to-center-the-center-circle
      https://stackoverflow.com/questions/22406661/how-to-make-one-circle-inside-of-another-using-css
      </div>
      */}
        <div className="circlebigger">
          <div className="circle">
            {" "}
            <p className="titletext">WeWorld </p>{" "}
          </div>{" "}
        </div>
        <p className="introtext">
          Expand your world through languages
          <br />
          Have fun as you learn and learn as you have fun!
        </p>
        <p className="paddedText">
          WeWorld is a social language learning website. Users upload their photos and tag them in a
          foreign language they are trying to learn (currently Spanish is being used for the demo).
          Users can also see other users' photos to learn from their lives!
          <br />
          <br />
          *Please note currently all users can see everyone's content given this is an early testing
          version of the website. So please do not share any image or text you do not want shared
          publicly. Also your timestamp of use and name are recorded and associated with your
          image.*
        </p>
      </>
    );
  }
}

export default Skeleton;
