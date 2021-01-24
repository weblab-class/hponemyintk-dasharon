import React, { Component } from "react";
import "./Image_aesthetics.css";
import "../../utilities.css";
// https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010
import IndividualFlashcard from "./IndividualFlashcard.js";
import { get } from "../../utilities";
const clonedeep = require("lodash.clonedeep");

class QuizSelfMade_DS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      onPhoto: 0,
      looped: false,
      loaded: false,
      // the following 2 are for counting correct/inccorect stat in quiz
      correctCt: 0,
      incorrectCt: 0,
      wasAnswerInput: false,
    };
    // this.handleClick = this.handleClick.bind(this);
  } // end constructor

  //when next is pressed, delete from array so next photo is seen
  //using prop function from quiz component
  handleNext = () => {
    this.movetoNextPhoto();
    this.setState({ wasAnswerInput: false });
  };

  componentDidMount() {
    // remember -- api calls go here!, get call adapted from catbook
    //run get request to get first image of the user, will build up to getting images one by
    //one or all on one page
    //onyl make req if logged in
    if (this.props.userId) {
      this.imageLoad();
    } else {
      console.log("SHOULD LOG OUT");
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.imageLoad();
    } else {
      console.log("SHOULD LOG OUT");
    }
  }

  //pass as prop to individual flashcard components
  //take in photo id
  //many thanks to Jess, this should delete 1 photo then another should show up
  movetoNextPhoto = () => {
    // this.setState({
    //   photo_info_array : this.state.dataSet.filter((p) => (p._id !== photoforDeletion))
    // })
    console.log("starting movetonextphoto");
    if (this.state.onPhoto < this.state.dataSet.length - 1) {
      this.setState({ onPhoto: this.state.onPhoto + 1 });
    } else {
      this.setState({ onPhoto: 0, looped: true });
    }
    console.log("CHANGING ON PHOTO TO", this.state.onPhoto);
  };

  //split into a new function as in Nikhil's gcp code, and also if only want one image (for Friends pages) only give one image
  imageLoad = () => {
    console.log("calling image load*****");
    //see if logged in
    // get("/api/whoami").then((user) => {
    //   if (user._id) {
    //     // they are registed in the database, and currently logged in.
    //     this.setState({ stillLoggedIn: true });
    //   } else {
    //     this.setState({ stillLoggedIn: false });
    //   }
    // });
    //Find user whose photos we are seeing

    //get photo array and add in some wrong answers
    //set the state to be this list of question objects
    //would be great to get each annotation as a separate object
    get("/api/photosforquiz").then((ImageInfo) => {
      console.log("IMAGE INFO");
      console.log(ImageInfo);
      console.log("first elemt", ImageInfo[0]);
      console.log("first photo?", ImageInfo.infoOnPhotos[0]);
      let questionArray = [];

      //loop through each photo
      for (let ii = 0; ii < ImageInfo.infoOnPhotos.length; ii++) {
        //get the entire array set up, and then will edit each photoData object so only 1 annotation is recorded in each entry
        let allAnnotArray = ImageInfo.infoOnPhotos[ii].annotation_info_array;
        //loop through each annotation

        for (
          let annot = 0;
          annot < ImageInfo.infoOnPhotos[ii].annotation_info_array.length;
          annot++
        ) {
          const onewordwrongAnswers = ["perro", "libro", "mariposa", "semana", "reloj", "domingo"]; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?
          const twowordwrongAnswers = ["dos libros", "mi amigo", "feliz cumpleaños", "yo sonrío"]; //two word wrong answers, maybe pull three for each

          //nested spread operator, will this copy everything?
          // let newPhotoInfo = {...ImageInfo.infoOnPhotos[ii], annotation_info_array: {...ImageInfo.infoOnPhotos[ii].annotation_info_array, geometry : {...ImageInfo.infoOnPhotos[ii].annotation_info_array.geometry}, data : {...ImageInfo.infoOnPhotos[ii].annotation_info_array.data}} }; //make a copy of object
          //ref https://stackoverflow.com/questions/39968366/how-to-deep-copy-a-custom-object-in-javascript
          //let newPhotoInfo = Object.assign(ImageInfo.infoOnPhotos[ii]);
          const newPhotoInfo = clonedeep(ImageInfo.infoOnPhotos[ii]); //ref https://flaviocopes.com/how-to-clone-javascript-object/
          newPhotoInfo.annotation_info_array = [allAnnotArray[annot]]; //replace the copy's annotation with just 1 annotation
          //for each annotation/photo pair, recond. make this an array to work with the IndividualFlashcard.js function

          //record correct anser and change tag
          const correctAnswer = newPhotoInfo.annotation_info_array[0].data.text; //get correct answer
          newPhotoInfo.annotation_info_array[0].data.text = "Please select the correct answer!"; //change the text

          //maybe only go here if correctAnswer has 1-2 words?

          let questionObject = {
            photoData: newPhotoInfo, //record this photo with only the new 1 annotation- not all
            //annotationtoDisplay: ImageInfo.infoOnPhotos[ii].annotation_info_array[annot], //record this annotation
            correctAnswer: correctAnswer,

            //Maybe add in a check of how many words are in the correct answer, and if there are 1 or 2, randomly select 3 choice from the appropriate array above?

            wrongAnswers: ["perro", "libro", "mariposa"],
          }; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?

          console.log(questionObject);

          //run concatentation once in each inner for loop
          questionArray = questionArray.concat(questionObject);
        }
      }

      //shuffle array to make different photos appear ref https://flaviocopes.com/how-to-shuffle-array-javascript/
      //https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
      for (let iii = questionArray.length - 1; iii > 0; iii--) {
        const jjj = Math.floor(Math.random() * iii);
        const temp = questionArray[iii];
        questionArray[iii] = questionArray[jjj];
        questionArray[jjj] = temp;
      }
      console.log("question array", questionArray);
      this.setState({
        dataSet: questionArray,
        loaded: true,
      });
    });
  };

  handleClick = (ansString, corAns) => {
    this.setState({ wasAnswerInput: true }); //Color answers by whether or not they are correct
    console.log("ansString == corAns", ansString.text, corAns);
    if (ansString.text == corAns) {
      this.setState({ correctCt: this.state.correctCt + 1 });
    } else {
      this.setState({ incorrectCt: this.state.incorrectCt + 1 });
    }
    console.log(
      "this.state.correctCt,this.state.incorrectCt",
      this.state.correctCt,
      this.state.incorrectCt
    );
  };

  render() {
    return (
      <div className="u-flex u-flex-justifyCenter">
        {this.state.loaded ? (
          //pass into flashcard (1) the fact this is a quiz (2) photo info (3) wwrong answers (5) go to next photo function
          this.state.dataSet.length > 0 ? (
            <IndividualFlashcard
              forQuiz={true}
              photoFacts={this.state.dataSet[this.state.onPhoto].photoData}
              wrongAnswers={this.state.dataSet[0].wrongAnswers}
              correctAnswer={this.state.dataSet[this.state.onPhoto].correctAnswer}
              handleClick={this.handleClick}
              handleNext={this.handleNext}
              handleClickonAnswer={this.handleClickonAnswer}
              wasAnswerInput={this.state.wasAnswerInput}
              correctCt={this.state.correctCt}
              incorrectCt={this.state.incorrectCt}
            />
          ) : (
            <p>No photos!</p>
          )
        ) : (
          <p>Loading!</p>
        )}
      </div>
    );
  }
}

export default QuizSelfMade_DS;
