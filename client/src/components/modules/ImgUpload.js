/*Should double check what is from where, but combines two sources*/

/*Medium code for a preview: WORKING*/
/*From https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa*/

/*Adding on https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag code for upload*/

/*Previously consulted https://www.webtrickshome.com/faq/how-to-display-uploaded-image-in-html-using-javascript-->*/
/*And obtained this code from https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag*/

/*Code to get and show name
From https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
*/

/*
code for rating bar
https://material-ui.com/components/rating/
//https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/

import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

//import post as in catbook
import { post } from "../../utilities";


class ImgUpload extends React.Component {
/*from React and Medium websites above*/
  constructor(props){
    super(props);
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.curTag = React.createRef();
    // [this.state.value, this.state.setValue] = React.useState(0);
    this.postCaption = React.createRef(); /*for 2nd inputs*/
  }
  /*from Medium website above*/
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }
  /*from React website above*/
  handleSubmit(event) {
    const test_body = {caption_text : this.postCaption.current.value, 
      tag_text: this.curTag.current.value,
      photo_placeholder: this.fileInput.current.files[0].name,};
    post("/api/photo_simple", test_body);
    alert(
      "Selected file: " + this.fileInput.current.files[0].name 
      + '\nA tag was submitted: "' + this.curTag.current.value +'"'
      + '\nA thought was submitted: "'  + this.postCaption.current.value +'"'
    );

    event.preventDefault();
    //Upload caption test
    // post("/api/photo_simple", {photo_info: "Test photo",
    // tag_location_list : [1],
    // tag_text_list : "Test tag",
    // caption_text: "check_caption 1/12/21",
    // difficulty_list: [1],
    // quality_rating_list: [2]});
    // console.log("will this print?")
    //console.log(this.props.uid)
    console.log("reached")
  }


  /*from React and Medium websites combined*/
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* Give a handle for uploading and previewing images */}
        <div className="u-offsetByX">
          <img className="u-showImg" src={this.state.file} height = "300" width="300"/>
        </div>
        <div>
        <div>
        <Box align="left"  component="fieldset" mb={3} borderColor="transparent">
          <Rating
            value={value}
            name="rating"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onClick={props.handleInputChange}
          />
        </Box>
      </div>
        </div>
          Upload file:
          <input type="file" ref={this.fileInput} onChange={this.handleChange}/>

        <br />
        {/* Get tag and post info*/}
        Tag:
            <input type="text" ref={this.curTag} />
            Caption:
            <input type="text" ref={this.postCaption} />
        
        {/* <br /> */}

        <input type="submit" value="Submit" />        

      </form>
    );
  }
}

export default ImgUpload;