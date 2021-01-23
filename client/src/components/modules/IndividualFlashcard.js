import { render } from "react-dom";
import React, { Component } from "react";
import { shuffle } from "../../utilities";
// import authentication library
// const auth = require("../../../../server/auth");
import "../../utilities.css";
import "./Image_aesthetics.css";

/*
code for rating bar
https://material-ui.com/components/rating/
https://material-ui.com/api/rating/
https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/
import FavoriteIcon from "@material-ui/icons/Favorite";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import ReactAnnotate from "./ReactAnnotate.js";
import { useLocation, navigate } from "@reach/router"; //ref https://reach.tech/router/api/useLocation

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

//this gives 1 flashcard

class IndividualFlashcard extends Component {
    constructor(props) {
      super(props);
      // Initialize Default State
      this.state = {
        wasAnswerInput : false
      };
    }
      //post request to delete the relevant photo
      //many thanks to Jess for help revising to exclude target.value which is not ideal in hackathon
  handleDelete = (event) => {
    event.preventDefault();
    //let photoId = photoToDelete._id;
    console.log("DELETE CLICKED");
    console.log(this.props.photoFacts._id);
    // console.log(event.target.value);
    let photoDeleteBody = { deletionId: this.props.photoFacts._id}; //set the request to be for this photo ID
    post("/api/deletePhoto", photoDeleteBody); //run the delete request
    alert("Adios photo! Au revoir! Your photo has been deleted");
    this.props.deletionFunction(this.props.photoFacts._id);
    //after deletion, send back to where you were (e.g., if you are on your flashcards page return there, and if you are on the friends page go back there)
  };

  //cleans up annotations many thanks to Justin in Office Hours for forEach and push and editing
  cleanAnnotInput = (initAnnotInput) => {
    let newInput = []

    initAnnotInput.forEach((obj) => {
      let newObj = { ...obj, geometry: { ...obj.geometry, type: obj.geometry.shape_kind } };
      newInput.push(newObj);
      // let newObj = {};
      // newObj.data = obj.data;
      // obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      // delete obj.geometry.shape_kind;
    });
    return newInput;
  };

  //Color answers by whether or not they are correct
  handleClickonAnswer = (event) => {
    this.setState({wasAnswerInput : true})
  };

  //when next is pressed, delete from array so next photo is seen
  //using prop function from quiz component
  handleNext = () => {
    this.props.movetoNextPhoto();
    this.setState({wasAnswerInput : false})
  };

  //create answer array in a randomized order
  createAnswerArray = () => {
    //set up array of answer objects- 1 text 2 color
    let answerArray = [
      {
        text: this.props.wrongAnswers[0],
        color: "red"
      }, {
        text: this.props.wrongAnswers[1],
        color: "red"
      }, {
        text: this.props.wrongAnswers[2],
        color: "red"
      }, {
        text: this.props.photoFacts.annotation_info_array[0].data.text,
        color: "green"
      }
    ];
    const shuffledArray = shuffle(answerArray); //shuffle array and return
    return shuffledArray;
  };

  //show quiz options if this is a quiz
  showQuizInfo = () => {
    
    //make answer array
    let answerArrayrec = this.createAnswerArray();
    if (!this.state.wasAnswerInput) {
    return(

<>
{answerArrayrec.map((ans, k) => <button onClick={this.handleClickonAnswer} key = {k}>{ans.text}</button>)}
      {/* <button onClick={this.handleClickonAnswer}>{this.props.wrongAnswers[0]}</button><br></br>
      <button onClick={this.handleClickonAnswer}>{this.props.wrongAnswers[1]}</button><br></br>
      <button onClick={this.handleClickonAnswer}>{this.props.wrongAnswers[2]}</button><br></br>
      <button onClick={this.handleClickonAnswer}>{this.props.photoFacts.annotation_info_array[0].data.text}</button><br></br> */}
      </>

      );
    }
    else {return (
      <>
      {answerArrayrec.map((ans, k) => <button style = {{color:ans.color}} key = {k}>{ans.text}</button>)}
            {/* <button style= {{color : "red"}}>{this.props.wrongAnswers[0]}</button><br></br>
            <button style= {{color : "red"}}>{this.props.wrongAnswers[1]}</button><br></br>
            <button style= {{color : "red"}}>{this.props.wrongAnswers[2]}</button><br></br>
            <button style= {{color : "green"}}>{this.props.photoFacts.annotation_info_array[0].data.text}</button><br></br> */}
            </>);};
  };
  //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  //this.props.photoFacts, this.props.ownPhoto
  GetPhotoInfo = () => {
    //debugging code
    // console.log("Initial annotation array");
    // console.log(PhotoInfo.annotation_info_array);
    
    console.log("ANNOT ARRAY", this.props.photoFacts.annotation_info_array);
    let annotPhotoInfo = this.cleanAnnotInput(this.props.photoFacts.annotation_info_array);
    if (!annotPhotoInfo) {
       return null; }
    //debugging code
    // console.log("Revised annotation array");
    // console.log(annotPhotoInfo);

    //multiple classes https://stackoverflow.com/questions/11918491/using-two-css-classes-on-one-element https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01 helped with row and column, other refs in css file
    return (
      <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
        {/* <div className="row post">
          <div className="center_image responsive"> */}

        {/*The annotated image*/}
        <div className="post">
          <div className="postLeft">
            {/* <div> */}
            <ReactAnnotate
              allowEdits={false}
              border-radius="10%"
              img_using={this.props.photoFacts.photo_placeholder}
              annotationslst={annotPhotoInfo}
              height="300"
              width="300"
            />
          </div>

          {/* info on submission*/}
          <div className="postRight">
            {/* <div> */}
            <p>Submitted by: {this.props.photoFacts.uname}</p>
            <p>Submitted on: {this.props.photoFacts.submit_stamp}</p>

            {/*caption if not in quiz mode, otherwise show quiz questions */}
            {!this.props.forQuiz?
            (<p>Caption: {this.props.photoFacts.caption_text_s}</p>) : (this.showQuizInfo())}

            {/*info on ratings*/}
            {/* <Typography component="legend">Difficulty</Typography> {PhotoInfo.difficulty} */}
            <p>Difficulty</p>
            <Rating precision={0.5} name="difficultyRating" value={this.props.photoFacts.difficulty} disabled />
            <p>Quality</p>
            {/* <Typography component="legend">Quality</Typography> *{PhotoInfo.quality} */}
            <Rating
              precision={0.5}
              name="qualityRating"
              value={this.props.photoFacts.quality}
              icon={<FavoriteIcon fontSize="inherit" />}
              disabled
            />

            {/* If these ae your own cards, add an option to delete them using code from ImgUpload- credit NewPostInput.js in Catbook and ref 
            https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa* 
            https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag 
            https://www.w3schools.com/howto/howto_js_popup_form.asp 
            https://www.w3schools.com/tags/tag_button.asp
            
            https://stackoverflow.com/questions/54151051/react-button-onclick-function-is-running-on-page-load-but-not-you-click-it*/}
            {(this.props.ownPhoto && !this.props.onlyOne && !this.props.forQuiz) ? (
              <button
                type="button"
                onClick={this.handleDelete}
                className="button button:hover trashCan"> 
                <FontAwesomeIcon icon={faTrashAlt} style={{ color: "#0099ff" }} />
              </button>
            ) : (
              <p></p>
            )}
            
            {/*if this is a quiz, add a next button*/}
            {(this.props.forQuiz) ? (<button type="button" onClick={this.handleNext}>Next</button>) : (<p></p>)}
          </div>
        </div>
        <br />
      </div>
    );
  };

  //give 1 flashcard
  render() {
      return(
          this.GetPhotoInfo()
      );
  };
}

export default IndividualFlashcard;