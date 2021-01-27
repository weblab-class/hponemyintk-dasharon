/*Should double check what is from where, but combines two sources*/
/*Medium code for a preview: WORKING*/
/*From https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa*/
/*Adding on https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag code for upload*/
/*Previously consulted https://www.webtrickshome.com/faq/how-to-display-uploaded-image-in-html-using-javascript-->*/
/*And obtained this code from https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag*/
/*Code to get and show name
From https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag
*/
/*
code for rating bar
https://material-ui.com/components/rating/
https://material-ui.com/api/rating/
https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/
import React from "react";
//
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactAnnotate from "./ReactAnnotate.js";
//import post as in catbook
import { post, get } from "../../utilities.js";
import FavoriteIcon from "@material-ui/icons/Favorite";
import HelpIcon from "@material-ui/icons/Help";
//import Demo from "./Demo.js";
// import ModalInput from "./ModalInput.js";
// import ModalExampleReactStrap from "./ModalExampleReactStrap.js";
// import Modal from 'react-bootstrap/Modal'; //ref https://react-bootstrap.github.io/components/modal/
// import ReactModal from 'react-modal'; //ref https://reactcommunity.org/react-modal/
import "./Image_aesthetics.css";
// import Button from 'react-bootstrap/Button'

//ref https://material-ui.com/components/dialogs/ https://material-ui.com/api/dialog/
import Dialog from "@material-ui/core/Dialog";

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { faTrashAlt, faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";

// import translate from 'translate';    //ref translation tlibrary
// require('dotenv').config();
// // Code from Nikhil's https://github.com/weblab-workshops/gcp-example - comments below from Nikhil
// // NOTE: this file is incomplete. Eventually I'll add a function to modify an existing
// // file, but this is a pretty uncommon application in my experience, so I'll do it later.
// //Use Nikhil's storageTalk.js code to get the Google credentials
// const { Storage } = require('@google-cloud/storage');
// // TODO: replace this projectId with your own GCP project id!
//  const storageInfo = { projectId: "angelic-cat-301602" };
//  if (process.env.GCP_PRIVATE_KEY && process.env.GCP_CLIENT_EMAIL) {
//      storageInfo.credentials = { private_key: process.env.GCP_PRIVATE_KEY, client_email: process.env.GCP_CLIENT_EMAIL };
//  }
// const storage = new Storage(storageInfo);
// // TODO: replace this bucket name with your own bucket inside your project
// const bucket = storage.bucket('weworld2021');
// //translation imports https://cloud.google.com/translate/docs/basic/quickstart
// const { Translate } = require("@google-cloud/translate").v2;
// // Creates a client
// const translate = new Translate();

const StyledRating = withStyles({
  iconFilled: {
    color: "#0099ff",
  },
  iconHover: {
    color: "#0099ff",
  },
})(Rating);

class ImgUpload_1716_try_no_prototype extends React.Component {
  /*from React and Medium websites above many thanks to Toommy in OH explained removing bind*/
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      difficulty: 0,
      annotations: [], // get tags locations and info
      nativeLanguage: "", //what is the user's native language/language in which they want to learn?
      learningLanguage: "", //what language is the user learning?
      nativeLanguagesDetected: [],
      submittedCaption: false, //if a caption has been translated on this upload page
      translatedCaption: "", //translation of caption
      originalCaption: "", //original caption
      raw_file: null,
      oldCaption: "", //old caption for editing
      neverUploaded: true, //if a user never uplaoded a file
      likedPhoto: false, //if photo was liked
      usersLiking: [], //list with creator who liked photo
      likeCount: 0, //count of likes
      userName: "", //username
    };
    this.fileInput = React.createRef();
    this.postCaption = React.createRef(); /*for 2nd inputs*/
  }

  //get language preference user has currently set
  componentDidMount() {
    // remember -- api calls go here!, get call adapted from catbook
    //run get request to get first image of the user, will build up to getting images one by
    //one or all on one page
    //onyl make req if logged in
    if (this.props.userId) {
      this.languageInfoLoad();
    } else {
      //console.log("SHOULD LOG OUT");
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.languageInfoLoad();
    } else {
      //console.log("SHOULD LOG OUT");
    }
  }

  languageInfoLoad = () => {
    get("/api/singleUserFind", { checkUserId: this.props.userId }).then((userLanguageInfo) => {
      this.setState({
        nativeLanguage: userLanguageInfo.nativeLanguage,
        learningLanguage: userLanguageInfo.learningLanguage,
        userName: userLanguageInfo.name,
      });
      //console.log("Loading language info");
      //console.log("User native language", this.state.nativeLanguage);
      //console.log("User learns", this.state.learningLanguage);
    });
  };

  //when a tag is submitted translate the input string
  onTagSubmit = (annotation) => {
    let { geometry, data } = annotation; //1 get initial annotation and the text of it
    console.log("TRANSLATION STRING", data.text);
    const initString = data.text;
    //2 translate the input string, have as a promise- many thanks Nikhil for help! {translationString : data.text, translationLanguage : "es"}
    post("/api/translation", {
      translationInput: data.text,
      userNativeLanguage: this.state.nativeLanguage,
      userTranslationLanguage: this.state.learningLanguage,
    }).then((translatedString) =>
      //3 get the translated string back from the API and update the data text field so the translation is stored
      {
        console.log("OUTPUT", translatedString.output),
          //consulted https://cloud.google.com/translate/docs/basic/quickstart
          console.log("OUTPUT", translatedString.output[0]),
          console.log(
            "OUTPUT WAS IN",
            translatedString.output[1].data.translations[0].detectedSourceLanguage
          ),
          (data.text = translatedString.output[0]), //set translated word to be in tag
          (data.textforBox = initString), //set original word to be in box
          //3.5 print out the translation for the user
          (data.nativeLanguageTag = initString), //also store native and learning language tags explicitly for flipping
          (data.learningLanguageTag = translatedString.output[0]);

        console.log("TRANSLATED", data.text),
          //4 set state of annotations
          this.setState({
            annotations: this.state.annotations.concat({
              geometry,
              data: {
                ...data,
                id: Math.random(),
              },
            }),

            //add language of input tag to list of native languages detected ref push thod https://www.w3schools.com/jsref/jsref_push.asp
            nativeLanguagesDetected: this.state.nativeLanguagesDetected.concat(
              translatedString.output[1].data.translations[0].detectedSourceLanguage
            ),
          });
        console.log("NEW OBJECT", data);
      }
    );
    // console.log("Printing annotations here:::", this.state.annotations)     // debug123*** why is this not printing the last tag?
  };
  //cleans up annotations- DS edit 1/17 since want to save as shape_kind not type, reverse of View_Flashcards
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.shape_kind = obj.geometry.type; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.type;
    });
    return initAnnotInput;
  };
  /*from Medium website above*/
  handleChange = (event) => {
    this.setState({
      annotations: [],
      neverUploaded: false,
      file: URL.createObjectURL(event.target.files[0]),
      raw_file: event.target.files[0], //raw file for the readImage function to get a data URL
      //file_as_data_url: readImage(event.target.files[0]).then((data_rep) => {return data_rep;}) //clumsy 1st attempt to handle how readImage gives back a promise
    });

    //if already submitted caption reset
    if (this.state.submittedCaption) {
      this.setState({
        // submittedCaption : false,
        // translatedCaption: "",
        // originalCaption: "",
        annotations: [],
        // oldCaption: "",
      });
    }
  };
  //From Nikhil GCP tutorial, to get to image that can be saved, with many thanks!
  //(https://github.com/weblab-workshops/gcp-example/tree/main/server)
  readImage = (blob) => {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => {
        if (r.error) {
          reject(r.error.message);
          return;
        } else if (r.result.length < 50) {
          // too short. probably just failed to read, or ridiculously small image
          reject("small image? or truncated response");
          return;
        } else if (!r.result.startsWith("data:image/")) {
          reject("not an image!");
          return;
        } else {
          resolve(r.result);
        }
      };
      r.readAsDataURL(blob);
    });
  };

  submitCaption = (event) => {
    //Preserve initial caption
    const originalLanguageCaption = this.postCaption.current.value;
    post("/api/translation", {
      //run post request to translate
      translationInput: originalLanguageCaption,
      userNativeLanguage: this.state.nativeLanguage,
      userTranslationLanguage: this.state.learningLanguage,
    }).then((translatedString) => {
      //save translation
      this.setState({
        translatedCaption: translatedString.output[0],
        submittedCaption: true,
        originalCaption: originalLanguageCaption,
      }),
        console.log(translatedString.output[0]);
    });
  };

  //If you want to edit the caption go back and edit
  //keep current value of post to the original caption for ease
  editCaption = (event) => {
    this.setState({
      oldCaption: this.state.originalCaption, //set old caption to be original for purposes of pre-populating the form
      submittedCaption: false,
      translatedCaption: "",
      originalCaption: "",
    });
  };

  //reflect if liked photo
  handleLike = (event) => {
    this.setState({
      likedPhoto: true,
      usersLiking: [{ likingUserId: this.props.userId, likingUserName: this.props.userName }],
      likeCount: 1,
    });
  };

  handleUnLike = (event) => {
    this.setState({
      likedPhoto: false,
      usersLiking: [],
      likeCount: 0,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    //submit caption if haven't yet, and it will get translated and then submit
    if (!this.state.submittedCaption) {
      const originalLanguageCaption = this.postCaption.current.value;
      post("/api/translation", {
        //run post request to translate
        translationInput: originalLanguageCaption,
        userNativeLanguage: this.state.nativeLanguage,
        userTranslationLanguage: this.state.learningLanguage,
      }).then((translatedString) => {
        //save translation
        this.setState({
          translatedCaption: translatedString.output[0],
          submittedCaption: true,
          originalCaption: originalLanguageCaption,
        }),
          console.log(translatedString.output[0]);
        console.log("STATE BEFORE SUSBMIT", this.state);
        this.runSubmit();
      });
    } else {
      this.runSubmit();
    }
  };

  /*from React website above*/
  runSubmit = () => {
    console.log("STATE IN SUBMIT", this.state);

    //get count of difficulty ratings- did the user rate or not?
    let difficultyRatingArray = [];
    if (this.state.difficulty > 0) {
      let difficultyRatingObject = {
        ratingUserId: this.props.userId,
        ratingValue: this.state.difficulty,
      };
      difficultyRatingArray = difficultyRatingArray.concat(difficultyRatingObject); //stores ratings and who rated
    } else {
      difficultyRatingArray = [];
    }

    //check if this is good for quiz
    //does any annotation have fewer than 3 words?
    let goodforQuiz = false;
    for (let aa = 0; aa < this.state.annotations.length; aa++) {
      //check word count ref https://stackoverflow.com/questions/18679576/counting-words-in-string/30335883
      if (this.state.annotations[aa].data.learningLanguageTag.split(" ").length < 3) {
        goodforQuiz = true;
      }
    }

    const submitTime = Date.now(); //set submit time
    // translation package ref https://github.com/franciscop/translate https://www.npmjs.com/package/translate
    // translated_text = translate(this.state.annotations.data.text[0], { to: 'es', engine: 'google', key: process.env.GCP_PRIVATE_KEY});
    //Get the image as a data URL which is a promise. Then set up the schema info and have a post occur, modeled off of Skeleton.js in Nikhil's tutorial linked above
    this.readImage(this.state.raw_file).then((image_as_url) => {
      //prep post request
      //removed the type which cause mongoose errors, many thanks to Johan for 1/13 OH help with this!
      //now set up info for post with the image as data url
      // console.log("PostCaption!!!!", this.postCaption.current.value);s
      let test_body = {
        caption_text_original: this.state.originalCaption,
        caption_text_translated: this.state.translatedCaption,
        //tag_text: this.curTag.current.value,
        photo_placeholder: image_as_url, //image
        difficulty: this.state.difficulty, //average difficulty
        difficultyRatingArray: difficultyRatingArray, //difficulty ratings and who rated
        usersLikingArray: this.state.usersLiking, //which users like this?
        likeCount: this.state.likeCount,
        goodforQuiz: goodforQuiz, //checks if good for quiz
        timestampRaw: submitTime, //this is not easily readable but is sortable
        timestamp: new Date(Date.now()).toLocaleString([], {
          //this is as not easily sortable but is readable
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }), //record date, from https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i, https://stackoverflow.com/questions/17913681/how-do-i-use-tolocaletimestring-without-displaying-seconds
        //taglist: this.state.taglist,
        //DS edit 1/17 to add this
        annotate_test: this.cleanAnnotInput(this.state.annotations), //this.state.annotations, //add annotations w/o prototype
        //annotate_test: [{geometry : {x: 1, y : 2}}, {geometry : {x: 3, y : 4}}], //this.state.annotations[0].data.text,
      };
      console.log("After test_body*");

      //If there are tags (length of annotations list > 0), record the tag input language(s) and the language you are translating to
      //ref https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
      //Otherwise set these to be strings saying there are no tags

      test_body.inputLanguageInfo = this.state.nativeLanguagesDetected;
      test_body.translatedLanguage = this.state.learningLanguage;

      //console.log("INPUT TO POST", test_body);
      //run post request
      post("/api/photo_simple_w_annotate", test_body).then(() => {
        alert(
          "Selected file: " + this.fileInput.current.files[0].name + " has been uploaded! Congratulations/Felicidades!");
        //   // + '\nA thought was submitted: "'  + this.postCaption.current.value +'"'
        //   // + '\nDifficulty is : "'  + this.state.difficulty +'"'
        //   // + '\nQuality is : "'  + this.state.quality +'"'
        // ),
        
          // (<Demo/>)
          this.setState({
            file: null,
            submittedCaption: false,
            originalCaption: "",
            translatedCaption: "",
            difficulty: 0, //reset difficulty to 0
            likedPhoto: false, //if photo was liked
            usersLiking: [], //list with creator who liked photo
            likeCount: 0, //reset likes to 0
          }),
          (this.postCaption.current.value = ""),
          (this.fileInput.current.value = ""),
          console.log("This is console log in imgupload****");
      });
    });

    //console.log(this.state.annotations[0].data.text);
    //why is there type and not shape_kind?
    //console.log("Printing annotations here:::", this.state.annotations);
    //console.log("reached");
    // console.log(translated_text);
    //console.log(annotations_cleaned_up);
  };
  /*from React and Medium websites combined*/
  render() {
    //Chatbook login protection
    //console.log("CAPTION?", this.state.submittedCaption);
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return (
      // <form onSubmit={this.handleSubmit}>
      // {/* Give a handle for uploading and previewing images */}
      // {/* <div className="u-offsetByX">
      //   <img className="u-showImg" src={this.state.file}/>
      //   height = "300" width="300"/>
      // </div> */}
      // {/* If there is no image file then do not have anything shown, and when there is an image file it will be able to be tagged */}
      // {/* <div className="u-img">
      // <ReactAnnotate img_using = {this.state.file} onTagSubmit={this.onTagSubmit} annotationslst={this.state.annotations} />
      // </div> */}
      <div className="u-flex u-flex-justifyCenter">
        
        <div className="postColumn paddedText" style={{ position: "relative" }}>
        {/* <ReactModal

isOpen={
  true}><p>test modal</p></ReactModal> */}
  
          <p>
            Let's get the learning fun started! Please upload an image and submit tags describing the word(s)
            you would like to learn in the images, and then add a caption describing your thoughts on the image. You can tag by clicking and dragging on the image. You can rate the difficulty of the image and like it. Please note any image uploaded is ppublicly available to any user. <br />
          </p>

            <br />
            <br />
          Upload file:
          {/*only jpg or png allowed https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
            Other files should be grayed out*/}
          <div>
            <input
              type="file"
              ref={this.fileInput}
              accept=".png,.jpg,.jpeg"
              onChange={this.handleChange}
            />
          </div>
          <div className="u-flex u-flex-justifyCenter u-flex-alignCenter">
            <div className="imgUpLeft">
              {/* Meant to only have annotating when you uploaded an image */}
              {this.state.file ? (
                <ReactAnnotate
                  allowEdits={true}
                  img_using={this.state.file}
                  onTagSubmit={this.onTagSubmit}
                  annotationslst={this.state.annotations}
                />
              ) : (
                // <img className="u-showImg" src={this.state.file} alt="Please upload!" height="300" width="300" />
                <p className="uploadText">Please Upload!</p>
              )}
            </div>
            <div className="imgUpRight">
              <br />
              {/* Get caption and post info https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea*/}
              Caption:
              {/* <input type="text" ref={this.postCaption} /> */}
              {/*if caption not submitted, show box. Otherwise show translated caption and give a chance to edit
                  ref https://stackoverflow.com/questions/4055199/html-how-to-pre-populate-form-field-with-known-value-upon-load/4055233*/}
              {!this.state.submittedCaption ? (
                this.state.oldCaption === "" ? (
                  //If never edited show a blank text box
                  <>
                    <textarea
                      className="imgUpTextArea"
                      rows="5"
                      placeholder="Share your thoughts about the photo with your friends!!!"
                      ref={this.postCaption}
                    />
                    <button  onClick={this.submitCaption}>Translate now please!</button>
                    <br />
                  </>
                ) : (
                  <>
                    <textarea
                      className="imgUpTextArea"
                      rows="5"
                      defaultValue={this.state.oldCaption}
                      ref={this.postCaption}
                    />
                    <button onClick={this.submitCaption}>Translate now please!</button>
                    <br />
                  </>
                )
              ) : (
                //If submittedd show the translation and an edit button
                <div>
                  {"'" +
                    this.state.originalCaption +
                    "' translated to '" +
                    this.state.translatedCaption +
                    "'"}
                  <button type="button" className="button">
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      style={{ color: "#0099ff" }}
                      onClick={this.editCaption}
                    />
                  </button>
                </div>
              )}
              {/* <Typography component="legend">Difficulty</Typography> */}
              <p>Difficulty:</p>
              <StyledRating
                precision={1.0}
                name="difficultyRating"
                value={this.state.difficulty}
                icon={<HelpIcon fontSize="inherit" />}
                onChange={(event, newvalue) => {
                  this.setState({ difficulty: newvalue });
                }}
              />
              {/*Handle likes with a button click */}
              {this.state.likedPhoto ? (
                <>
                  <p>You like the photo</p>
                  <button onClick={this.handleUnLike}>Unlike</button>
                </>
              ) : (
                <button onClick={this.handleLike}>Like</button>
              )}
              {/* <Typography component="legend">Quality</Typography> */}
              <div>
                <p></p>
              </div>
              <br />
              {/* <input type="submit">
                  <FontAwesomeIcon icon={faTrashAlt} style={{ color: "#0099ff" }} />
                </input> */}
              {/*only have save button if never uploaded */}
            </div>
          </div>
          {this.state.neverUploaded ? (
            <>
              <button
                type="button"
                title="Attached a picture first to enable this upload button!"
                className="disabledButton saveIcon"
                disabled
              >
                <FontAwesomeIcon icon={faSave} style={{ color: "#0099ff" }} />
              </button>
            </>
          ) : (
            <button
              type="button"
              title="Save your image with tags in the cloud!"
              className="button saveIcon"
            >
              <FontAwesomeIcon
                icon={faSave}
                style={{ color: "#0099ff" }}
                onClick={this.handleSubmit}
              />
            </button>
          )}
          {/* <Modal open={true} show={true}><p>Test Modal</p></Modal>  */}
          {/* ref https://stackoverflow.com/questions/44979037/opening-a-modal-with-the-click-of-a-button  */}
        </div>
      </div>
      // {/* </form> */}
    );
  }
}
export default ImgUpload_1716_try_no_prototype;
