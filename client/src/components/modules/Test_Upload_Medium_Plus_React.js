/*Should double check what is from where, but combines two sources*/

/*Medium code for a preview: WORKING*/
/*From https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa*/

/*Adding on https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag code for upload*/

/*Previously consulted https://www.webtrickshome.com/faq/how-to-display-uploaded-image-in-html-using-javascript-->*/
/*And obtained this code from https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag*/

import React, { Component } from "react";


class Test_Upload_Medium_Plus_React extends React.Component {
/*from React and Medium websites above*/
  constructor(props){
    super(props);
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  /*from Medium website above*/
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }
  /*from React website above*/
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${this.fileInput.current.files[0].name}`
    );
  }
  /*from React and Medium websites combined*/
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="u-offsetByX">
          <img className="u-showImg" src={this.state.file} height = "300" width="300"/>
        </div>
          Upload file:
          <input type="file" ref={this.fileInput} onChange={this.handleChange}/>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default Test_Upload_Medium_Plus_React;