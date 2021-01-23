import React, { Component } from "react";
import "./Image_aesthetics.css";
import "../../utilities.css";
// https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010
import IndividualFlashcard from "./IndividualFlashcard.js";
import { get } from "../../utilities";

class QuizSelfMade_DS extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSet : [],
    onPhoto: 0,
    looped: false,
    loaded: false}
    //this.handleClick = this.handleClick.bind(this);
  } // end constructor

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
    console.log("starting movetonextphoto")
    if (this.state.onPhoto < 3) {
      this.setState({onPhoto : this.state.onPhoto + 1})
    }
    else {
      this.setState({onPhoto : 0, looped : true})
    };
    console.log("CHANGING ON PHOTO TO", this.state.onPhoto)
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
        let questionArray = []
        for (let i = 0; i < ImageInfo.infoOnPhotos.length; i++)
        {
          let questionObject = {photoData : ImageInfo.infoOnPhotos[i],
                            wrongAnswers : ["wrong1", "wrong2", "wrong3"]};
                            console.log(questionObject);
          questionArray = questionArray.concat(questionObject);
        }
        console.log("question array", questionArray);
      this.setState({
        dataSet: questionArray,
        loaded : true
      });
      });
    };

  handleClick(choice) {
    if (choice == this.state.dataSet[this.state.current].correct) {
      this.setState({ correct: this.state.correct + 1 });
    } else {
      this.setState({ incorrect: this.state.incorrect + 1 });
    }

    if (this.state.current == 9) {
      this.setState({ current: 0 });
      this.setState({ incorrect: 0 });
      this.setState({ correct: 0 });
    } else {
      this.setState({ current: this.state.current + 1 });
    }
  }

  render() {
    return (
      <div className="u-flex u-flex-justifyCenter">
          {this.state.loaded? 
          ((this.state.dataSet.length > 0) ? 
          (<IndividualFlashcard forQuiz ={true} photoFacts = {this.state.dataSet[this.state.onPhoto].photoData} wrongAnswers = {this.state.dataSet[0].wrongAnswers} movetoNextPhoto = {this.movetoNextPhoto} hasLooped={this.state.looped}/>): (<p>No photos!</p>)) : (<p>Loading!</p>)}
      </div>
    );
  }
}

function Question(props) {
  var style = {
    color: "red",
  };
  return <h1 style={style}>{props.dataSet.question}</h1>;
}

function Answer(props) {
  var style = {
    width: "100%",
    height: 50,
    color: "blue",
  };
  return (
    <div>
      <button style={style} onClick={() => props.handleClick(props.choice)}>
        {props.answer}
      </button>
    </div>
  );
}

function AnswerList(props) {
  var answers = [];
  for (let i = 0; i < props.dataSet.answers.length; i++) {
    answers.push(
      <Answer choice={i} handleClick={props.handleClick} answer={props.dataSet.answers[i]} />
    );
  }
  return <div>{answers}</div>;
}

function QuizArea(props) {
  var style = {
    width: "25%",
    display: "block",
    textAlign: "center",
    boxSizing: "border-box",
    float: "left",
    padding: "0 2em",
  };
  return (
    <div style={style}>
      <Question dataSet={props.dataSet} />
      <AnswerList dataSet={props.dataSet} handleClick={props.handleClick} />
    </div>
  );
}

function TotalCorrect(props) {
  var style = {
    display: "inline-block",
    padding: "1em",
    background: "#eee",
    margin: "0 1em 0 0",
  };
  return <h2 style={style}>Correct: {props.correct}</h2>;
}

function TotalIncorrect(props) {
  var style = {
    display: "inline-block",
    padding: "1em",
    background: "#eee",
    margin: "0 0 0 1em",
  };
  return <h2 style={style}>Incorrect: {props.incorrect}</h2>;
}

function ScoreArea(props) {
  var style = {
    width: "100%",
    display: "block",
    textAlign: "left",
    float: "left",
    padding: "2em",
  };
  return (
    <div style={style}>
      <TotalCorrect correct={props.correct} />
      <TotalIncorrect incorrect={props.incorrect} />
    </div>
  );
}

export default QuizSelfMade_DS;
