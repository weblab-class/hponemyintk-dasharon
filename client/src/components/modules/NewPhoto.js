import React, { Component } from "react";
import { post } from "../../utilities";
import "./NewPhotoInput.css";

//From web lab catbook NewPhotoInput.js code was taken

/**
 * 1/12 from catbook not sure how much needs to be edited
 * Open question:
 * How much is this for a text input and needs revision for a photo schema?
 */
class NewPhotoInput extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        value: "",
      };
    }
  
    // called whenever the user types in a box?
    handleChange = (event) => {
      this.setState({
        value: event.target.value,
      });
    };
  
    // called when the user uploads a photo?
    handleSubmit = (event) => {
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.value);
      this.setState({
        value: "",
      });
    };
  
    render() {
      return (
        <div className="u-flex">
          <input
            type="text"
            placeholder={this.props.defaultText}
            value={this.state.value}
            onChange={this.handleChange}
            className="NewPhotoInput-input"
          />
          <button
            type="submit"
            className="NewPhotoInput-button u-pointer"
            value="Submit"
            onClick={this.handleSubmit}
          >
            TEST TEST Submit
          </button>
        </div>
      );
    }
  }

/**
 * NewPhoto runs a Photo request for the uploaded photo
 * plus its caption, tags/associated difficulty and quality
 * Details in server/photo.js
 */
class NewPhoto extends Component {
    addPhoto = (value) => {
      const body = { 
        //   photo_placeholder = "will be photo",
        //   tag_location_list = 
        //   tag_text_list: req.body.tag_text_list, //Also considered generic array w/o types in https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
        caption: value, //This holds the thoughts on the photo that are not tags
        //   difficulty_rating: req.body.difficulty_list,
        //   quality_rating: req.body.quality_rating_list
       };
      post("/api/photo", body).then((photo) => {
        // 1/12 this is for later, when may want to show photo after submittting
        this.props.addNewPhoto(); //1/12 now placeholder may need feed later
      });
    };

    //1/12 from catbook code keeping for now but may not need
    render() {
        return <NewPhotoInput defaultText="New Input" onSubmit={this.addPhoto} />;
      }
}

export default NewPhoto