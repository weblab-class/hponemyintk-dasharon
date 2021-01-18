/*Small edit to commit. Should double check what is from where, but combines two sources*/

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



import React from 'react';

//
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import ReactAnnotate from "./ReactAnnotate.js"

//import post as in catbook
import { post } from "../../utilities.js";

import FavoriteIcon from '@material-ui/icons/Favorite';
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
// const {Translate} = require('@google-cloud/translate').v2;
// // Creates a client
// const translate = new Translate();

class ImgUpload_1716_try_no_prototype extends React.Component {
/*from React and Medium websites above many thanks to Toommy in OH explained removing bind*/
  constructor(props){
    super(props);
    this.state = {
      file: null,
      difficulty: 0,
      quality: 0,
      annotations: [],      // get tags locations and info
    }
 
    this.fileInput = React.createRef();
    this.curTag = React.createRef();
    this.postCaption = React.createRef(); /*for 2nd inputs*/
  };

  onTagSubmit = (annotation) => {
    const { geometry, data } = annotation

    this.setState({
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random()
        }
      })
    })
    // console.log("Printing annotations here:::", this.state.annotations)     // debug123*** why is this not printing the last tag?
  }

    
  //cleans up annotations- DS edit 1/17 since want to save as shape_kind not type, reverse of View_Flashcards
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.shape_kind = obj.geometry.type;     //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.type;
    })
    return(initAnnotInput);
  }

  /*from Medium website above*/
  handleChange = (event) => {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      raw_file: event.target.files[0] //raw file for the readImage function to get a data URL
      //file_as_data_url: readImage(event.target.files[0]).then((data_rep) => {return data_rep;}) //clumsy 1st attempt to handle how readImage gives back a promise
    })
  }

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
    this.readImage(this.state.raw_file).then(image_as_url => {
    
    //prep post request
    //removed the type which cause mongoose errors, many thanks to Johan for 1/13 OH help with this!
    //now set up info for post with the image as data url
    const test_body = {
      caption_text : this.postCaption.current.value, 
      tag_text: this.curTag.current.value,
      photo_placeholder: image_as_url,
      difficulty: this.state.difficulty,
      quality: this.state.quality,
      timestamp : new Date(Date.now()).toLocaleString(), //record date, from https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
      //taglist: this.state.taglist,
      //DS edit 1/17 to add this
      annotate_test : this.cleanAnnotInput(this.state.annotations) //this.state.annotations, //add annotations w/o prototype
      //annotate_test: [{geometry : {x: 1, y : 2}}, {geometry : {x: 3, y : 4}}], //this.state.annotations[0].data.text, 
    };

    //run post request
    post("/api/photo_simple_w_annotate", test_body);
  })
    alert(
      "Selected file: " + this.fileInput.current.files[0].name 
      + '\nA tag was submitted: "' + this.curTag.current.value +'"'
      + '\nA thought was submitted: "'  + this.postCaption.current.value +'"'
      + '\nDifficulty is : "'  + this.state.difficulty +'"'
      + '\nQuality is : "'  + this.state.quality +'"'
      + '\Taglist is : "'  + this.state.taglist +'"'
    );

    event.preventDefault();
    console.log(this.state.annotations[0].data.text)

    //why is there type and not shape_kind?
    console.log("Printing annotations here:::", this.state.annotations);
    console.log("reached");
    // console.log(translated_text);
    //console.log(annotations_cleaned_up);
    this.setState({file: null});  //try a refresh
  }


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
        <div>

        <div>
        <Typography component="legend">Difficulty</Typography>
          <Rating
            precision={0.5}
            name="difficultyRating"
            onChange={(event,newvalue) => {this.setState({ difficulty: newvalue })}}
          />

        <Typography component="legend">Quality</Typography>
          <Rating
            precision={0.5}
            // value={this.state.value}
            name="qualityRating"
            // onChange={this.updateValue}
            onChange={(event,newvalue) => {this.setState({ quality: newvalue })}}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
      </div>

        </div>
        *Please note currently all users can see everyone's content given this is an early testing version of the website. So please do not share any image or text you do not want shared publicly. Also your timestamp of use and name are recorded and associated with your image.* Upload file:
          <input type="file" ref={this.fileInput} onChange={this.handleChange}/>

        <br />
        {/* Get tag and post info*/}
        Tag:
            <input type="text" ref={this.curTag} />
            Caption:
            <input type="text" ref={this.postCaption} />
        
        <br />
        <div className="u-img"> 
        
        {/* Meant to only have annotating when you uploaded an image */}
        {this.state.file ? 
          (
            <ReactAnnotate allowEdits = {true} img_using = {this.state.file} onTagSubmit={this.onTagSubmit} annotationslst={this.state.annotations} />
          )
          : (<img className="u-showImg" src={this.state.file} height = "300" width="300"/>)
        }
        </div>

        <input type="submit" value="Submit" />        

      </form>
    );
  }
}

export default ImgUpload_1716_try_no_prototype;