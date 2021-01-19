import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";

class Scavenger_Hunts extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return (
      <>
        {/* Use username prop */}
        <div className="u-flex u-flex-justifyCenter">
          <div className="postColumn paddedText">
            <p>
              A preview of a possible coming attraction we are considering implementing...
              <br />
              <br />
              We are thinking of implementing photo prompts with questions, where you can take a
              photo containing your answer. <br />
              <br />
              For instance, one question could be: "What is a plant you like?" In response to the
              question, Kyaw could upload
            </p>{" "}
            <br />
            {/* image from css from catbook, if we can add make this a react annotate */}
            {/* <div className="kyawSample" /> */}
            {/* <img src="../../public/images/Trees.png" /> */}
            <img src="public/images/Trees.png" />
            <p>And Dina could upload</p>
            <br />
            {/* <div className="dinaSample" /> */}
            {/* <img src="../../public/images/Flowers.jpg" /> */}
            <img src="public/images/Flowers.jpg" />
            <p>
              What would you upload? If we decide to go ahead and implement this, we will be excited
              to hear your answer!
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default Scavenger_Hunts;
