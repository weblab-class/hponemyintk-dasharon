import { render } from "react-dom";
import React, { Component } from "react";
import { get } from "../../utilities";


/*
code for rating bar
https://material-ui.com/components/rating/
https://material-ui.com/api/rating/
https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
//import ReactAnnotate from "./ReactAnnotate.js"

class View_Flashcards extends Component {
    constructor(props) {
      super(props);
      // Initialize Default State
      this.state = {
          photo_info_array: "", //this is a photo info array
      };
    }
  
    componentDidMount() {
      // remember -- api calls go here!, get call adapted from catbook
        //run get request to get first image of the user, will build up to getting images one by
        //one or all on one page
      get("/api/photo_simple_w_annotate", { userName: this.props.userName }).then((array_of_photos) => {
        this.setState({
            photo_info_array: array_of_photos,
        });
      });
    }

    //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
    photo_info(photo_array_entry) {
        console.log(photo_array_entry.annotation_info_array);
        return(
            <>
            <p>Placeholder: {photo_array_entry.photo_placeholder}</p>
            <p>Submitted by: {photo_array_entry.uname}</p>
            <p>Submitted on: {photo_array_entry.submit_stamp}</p>
            <p>Caption: {photo_array_entry.caption_text_s}</p>

            <div>
            <Typography component="legend">Difficulty ({photo_array_entry.difficulty})</Typography>
            <Rating
            precision={0.5}
            name="difficultyRating"
            value= {photo_array_entry.difficulty}
            disabled
            />

        <Typography component="legend">Quality ({photo_array_entry.quality})</Typography>
          <Rating
            precision={0.5}
            // value={this.state.value}
            name="qualityRating"
            // onChange={this.updateValue}
            value= {photo_array_entry.quality}
            icon={<FavoriteIcon fontSize="inherit" />}
            disabled
          />
      </div>
            
            </>
        )
    }

    render () {
        console.log(this.props.userName);
        return (
        <>
        <p>Flashcards!</p>
        <p>{this.props.userName}</p>
        <p>{this.state.photo_info_array.length}</p>
        

        {/* If there is a photo then give info on it. Otherwise have a message saying there is 
        nothing to return. Length ref: https://www.geeksforgeeks.org/how-to-determine-length-or-size-of-an-array-in-java/*/}
        {(this.state.photo_info_array.length > 0) ?
        <>
        <p>{this.state.photo_info_array}</p>
        {/* <p>{this.state.photo_info_array[0].caption_text_s}</p>
        <p>{this.state.photo_info_array[0].photo_placeholder}</p>
        <>{this.photo_info(this.state.photo_info_array[0])}</> */}
        </>
         :  <p>Nothing to return. Please upload!</p>}
        </>
        )
    };
}
export default View_Flashcards;
