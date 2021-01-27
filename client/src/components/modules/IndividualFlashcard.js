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
import HelpIcon from "@material-ui/icons/Help";
import TranslateIcon from "@material-ui/icons/Translate";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactAnnotate from "./ReactAnnotate.js";
// import HelpIcon from "@material-ui/icons/Help";
import { useLocation, navigate } from "@reach/router"; //ref https://reach.tech/router/api/useLocation
import CommentsBlock from "./CommentsBlock.js"; //comments from catbook

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faFlagCheckered, faThumbsUp, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

//this gives 1 flashcard
const StyledRating = withStyles({
  iconFilled: {
    color: "#0099ff",
  },
  iconHover: {
    color: "#0099ff",
  },
})(Rating);

class IndividualFlashcard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      comments: [],
      enableDifficultyEdit: false,
      showInNativeLanguage: false,
    };
    this.answerArray = [];
    this.createAnswerArrayFlag = true; //check whether you have created an answer array already
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
    alert("Adios photo! Your photo has been deleted");
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

  componentDidUpdate(prevProps) {
    if (this.props.photoFacts._id && prevProps.photoFacts._id !== this.props.photoFacts._id) {
      get("/api/comment", { parent: this.props.photoFacts._id }).then((comments) => {
        this.setState({
          comments: comments,
        });
      });
    }
  }

  //cleans up annotations many thanks to Justin in Office Hours for forEach and push and editing
  cleanAnnotInput = (initAnnotInput) => {
    let newInput = [];

    initAnnotInput.forEach((obj) => {
      let newObj = { ...obj, geometry: { ...obj.geometry, type: obj.geometry.shape_kind } };

      //only have flipping if not in quiz. Otherwise do not want to flip
      if (!this.props.forQuiz) {
        //Switch whether tag is in native language and text is learning language or vice versa
        const nativeTag = newObj.data.nativeLanguageTag;
        const learningTag = newObj.data.learningLanguageTag;
        console.log("BOOLEAN", this.state.showInNativeLanguage);
        if (!this.state.showInNativeLanguage) {
          newObj.data.text = newObj.data.nativeLanguageTag;
          newObj.data.textforBox = newObj.data.learningLanguageTag;
        } else {
          newObj.data.text = newObj.data.learningLanguageTag;
          newObj.data.textforBox = newObj.data.nativeLanguageTag;
        }
      }
      console.log("NEW OBJECT, newObj");

      newInput.push(newObj);
      // let newObj = {};
      // newObj.data = obj.data;
      // obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      // delete obj.geometry.shape_kind;
    });
    return newInput;
  };

  //option to vote on difficulty
  editDifficulty = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      enableDifficultyEdit: !this.state.enableDifficultyEdit,
    }));
    console.log("DIFFICULTY FLIP");
  };

  //create answer array in a randomized order
  createAnswerArray = () => {
    //set up array of answer objects- 1 text 2 color
    let answerArray = [
      {
        text: this.props.wrongAnswers[0],
        color: "#D9534F",
      },
      {
        text: this.props.wrongAnswers[1],
        color: "#D9534F",
      },
      {
        text: this.props.wrongAnswers[2],
        color: "#D9534F",
      },
      {
        text: this.props.correctAnswer,
        color: "#5CB85C",
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
      if (this.createAnswerArrayFlag) {
        console.log(
          "this.props.wasAnswerInput,this.createAnswerArrayFlag",
          this.props.wasAnswerInput,
          this.createAnswerArrayFlag
        );
        this.answerArray = this.createAnswerArray();
        this.createAnswerArrayFlag = false;
      }
      console.log(
        "In if but not in nested if this.props.wasAnswerInput,this.createAnswerArrayFlag",
        this.props.wasAnswerInput,
        this.createAnswerArrayFlag
      );
      return (
        <>
          <p>
            What is "{this.props.ogTag.toLowerCase()}" in {this.props.langInterestLong}?
          </p>
          {this.answerArray.map((ans, k) => (
            <>
              <button
                className="quizButton"
                onClick={() => this.props.handleClick(ans, this.props.correctAnswer)}
                key={k}
              >
                {ans.text}
              </button>
              {/* <div>&nbsp;</div> */}
            </>
          ))}
        </>
      );
    } else {
      console.log(
        "123this.props.wasAnswerInput,this.createAnswerArrayFlag",
        this.props.wasAnswerInput,
        this.createAnswerArrayFlag
      );
      this.createAnswerArrayFlag = true;
      return (
        <>
          <p>
            What is "{this.props.ogTag.toLowerCase()}" in {this.props.langInterestLong}?
          </p>
          {this.answerArray.map((ans, k) => (
            <>
              {console.log(
                "***this.props.clickedAns,this.props.correctAnswer,ans",
                this.props.clickedAns.text,
                this.props.correctAnswer,
                ans
              )}
              {ans.text == this.props.clickedAns ? (
                <>
                  {this.props.clickedAns == this.props.correctAnswer ? (
                    <>
                      <button
                        className="quizButton quizButtonClickedCor"
                        style={{ color: ans.color }}
                        key={k}
                        disabled
                      >
                        {ans.text}
                      </button>
                      {/* <div>&nbsp;</div> */}
                    </>
                  ) : (
                    <>
                      <button
                        className="quizButton quizButtonClicked"
                        style={{ color: ans.color }}
                        key={k}
                        disabled
                      >
                        {ans.text}
                      </button>
                      {/* <div>&nbsp;</div> */}
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="quizButton quizButtonNotClicked"
                    style={{ color: ans.color }}
                    key={k}
                    disabled
                  >
                    {ans.text}
                  </button>
                  {/* <div>&nbsp;</div> */}
                </>
              )}
            </>
          ))}
          {/* {this.props.curAnsInfo[0] ? (
            <p style={{ color: "green" }}>You got the right anwer!!!</p>
          ) : (
            <p style={{ color: "red" }}>The right answer is {this.props.correctAnswer}.</p>
          )} */}
          {console.log("this.props.curAnsInfo", this.props.curAnsInfo)}
        </>
      );
    }
  };

  //Show caption with hover option to see in other language, and have a chance to flip languages
  showCaption = () => {
    if (this.state.showInNativeLanguage) {
      return (
        <span className="tooltip" style={{ marginBottom: "1vw" }}>
          {this.props.photoFacts.captionTextOriginal}
          {/* <span className="tooltiptext">{this.props.photoFacts.captionTextTranslated}</span> */}
        </span>
      );
    } else {
      return (
        <span className="tooltip" style={{ marginBottom: "1vw" }}>
          {this.props.photoFacts.captionTextTranslated}
          {/* <span className="tooltiptext">{this.props.photoFacts.captionTextOriginal}</span> */}
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

  //on click flip to show in either native language or language learning ref https://stackoverflow.com/questions/12772494/how-to-get-opposite-boolean-value-of-variable-in-javascript/12772502
  switchLanguage = (event) => {
    this.setState({ showInNativeLanguage: !this.state.showInNativeLanguage });
    // ss
    //Flip the tags and printout languages in each annotation for each photo
    // for (let pp = 0; pp < this.state.photo_info_array.length; pp++)
    // {
    //   for (let aa = 0; aa < this.state.photo_info_array[pp].annotation_info_array.length; aa++)
    //   {
    //     const initialTag = this.state.photo_info_array[pp].annotation_info_array[aa].data.text;
    //     const initialText = this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox;
    //     this.state.photo_info_array[pp].annotation_info_array[aa].data.text = initialText;
    //     this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox = initialTag;
    //     console.log("in inner loop");
    //   }
    // }
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

    //if you already rated this, show your rating
    let ownRating = "0";
    for (let rr = 0; rr < this.props.photoFacts.difficultyRatings.length; rr++) {
      if (this.props.photoFacts.difficultyRatings[rr].ratingUserId === this.props.viewingUserId) {
        ownRating = this.props.photoFacts.difficultyRatings[rr].ratingValue;
      }
    }

    //Set average user rating and whether to show "rating" or "ratings"
    let othersRating = "0";
    let othersRatingCountText = "Ratings";
    if (this.props.photoFacts.difficultyRatings.length > 0) {
      othersRating = Math.round(this.props.photoFacts.difficulty * 10) / 10;
    }
    if (this.props.photoFacts.difficultyRatings.length === 1) {
      othersRatingCountText = "Rating";
    }

    let langSwitchText = "Show comments and captions in language learning!";
    if (this.state.showInNativeLanguage === false) {
      langSwitchText = "Show comments and captions in English!";
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
              hideTagLst={this.props.forQuiz}
              height="300"
              width="300"
            />
          </div>

          {/* info on submission-user nam link to profileandddate*/}
          <div className="postRight">
            {/* <div> */}
            {/*caption if not in quiz mode, otherwise show quiz questions */}
            {!this.props.forQuiz ? (
              <>
                <Link to={"/Flashcards/" + this.props.photoFacts.uid} className="profiletext">
                  {this.props.photoFacts.uname}
                </Link>
                <p className="dateText">{this.props.photoFacts.submit_stamp}</p>
                {this.showCaption()}
              </>
            ) : (
              <>
                <>{this.showQuizInfo()}</>
                <Link to={"/Flashcards/" + this.props.photoFacts.uid} className="profiletext">
                  {this.props.photoFacts.uname}
                </Link>
                <p className="dateText">{this.props.photoFacts.submit_stamp}</p>
              </>
            )}
            {/* ************************* */}
            {/* *** icons begins here *** */}
            {/* ************************* */}
            {/*ref https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript*/}

            {/* *** For aggregate ratings *** */}
            <div
              className="u-flex u-flex-alignCenter"
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <div className="u-flex u-flex-alignCenter u-flex-justifyCenter">
                <button title="Aggregate rating from all users" className="solidButton" disabled>
                  <HelpIcon style={{ color: "#E4BB24", fontSize: "1.8vw" }} />
                </button>

                <div>
                  <span style={{ fontSize: "1.5vw" }}>{othersRating}</span>
                  <span style={{ fontSize: ".8vw" }}>/5 </span>
                  <span className="aggregateRating" style={{ fontSize: ".8vw" }}>
                    ({this.props.photoFacts.difficultyRatings.length}
                  </span>

                  {this.props.photoFacts.difficultyRatings.length > 1 ? (
                    <span style={{ fontSize: ".5vw" }}>votes)</span>
                  ) : (
                    <span style={{ fontSize: ".5vw" }}>vote)</span>
                  )}
                </div>
              </div>
              {/* *** For own ratings *** */}
              <div
                className="u-flex u-flex-alignCenter u-flex-justifyCenter"
                style={{ marginRight: "1.7vw" }}
              >
                {ownRating === "0" ? (
                  <button
                    title="Personal rating"
                    className="solidButton"
                    onClick={this.editDifficulty}
                  >
                    <HelpIcon style={{ color: "#0099ff", fontSize: "1.8vw", opacity: ".4" }} />
                  </button>
                ) : (
                  <button
                    title="Personal rating"
                    className="solidButton"
                    onClick={this.editDifficulty}
                  >
                    <HelpIcon style={{ color: "#0099ff", fontSize: "1.8vw" }} />
                  </button>
                )}
                <span style={{ fontSize: "1.5vw" }}>{ownRating}</span>

                {this.state.enableDifficultyEdit ? (
                  <StyledRating
                    precision={1.0}
                    name="difficultyRating"
                    icon={<HelpIcon fontSize="inherit" />}
                    onChange={(event, newvalue) => {
                      this.setState((prevState) => ({ ...prevState, enableDifficultyEdit: false }));
                      this.props.updateDifficulty(newvalue, this.props.photoFacts);
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>
              {/* *** For Like icon *** */}
              {/*see if you liked and count of likes*/}
              {this.props.forQuiz ? (
                <div className="u-flex u-flex-alignCenter u-flex-justifyCenter">
                  {this.props.photoFacts.usersLikingArray
                    .map((userData) => userData.likingUserId)
                    .includes(this.props.viewingUserId) ? (
                    <>
                      <button
                        title="Unlike this post"
                        className="solidButton"
                        onClick={(event) => this.props.updateLikes(this.props.photoFacts, false)}
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          style={{ color: "#0099ff", fontSize: "1.6vw" }}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        title="Like this post"
                        className="solidButton"
                        onClick={(event) => this.props.updateLikes(this.props.photoFacts, true)}
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          style={{ color: "#0099ff", fontSize: "1.5vw", opacity: ".4" }}
                        />
                      </button>
                    </>
                  )}
                  <span style={{ fontSize: "1.5vw" }}>{this.props.photoFacts.likeCount}</span>
                </div>
              ) : (
                <div
                  className="u-flex u-flex-alignCenter u-flex-justifyCenter"
                  style={{ marginRight: "1.7vw" }}
                >
                  {this.props.photoFacts.usersLikingArray
                    .map((userData) => userData.likingUserId)
                    .includes(this.props.viewingUserId) ? (
                    <>
                      <button
                        title="Unlike this post"
                        className="solidButton"
                        onClick={(event) => this.props.updateLikes(this.props.photoFacts, false)}
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          style={{ color: "#0099ff", fontSize: "1.6vw" }}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        title="Like this post"
                        className="solidButton"
                        onClick={(event) => this.props.updateLikes(this.props.photoFacts, true)}
                      >
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          style={{ color: "#0099ff", fontSize: "1.5vw", opacity: ".4" }}
                        />
                      </button>
                    </>
                  )}
                  <span style={{ fontSize: "1.5vw" }}>{this.props.photoFacts.likeCount}</span>
                </div>
              )}

              {/* *** For Lang Translation icon *** */}
              <div>
                {!this.props.forQuiz && (
                  <button
                    type="button"
                    className="solidButton"
                    onClick={this.switchLanguage}
                    title="Translate posts/comments between English and Spanish"
                  >
                    <TranslateIcon style={{ color: "#0099ff", fontSize: "1.8vw" }} />
                  </button>
                )}
              </div>
            </div>
            {/* ******************* */}
            {/* ******************* */}
            {/* ******************* */}

            {/* If these ae your own cards, add an option to delete them using code from ImgUpload- credit NewPostInput.js in Catbook and ref 
            https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa* 
            https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag 
            https://www.w3schools.com/howto/howto_js_popup_form.asp 
            https://www.w3schools.com/tags/tag_button.asp
            
            https://stackoverflow.com/questions/54151051/react-button-onclick-function-is-running-on-page-load-but-not-you-click-it*/}
            {this.props.ownPhoto && !this.props.onlyOne && !this.props.forQuiz ? (
              <button
                type="button"
                title="Delete this image"
                className="button button:hover fontAwesomeTR"
              >
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
                <button
                  type="button"
                  title="Go to next question"
                  className="button button:hover fontAwesomeBR"
                >
                  <FontAwesomeIcon
                    icon={faArrowAltCircleRight}
                    style={{ color: "#0099ff" }}
                    onClick={this.props.handleNext}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  title="End quiz and view the score"
                  className="button button:hover fontAwesomeBR"
                >
                  <FontAwesomeIcon
                    icon={faFlagCheckered}
                    style={{ color: "#0099ff" }}
                    onClick={this.props.handleFinish}
                  />
                </button>
              ) //Case1B- in quiz and did not yet input answer- show empty tag
            ) : (
              <>
                {/* //Case 2- not in quiz and then show comments block */}
                {/* this is from catbook*/}
                <CommentsBlock
                  photo={this.props.photoFacts}
                  comments={this.state.comments}
                  addNewComment={this.addNewComment}
                  viewingUserId={this.props.viewingUserId}
                  showInNativeLanguage={this.state.showInNativeLanguage}
                />
              </>
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
