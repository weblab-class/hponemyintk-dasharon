import React, { Component } from "react";
import "./Image_aesthetics.css";
import "../../utilities.css";
// https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010
import IndividualFlashcard from "./IndividualFlashcard.js";
import MultiColorProgressBar from "../modules/MultiColorProgressBar.js";
import { get, getRandom } from "../../utilities";
import { FlareSharp } from "@material-ui/icons";
const clonedeep = require("lodash.clonedeep");

class QuizSelfMade_DS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      onPhoto: 0,
      isDone: false,
      loaded: false,
      showResult: false,
      // for counting correct/inccorect stat in quiz and progress bar
      wasAnswerInput: false,
      curAnsInfo: [],
      clickedAns: "",
      readings: [
        {
          name: "Correct",
          value: 0,
          percent: 0,
          color: "#5CB85C",
        },
        {
          name: "Incorrect",
          value: 0,
          percent: 0,
          color: "#D9534F",
        },
        {
          name: "Skipped",
          value: 0,
          percent: 0,
          color: "#F0AD4E",
        },
        {
          name: "Unanswered",
          value: 100,
          percent: 100,
          color: "#b9c0c9",
        },
      ],
    };
    // this.handleClick = this.handleClick.bind(this);
  } // end constructor

  //when next is pressed, delete from array so next photo is seen
  //using prop function from quiz component
  handleNext = () => {
    !this.state.wasAnswerInput &&
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value,
        this.state.readings[2].value + 1,
        this.state.readings[3].value - 1
      );
    this.movetoNextPhoto();
    this.setState({ wasAnswerInput: false });
  };

  handleFinish = () => {
    !this.state.wasAnswerInput &&
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value,
        this.state.readings[2].value + 1,
        this.state.readings[3].value - 1
      );
    this.setState({ showResult: true, onPhoto: 0 });
  };

  handleRetake = () => {
    this.updateProgress(
      0,
      0,
      0,
      this.state.readings[0].value +
        this.state.readings[1].value +
        this.state.readings[2].value +
        this.state.readings[3].value
    );
    console.log("In quiz Retake, this.state.readings", this.state.readings);
    this.setState({ isDone: false, showResult: false, wasAnswerInput: false });
  };

  handleNewQuiz = () => {
    // reset all the states before requesting another api call via imageLoad to populate the quiz data
    this.setState({
      dataSet: [],
      onPhoto: 0,
      isDone: false,
      loaded: false,
      showResult: false,
      wasAnswerInput: false,
      curAnsInfo: [],
    });
    this.updateProgress(0, 0, 0, 1);
    this.imageLoad();
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

  // functions to update the progress bar values
  updateProgress = (corCt, incorCt, skipCt, unansCt) => {
    let tmpReadings = clonedeep(this.state.readings);
    tmpReadings[0].value = corCt;
    tmpReadings[1].value = incorCt;
    tmpReadings[2].value = skipCt;
    tmpReadings[3].value = unansCt;
    // update percentages
    tmpReadings[0].percent = (corCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[1].percent = (incorCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[2].percent = (skipCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    tmpReadings[3].percent = (unansCt / (corCt + incorCt + unansCt + skipCt)) * 100;
    this.setState({ readings: tmpReadings });
  };

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
    }
    if (this.state.onPhoto === this.state.dataSet.length - 2) {
      this.setState({ isDone: true });
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
          // https://www.ef.com/wwen/english-resources/english-vocabulary/top-50-nouns/
          const onewordwrongAnswers = [
            "perro",
            "libro",
            "mariposa",
            "semana",
            "reloj",
            "domingo",
            "zona",
            "libro",
            "negocio",
            "caja",
            "niño",
            "empresa",
            "país",
            "día",
            "ojo",
            "hecho",
            "familia",
            "gobierno",
            "grupo",
            "mano",
            "casa",
            "trabajo",
            "vida",
            "lote",
            "hombre",
            "dinero",
            "mes",
            "madre",
            "Señor",
            "noche",
            "número",
            "Vamos",
            "personas",
            "cuadrado",
            "punto",
            "problema",
            "programa",
            "pregunta",
            "derecho",
            "habitación",
            "colegio",
            "estado",
            "historia",
            "estudiante",
            "estudiar",
            "sistema",
            "cosa",
            "hora",
            "agua",
            "camino",
            "semana",
            "mujer",
            "palabra",
            "trabajo",
            "mundo",
            "año",
          ]; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?
          const twowordwrongAnswers = [
            "dos libros",
            "mi amigo",
            "feliz cumpleaños",
            "yo sonrío",
            "Buenos días",
            "hermoso dia",
            "perro impresionante",
            "vida pacifica",
            "deliciosa manzana",
            "increíble cascada",
            "agua refrescante",
            "mango dulce",
            "teléfono inteligente",
            "buen día",
            "buen trabajo",
            "buenas tardes",
          ]; //two word wrong answers, maybe pull three for each
          correctAnswer = correctAnswer.toLowerCase();
          let corAnsLen = correctAnswer.split(" ").length;
          let tmpWrongList = [];
          if (corAnsLen == 1) {
            tmpWrongList = getRandom(onewordwrongAnswers, 3);
          } else {
            tmpWrongList = getRandom(twowordwrongAnswers, 3);
          }
          console.log(
            "tmpWrongList,corAnsLen,correctAnser",
            tmpWrongList,
            corAnsLen,
            correctAnswer
          );

          let questionObject = {
            photoData: newPhotoInfo, //record this photo with only the new 1 annotation- not all
            //annotationtoDisplay: ImageInfo.infoOnPhotos[ii].annotation_info_array[annot], //record this annotation
            correctAnswer: correctAnswer,

            //Maybe add in a check of how many words are in the correct answer, and if there are 1 or 2, randomly select 3 choice from the appropriate array above?

            wrongAnswers: tmpWrongList,
          }; //initial test wrong answers https://www.spanishpod101.com/spanish-word-lists/?page=2 maybe randomly pull 3 for each?

          console.log(questionObject);

          //run concatentation once in each inner for loop
          questionArray = questionArray.concat(questionObject);
        }
        console.log("questionArray", questionArray);
      }

      // Initialize the total unanswered questions stat in readings array for the progress bar
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value,
        this.state.readings[2].value,
        questionArray.length
      );
      console.log("this.state.readings", this.state.readings);

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
    this.setState({
      wasAnswerInput: true,
      curAnsInfo: [ansString.text === corAns, ansString.text],
      clickedAns: ansString.text,
    }); //Color answers by whether or not they are correct
    if (ansString.text === corAns) {
      this.updateProgress(
        this.state.readings[0].value + 1,
        this.state.readings[1].value,
        this.state.readings[2].value,
        this.state.readings[3].value - 1
      );
    } else {
      this.updateProgress(
        this.state.readings[0].value,
        this.state.readings[1].value + 1,
        this.state.readings[2].value,
        this.state.readings[3].value - 1
      );
    }
  };

  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return (
      <>
        {/* check whether we are at the result page already or not */}
        {this.state.showResult ? (
          <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
            <div className="postColumn u-flex-justifyCenter u-flex-alignCenter">
              <img
                src="https://agilites.com/images/news/news-congrads-kkluyshnik-02-04-19.jpg"
                height="auto"
                width="70%"
              />
              <h1 className="u-textCenter">Congrats, you are done with the quiz!!!</h1>
              <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
                <MultiColorProgressBar readings={this.state.readings} />
                <p></p>
              </div>
              <div className="u-flex u-flex-justifyCenter" style={{ width: "100%" }}>
                <button type="button" className="quizEndButton" onClick={this.handleRetake}>
                  Retake the quiz!
                </button>
                <button type="button" className="quizEndButton" onClick={this.handleNewQuiz}>
                  Try another quiz set!
                </button>
                <p></p>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        ) : (
          // if not, show only the progress bar
          <div>
            <div className="u-flex u-flex-justifyCenter">
              <MultiColorProgressBar readings={this.state.readings} />
            </div>
          </div>
        )}
        <div className="u-flex u-flex-justifyCenter">
          {this.state.loaded ? (
            //pass into flashcard (1) the fact this is a quiz (2) photo info (3) wwrong answers (5) go to next photo function
            this.state.dataSet.length > 0 ? (
              !this.state.showResult && (
                <IndividualFlashcard
                  forQuiz={true}
                  photoFacts={this.state.dataSet[this.state.onPhoto].photoData}
                  wrongAnswers={this.state.dataSet[this.state.onPhoto].wrongAnswers}
                  correctAnswer={this.state.dataSet[this.state.onPhoto].correctAnswer}
                  handleClick={this.handleClick}
                  handleNext={this.handleNext}
                  handleFinish={this.handleFinish}
                  wasAnswerInput={this.state.wasAnswerInput}
                  curAnsInfo={this.state.curAnsInfo}
                  isDone={this.state.isDone}
                  clickedAns={this.state.clickedAns}
                />
              )
            ) : (
              <p>No photos!</p>
            )
          ) : (
            <p>Loading!</p>
          )}
        </div>
      </>
    );
  }
}

export default QuizSelfMade_DS;
