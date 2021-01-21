import React, { Component } from "react";

import * as Survey from "survey-react";

import "survey-react/modern.css";
// import "./index.css";

Survey.StylesManager.applyTheme("modern");

// ref: https://surveyjs.io/Examples/Library?id=survey-quiz&platform=Reactjs&theme=modern

class Quiz extends Component {
  constructor() {
    super();
  }
  render() {
    const json = {
      title: 'This is the current demo of a quiz feature, which we may perhaps implement.',
      showPrevButton: true,
      showProgressBar: "bottom",
      // showTimerPanel: "top",
      // maxTimeToFinishPage: 10,
      // maxTimeToFinish: 25,
      // maxTimeToFinish: 200,
      firstPageIsStarted: true,
      startSurveyText: "Start Quiz",
      pages: [
        {
          questions: [
            {
              type: "html",
              html:
                "Currently, only the text based quizes are available. <br /> We plan to implement photo prompts in the future version, in addition to adding google translate api to facilitate learning languages easier.",
            },
          ],
        },
        {
          questions: [
            {
              type: "radiogroup",
              name: "civilwar",
              title: "When was the Civil War?",
              choices: ["1750-1800", "1800-1850", "1850-1900", "1900-1950", "after 1950"],
              correctAnswer: "1850-1900",
            },
          ],
        },
        {
          questions: [
            {
              type: "radiogroup",
              name: "libertyordeath",
              title: "Who said 'Give me liberty or give me death?'",
              choicesOrder: "random",
              choices: ["John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"],
              correctAnswer: "Patrick Henry",
            },
          ],
        },
        {
          maxTimeToFinish: 15,
          questions: [
            {
              type: "radiogroup",
              name: "magnacarta",
              title: "What is the Magna Carta?",
              choicesOrder: "random",
              choices: [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower",
              ],
              correctAnswer: "The foundation of the British parliamentary system",
            },
          ],
        },
      ],
      completedHtml:
        "<h4>You have answered correctly <b>{correctedAnswers}</b> questions from <b>{questionCount}</b>.</h4>",
    };
    const survey = new Survey.Model(json);

    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return (
      <>
        {/* <Annotation
          src={"https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png"}
          alt="Two pebbles anthropomorphized holding hands"
          // annotations={this.state.annotations}
          type={this.state.type}
          // value={this.state.annotation}
          // onChange={this.onChange_annotations}
          // onSubmit={this.onSubmit_annotations}
          allowTouch
        /> */}

        <Survey.Survey model={survey} />
      </>
    );
  }
}

export default Quiz;
