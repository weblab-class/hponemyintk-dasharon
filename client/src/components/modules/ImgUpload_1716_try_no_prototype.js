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
import Typography from "@material-ui/core/Typography";
import ReactAnnotate from "./ReactAnnotate.js";
//import post as in catbook
import { post, get } from "../../utilities.js";
import FavoriteIcon from "@material-ui/icons/Favorite";
import "./Image_aesthetics.css";
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
class ImgUpload_1716_try_no_prototype extends React.Component {
  /*from React and Medium websites above many thanks to Toommy in OH explained removing bind*/
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      difficulty: 0,
      quality: 0,
      annotations: [], // get tags locations and info
      nativeLanguage: "", //what is the user's native language/language in which they want to learn?
      learningLanguage: "", //what language is the user learning?
      nativeLanguagesDetected: [],
      captionText: "",
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
      console.log("SHOULD LOG OUT");
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.languageInfoLoad();
    } else {
      console.log("SHOULD LOG OUT");
    }
  }

  languageInfoLoad = () => {
    get("/api/singleUserFind", { checkUserId: this.props.userId }).then((userLanguageInfo) => {
      this.setState({
        nativeLanguage: userLanguageInfo.nativeLanguage,
        learningLanguage: userLanguageInfo.learningLanguage,
      });
      console.log("Loading language info");
      console.log("User native language", this.state.nativeLanguage);
      console.log("User learns", this.state.learningLanguage);
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
          // console.log("OUTPUT", translatedString.output[1].data),
          // console.log("OUTPUT", translatedString.output[1].translations),
          // console.log("OUTPUT", translatedString.output[1].data.translations[0].translatedText),
          (data.text = data.text + " ⟹ " + translatedString.output[0]),
          //3.5 print out the translation for the user
          alert("translated " + initString + " to " + translatedString.output[0]),
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

            //add language of input tag to list of native languages detected
            //push thod https://www.w3schools.com/jsref/jsref_push.asp
            nativeLanguagesDetected: this.state.nativeLanguagesDetected.concat(
              translatedString.output[1].data.translations[0].detectedSourceLanguage
            ),
          });
        //5 alert that translation worked why can this not accept objects???????
        // alert("Translated" + {} + " to "+ {translatedString})
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
      file: URL.createObjectURL(event.target.files[0]),
      raw_file: event.target.files[0], //raw file for the readImage function to get a data URL
      //file_as_data_url: readImage(event.target.files[0]).then((data_rep) => {return data_rep;}) //clumsy 1st attempt to handle how readImage gives back a promise
    });
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
  /*from React website above*/
  handleSubmit = (event) => {
    // translation package ref https://github.com/franciscop/translate https://www.npmjs.com/package/translate
    // translated_text = translate(this.state.annotations.data.text[0], { to: 'es', engine: 'google', key: process.env.GCP_PRIVATE_KEY});
    //Get the image as a data URL which is a promise. Then set up the schema info and have a post occur, modeled off of Skeleton.js in Nikhil's tutorial linked above
    this.readImage(this.state.raw_file).then((image_as_url) => {
      //prep post request
      //removed the type which cause mongoose errors, many thanks to Johan for 1/13 OH help with this!
      //now set up info for post with the image as data url
      console.log("PostCaption!!!!", this.postCaption.current.value);
      let test_body = {
        caption_text: this.postCaption.current.value,
        //tag_text: this.curTag.current.value,
        photo_placeholder: image_as_url,
        difficulty: this.state.difficulty,
        quality: this.state.quality,
        timestamp: new Date(Date.now()).toLocaleString([], {
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
      if (this.state.annotations.length > 0) {
        test_body.inputLanguageInfo = this.state.nativeLanguagesDetected;
        test_body.translatedLanguage = this.state.learningLanguage;
      } else {
        (test_body.inputLanguageInfo = "No_Language_Used"),
          (test_body.translatedLanguage = "No_Language_Used");
      }
      console.log("INPUT TO POST", test_body);
      //run post request
      post("/api/photo_simple_w_annotate", test_body).then(() => {
        alert(
          "Selected file: " + this.fileInput.current.files[0].name + " has been uploaded! Yay!"
          // + '\nA thought was submitted: "'  + this.postCaption.current.value +'"'
          // + '\nDifficulty is : "'  + this.state.difficulty +'"'
          // + '\nQuality is : "'  + this.state.quality +'"'
        ),
          this.setState({ file: null }),
          (this.postCaption.current.value = ""),
          (this.fileInput.current.value = ""),
          console.log("This is console log in imgupload****");
      });
    });

    event.preventDefault();
    //console.log(this.state.annotations[0].data.text);
    //why is there type and not shape_kind?
    console.log("Printing annotations here:::", this.state.annotations);
    console.log("reached");
    // console.log(translated_text);
    //console.log(annotations_cleaned_up);
  };
  /*from React and Medium websites combined*/
  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    return (
      <form onSubmit={this.handleSubmit}>
        {/* Give a handle for uploading and previewing images */}
        {/* <div className="u-offsetByX">
          <img className="u-showImg" src={this.state.file}/> 
          height = "300" width="300"/> 
        </div> */}
        {/* If there is no image file then do not have anything shown, and when there is an image file it will be able to be tagged */}
        {/* <div className="u-img">
        <ReactAnnotate img_using = {this.state.file} onTagSubmit={this.onTagSubmit} annotationslst={this.state.annotations} />
        </div> */}
        <div className="u-flex u-flex-justifyCenter">
          <div className="postColumn paddedText">
            <p>
              Let's get the learning fun started! Please upload an image and tag it with the word(s)
              you would like to learn. You can tag by clicking and dragging on the image. You will
              need to submit the tag(s) before submitting the image for them to be recorded. You can
              add a caption to share your thoughts on the image, and you should rate the difficulty
              (how hard the tags are) and quality (how helpful the tags are to other learners).{" "}
              <br />
            </p>
            <p className="u-bold">
              Disclaimer: Please note currently all users can see everyone's content given this is
              an early testing version of the website. So please do not share any image or text you
              do not want shared publicly. Also your timestamp of use and name are recorded and
              associated with your image.
              <br />
              <br />
            </p>
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
                <textarea
                  className="imgUpTextArea"
                  rows="5"
                  placeholder="Share your thoughts about the photo with your friends!"
                  ref={this.postCaption}
                />
                <br />
                {/* <Typography component="legend">Difficulty</Typography> */}
                <p>Difficulty</p>
                <Rating
                  precision={0.5}
                  name="difficultyRating"
                  onChange={(event, newvalue) => {
                    this.setState({ difficulty: newvalue });
                  }}
                />
                {/* <Typography component="legend">Quality</Typography> */}
                <p>Quality</p>
                <Rating
                  precision={0.5}
                  // value={this.state.value}
                  name="qualityRating"
                  // onChange={this.updateValue}
                  onChange={(event, newvalue) => {
                    this.setState({ quality: newvalue });
                  }}
                  icon={<FavoriteIcon fontSize="inherit" />}
                />
                <br />
                <input type="submit" value="Submit flashcard!" />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default ImgUpload_1716_try_no_prototype;
