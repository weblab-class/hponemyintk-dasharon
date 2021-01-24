import { render } from "react-dom";
import React, { Component } from "react";
import { shuffle } from "../../utilities";
import { get, post } from "../../utilities.js";
import { Link } from "@reach/router";
// import authentication library
// const auth = require("../../../../server/auth");
import "../../utilities.css";
import "./Image_aesthetics.css";
const clonedeep = require("lodash.clonedeep");
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
import CommentsBlock from "./CommentsBlock.js"; //comments from catbook

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

//this gives 1 flashcard

class IndividualFlashcard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      comments: [],
    };
    this.answerArray = [];
  }
  //post request to delete the relevant photo
  //many thanks to Jess for help revising to exclude target.value which is not ideal in hackathon
  handleDelete = (event) => {
    event.preventDefault();
    //let photoId = photoToDelete._id;
    console.log("DELETE CLICKED");
    // console.log(this.props.photoFacts._id);
    // console.log(event.target.value);
    let photoDeleteBody = { deletionId: this.props.photoFacts._id }; //set the request to be for this photo ID
    post("/api/deletePhoto", photoDeleteBody); //run the delete request
    alert("Adios photo! Au revoir! Your photo has been deleted");
    this.props.deletionFunction(this.props.photoFacts._id);
    //after deletion, send back to where you were (e.g., if you are on your flashcards page return there, and if you are on the friends page go back there)
  };

  //get comments, this is from catbook, many thanks to Kye for indicating we can use this code!
  componentDidMount() {
    get("/api/comment", { parent: this.props.photoFacts._id }).then((comments) => {
      this.setState({
        comments: comments,
      });
    });
  }

  // componentDidUpdate() {
  //   get("/api/comment", { parent: this.props.photoFacts._id }).then((comments) => {
  //     this.setState({
  //       comments: comments,
  //     });
  //   });
  // }

  //cleans up annotations many thanks to Justin in Office Hours for forEach and push and editing
  cleanAnnotInput = (initAnnotInput) => {
    let newInput = [];

    initAnnotInput.forEach((obj) => {
      let newObj = { ...obj, geometry: { ...obj.geometry, type: obj.geometry.shape_kind } };


        const nativeTag = newObj.data.nativeLanguageTag;
        const learningTag = newObj.data.learningLanguageTag;
        console.log("BOOLEAN", this.state.showInNativeLanguage)
        if (!this.props.showInNativeLanguage)
        {
          newObj.data.text = newObj.data.nativeLanguageTag;
          newObj.data.textforBox = newObj.data.learningLanguageTag;
        }
        else
        {
          newObj.data.text = newObj.data.learningLanguageTag;
          newObj.data.textforBox = newObj.data.nativeLanguageTag;
        }

        console.log("NEW OBJECT, newObj")
      
      newInput.push(newObj);
      // let newObj = {};
      // newObj.data = obj.data;
      // obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      // delete obj.geometry.shape_kind;
    
    });
    return newInput;
  };

  //create answer array in a randomized order
  createAnswerArray = () => {
    //set up array of answer objects- 1 text 2 color
    let answerArray = [
      {
        text: this.props.wrongAnswers[0],
        color: "red",
      },
      {
        text: this.props.wrongAnswers[1],
        color: "red",
      },
      {
        text: this.props.wrongAnswers[2],
        color: "red",
      },
      {
        text: this.props.correctAnswer,
        color: "green",
      },
    ];
    const shuffledArray = shuffle(answerArray); //shuffle array and return
    return shuffledArray;
  };
  //show quiz options if this is a quiz
  showQuizInfo = () => {
    //make answer array if not shuffled yet

    // const tmpCopy = clonedeep(answerArrayrec); //ref https://flaviocopes.com/how-to-clone-javascript-object/
    if (!this.props.wasAnswerInput) {
      this.answerArray = this.createAnswerArray();
      return (
        <>
          {this.answerArray.map((ans, k) => (
            <button onClick={() => this.props.handleClick(ans, this.props.correctAnswer)} key={k}>
              {ans.text}
            </button>
          ))}
        </>
      );
    } else {
      return (
        <>
          {this.answerArray.map((ans, k) => (
            <button style={{ color: ans.color }} key={k} disabled>
              {ans.text}
            </button>
          ))}
          {this.props.curAnsInfo[0] ? (
            <p style={{ color: "green" }}>You got the right anwer!!!</p>
          ) : (
            <p style={{ color: "red" }}>The right answer is {this.props.correctAnswer}.</p>
          )}
          {console.log("this.props.curAnsInfo", this.props.curAnsInfo)}
        </>
      );
    }
  };

  //Show caption with hover option to see in other language, and have a chance to flip languages
  showCaption = () => {
    if (this.props.showInNativeLanguage) {
      return (
        <span className="tooltip">
          {this.props.photoFacts.captionTextOriginal}
          <span className="tooltiptext">{this.props.photoFacts.captionTextTranslated}</span>
        </span>
      );
    } else {
      return (
        <span className="tooltip">
          {this.props.photoFacts.captionTextTranslated}
          <span className="tooltiptext">{this.props.photoFacts.captionTextOriginal}</span>
        </span>
      );
    }
  };

  // From catbook this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  addNewComment = (commentObj) => {
    this.setState({
      comments: this.state.comments.concat([commentObj]),
    });
  };

  //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  //this.props.photoFacts, this.props.ownPhoto
  GetPhotoInfo = () => {
    //debugging code
    // console.log("Initial annotation array");
    // console.log(PhotoInfo.annotation_info_array);

    // console.log("ANNOT ARRAY", this.props.photoFacts.annotation_info_array);
    let annotPhotoInfo = this.cleanAnnotInput(this.props.photoFacts.annotation_info_array);
    if (!annotPhotoInfo) {
      return null;
    }

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

          {/* info on submission-user nam link to profileandddate*/}
          <div className="postRight">
            {/* <div> */}
            <Link to={"/Flashcards/" + this.props.photoFacts.uid} className="profiletext">{this.props.photoFacts.uname}</Link>
            <p className="dateText">{this.props.photoFacts.submit_stamp}</p>
            {/*caption if not in quiz mode, otherwise show quiz questions */}
            {!this.props.forQuiz ? this.showCaption() : <>{this.showQuizInfo()}</>}
            {/*info on ratings*/}
            {/* <Typography component="legend">Difficulty</Typography> {PhotoInfo.difficulty} */}
            <p>Difficulty</p>
            <Rating
              precision={0.5}
              name="difficultyRating"
              value={this.props.photoFacts.difficulty}
              disabled
            />
            {/* <p>Quality</p>
            <Typography component="legend">Quality</Typography> *{PhotoInfo.quality}
            <Rating
              precision={0.5}
              name="qualityRating"
              value={this.props.photoFacts.quality}
              icon={<FavoriteIcon fontSize="inherit" />}
              disabled
            /> */}
            {/* If these ae your own cards, add an option to delete them using code from ImgUpload- credit NewPostInput.js in Catbook and ref 
            https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa* 
            https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag 
            https://www.w3schools.com/howto/howto_js_popup_form.asp 
            https://www.w3schools.com/tags/tag_button.asp
            
            https://stackoverflow.com/questions/54151051/react-button-onclick-function-is-running-on-page-load-but-not-you-click-it*/}
            {this.props.ownPhoto && !this.props.onlyOne && !this.props.forQuiz ? (
              <button type="button" className="button button:hover trashCan">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{ color: "#0099ff" }}
                  onClick={this.handleDelete}
                />
              </button>
            ) : (
              <p></p>
            )}

            {/*if this is a quiz and an answer was selected, add a next button
            if this is a quiz and an answer is not selected, no next button
            if this is not a quiz then have comments block*/}
            {this.props.forQuiz ? ( //Case 1A- in quiz and input answer- show next
              !this.props.isDone ? (
                <button type="button" onClick={this.props.handleNext}>
                  Next
                </button>
              ) : (
                <button type="button" onClick={this.props.handleFinish}>
                  Finish!
                </button>
              ) //Case1B- in quiz and did not yet input answer- show empty tag
            ) : (
              //Case 2- not in quiz and then show comments block
              /*this is from catbook*/
              <CommentsBlock
                photo={this.props.photoFacts}
                comments={this.state.comments}
                addNewComment={this.addNewComment}
                viewingUserId={this.props.viewingUserId}
                showInNativeLanguage={this.props.showInNativeLanguage}
              />
            )}
          </div>
        </div>
        <br />
      </div>
    );
  };

  //give 1 flashcard
  render() {
    return this.GetPhotoInfo();
  }
}

export default IndividualFlashcard;
