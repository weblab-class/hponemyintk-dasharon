import { render } from "react-dom";
import React, { Component } from "react";
import { get } from "../../utilities";
// import authentication library
// const auth = require("../../../../server/auth");
import "../../utilities.css";
import "../modules/Image_aesthetics.css";

/*
code for rating bar
https://material-ui.com/components/rating/
https://material-ui.com/api/rating/
https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import ReactAnnotate from "../modules/ReactAnnotate.js";

class View_Flashcards extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
        photo_info_array: [], //this is a photo info array
        onlyOne: false,
        stillLoggedIn: true,
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
    } else {console.log("SHOULD LOG OUT")};
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId)
    {
      this.imageLoad();
    } else {console.log("SHOULD LOG OUT")};
  }

//split into a new function as in Nikhil's gcp code, and also if only want one image (for Friends pages) only give one image
imageLoad = () => {
  console.log("calling image load*****");
  //see if logged in
  get("/api/whoami").then((user) => {
    if (user._id) {
      // they are registed in the database, and currently logged in.
      this.setState({ stillLoggedIn : true })
    } else {this.setState({stillLoggedIn : false})}});
  if (this.props.onlyOne)
  {
    get("/api/photosimpletestOne", { userId: this.props.userId }).then((ImageInfo_one) => {
      console.log(ImageInfo_one);
      this.setState({
          photo_info_array: [ImageInfo_one],
      });
    });
  }
  else   {
    get("/api/photosimpletest", { userId: this.props.userId }).then((ImageInfo) => {
      console.log(ImageInfo);
      this.setState({
          photo_info_array: ImageInfo,
      });
    });
    }
};

  //cleans up annotations
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.type = obj.geometry.shape_kind     //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.shape_kind
    })
    return(initAnnotInput);
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

    //multiple classes https://stackoverflow.com/questions/11918491/using-two-css-classes-on-one-element https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01 helped with row and column, other refs in css file
    return(
      <div className = "row">
      <div className= "center_image column">
      <ReactAnnotate allowEdits = {false} border-radius = "10%" img_using= {PhotoInfo.photo_placeholder} annotationslst = {annotPhotoInfo} height = "300" width="300"/>
      </div>
      <div className= "image_text column">
      <p>Submitted by: {PhotoInfo.uname}</p>
      <p>Submitted on: {PhotoInfo.submit_stamp}</p>
      <p>Caption: {PhotoInfo.caption_text_s}</p>

      <Typography component="legend">Difficulty</Typography> {/*{PhotoInfo.difficulty} */}
      <Rating
      precision={0.5}
      name="difficultyRating"
      value= {PhotoInfo.difficulty}
      disabled
      />

    <Typography component="legend">Quality</Typography> {/**{PhotoInfo.quality}*/}
      <Rating
        precision={0.5}
        name="qualityRating"
        value= {PhotoInfo.quality}
        icon={<FavoriteIcon fontSize="inherit" />}
        disabled
      />
  </div>
        </div>
    )
  }

  render () {
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    //if (!this.state.stillLoggedIn) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect with api call because of how prop was given in link
    console.log("ViewFlashCards:::",this.props.userId);
    return ( //***Very very important! Try className=center and edit styles in above code for row and column Kyaw had a great find that we could use container to get things a lot cleaner. This isn't yet working but would be a really great thing to get implemented, will commit and try further */
      <div className="u-textCenter">
      <p className = "u-bold">Flashcards!</p> 
      <br/>
      
      {console.log("ViewFlashCards:::Printing photo_info_array", this.state.photo_info_array)}
      

      {/* If there is a photo then give info on it. Otherwise have a message saying there is 
      nothing to return. Length ref: https://www.geeksforgeeks.org/how-to-determine-length-or-size-of-an-array-in-java/*/}
      {(this.state.photo_info_array) ?
      (<> 
      {console.log("ViewFlashCards:::Printing photo_placeholder", this.state.photo_info_array)}
      <p className = "nametext">{this.props.userName}</p>
      <p className="u-textCenter">There are {this.state.photo_info_array.length} flashcards for {this.props.userName}</p>
      {/* <p>{this.state.photo_info_array.caption_text_s}</p>
      <p>{this.state.photo_info_array.photo_placeholder}</p> */}
      {/*below uses syntax from Nikhil's GCP example */}
      <div>
      {this.state.photo_info_array.map((p) => (
        this.GetPhotoInfo(p)
      ))
      }
      </div>
      </>)
      :  (<p>Nothing to return. Please upload!</p>)}
      </div>
    )
  };
}
export default View_Flashcards;
