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
import ReactAnnotate from "../modules/ReactAnnotate.js"

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
  console.log("calling image load*****")
  get("/api/photosimpletest", { userId: this.props.userId }).then((ImageInfo) => {
    console.log(ImageInfo);
    this.setState({
        photo_info_array: ImageInfo,
    });
  });
}

//cleans up annotations
cleanAnnotInput = (initAnnotInput) => {

  let annotations_cleaned_up = [] //empty array to populate
  let annot_to_clean = JSON.parse(JSON.stringify(initAnnotInput));; //this makes a copy can edit from lecture  onJavascript perhaps, ref is https://www.samanthaming.com/tidbits/50-how-to-deep-clone-an-array/
    
    //reverse change type field to shape_kind field
    //run renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key
    for (let annot_to_add = 0; annot_to_add < initAnnotInput.length; annot_to_add++)
      {
        let new_annot_init = annot_to_clean[annot_to_add];

        //make type shape kind and delete type
        new_annot_init.geometry.type = new_annot_init.geometry.shape_kind;
        delete new_annot_init.geometry.shape_kind;

        //add in new annotation
        annotations_cleaned_up.push(new_annot_init);

        //tracer print statements
        //Why is so much being printed out on first run?
        console.log("which iteration?")
        console.log(annot_to_add);
        console.log(annotations_cleaned_up);
      };
      return(annotations_cleaned_up);
}

  //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  GetPhotoInfo(PhotoInfo) {

    //debugging code
    console.log("Initial annotation array")
    console.log(PhotoInfo.annotation_info_array);

    //change annotation field so it is type which react-image-annotate needs
    let annotPhotoInfo = this.cleanAnnotInput(PhotoInfo.annotation_info_array);

    //debugging code
    console.log("Revised annotation array")
    console.log(annotPhotoInfo)
    return(
      <>
      <div className="u-img" >
      <ReactAnnotate allowEdits = {false} img_using= {PhotoInfo.photo_placeholder} annotationslst = {annotPhotoInfo} height = "300" width="300"/>
      </div>
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
    console.log("ViewFlashCards:::",this.props.userId);
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
