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
        <p>
          A preview of a possible coming attraction we are considering implementing...<br/><br/>
          We are thinking of implementing photo prompts with questions, where you can take a photo containing your answer. <br/><br/>
          For instance, on question could be: "What is a plant you like?" in response to the question:  Kyaw could upload</p> <br/>

          <p>And Dina could upload</p><br/>
          <p>
          What would you upload? If we decide to go ahead and implement this, we will be excited to hear your answer!
        </p>
      </>
    );
  }
}

export default Scavenger_Hunts;