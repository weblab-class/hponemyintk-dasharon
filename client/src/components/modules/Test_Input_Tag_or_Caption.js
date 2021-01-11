/*Code to get and show name
From https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
*/
import React, { Component } from "react";

class Test_Input_Tag_or_Caption extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.input = React.createRef();
      this.input_2 = React.createRef(); /*for 2nd inputs*/
    }
  
    handleSubmit(event) {
      alert('A tag was submitted: ' + this.input.current.value + "\nA thought was submitted: "  + this.input_2.current.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
            Tag:
            <input type="text" ref={this.input} />
            Caption:
            <input type="text" ref={this.input_2} />
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
  
  export default Test_Input_Tag_or_Caption