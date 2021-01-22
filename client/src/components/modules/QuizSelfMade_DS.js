import React, { Component } from "react";
import "./Image_aesthetics.css";
import "../../utilities.css";
// https://codepen.io/dvdmoon/pen/xNmKLj?editors=0010
import IndividualFlashcard from "./IndividualFlashcard.js";
import { get } from "../../utilities";

class QuizSelfMade_DS extends Component {
  constructor(props) {
    super(props);

    

    this.state = { dataSet : [] };
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
  deletefromPhotoArray = (photoforDeletion) => {
    this.setState({
      photo_info_array : this.state.dataSet.filter((p) => (p._id !== photoforDeletion))
    })
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
      });
      });
    }

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
        <div className="postColumn">
          {(this.state.dataSet.length > 0)? 
          (<IndividualFlashcard forQuiz ={true} photoFacts = {this.state.dataSet[0].photoData} wrongAnswers = {this.state.dataSet[0].wrongAnswers}/>): (<p>All Done!</p>)
          }
          {console.log(this.state.dataSet)}
        </div>
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
