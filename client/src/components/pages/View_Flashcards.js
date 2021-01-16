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
    //onyl make req if logged in
    if (this.props.userId)
    {
      this.imageLoad();
    };
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId)
    {
      this.imageLoad();
    }
  }

//split into a new function as in Nikhil's gcp code
imageLoad = () => {
  get("/api/photo_simple_w_annotate", { userName: this.props.userName }).then((ImageInfo) => {
    this.setState({
        photo_info_array: ImageInfo,
    });
  });
}

  //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  GetPhotoInfo(PhotoInfo) {
    console.log(PhotoInfo.annotation_info_array);
    return(
      <>
      <p>Placeholder: <img className="u-showImg" src={PhotoInfo.photo_placeholder} height = "300" width="300"/> </p>
      <p>Submitted by: {PhotoInfo.uname}</p>
      <p>Submitted on: {PhotoInfo.submit_stamp}</p>
      <p>Caption: {PhotoInfo.caption_text_s}</p>

      <div>
      <Typography component="legend">Difficulty ({PhotoInfo.difficulty})</Typography>
      <Rating
      precision={0.5}
      name="difficultyRating"
      value= {PhotoInfo.difficulty}
      disabled
      />

    <Typography component="legend">Quality ({PhotoInfo.quality})</Typography>
      <Rating
        precision={0.5}
        name="qualityRating"
        value= {PhotoInfo.quality}
        icon={<FavoriteIcon fontSize="inherit" />}
        disabled
      />
  </div>
        </>
    )
  }

  render () {
    console.log("ViewFlashCards:::",this.props.userName);
    return (
      <>
      <p>Flashcards!</p>
      <p>{this.state.photo_info_array.length}</p>
      {console.log("ViewFlashCards:::Printing photo_info_array", this.state.photo_info_array)}
      

      {/* If there is a photo then give info on it. Otherwise have a message saying there is 
      nothing to return. Length ref: https://www.geeksforgeeks.org/how-to-determine-length-or-size-of-an-array-in-java/*/}
      {(this.state.photo_info_array) ?
      (<> 
      {console.log("ViewFlashCards:::Printing photo_placeholder", this.state.photo_info_array.caption_text_s)}
      <p>{this.props.userName}</p>
      {/* <p>{this.state.photo_info_array.caption_text_s}</p>
      <p>{this.state.photo_info_array.photo_placeholder}</p> */}
      <>{this.GetPhotoInfo(this.state.photo_info_array)}</> 
      </>)
      :  (<p>Nothing to return. Please upload!</p>)}
      </>
    )
  };
}
export default View_Flashcards;
