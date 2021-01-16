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

import React from 'react';

//
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import ReactAnnotate from "./ReactAnnotate.js"

//import post as in catbook
import { post } from "../../utilities";

import FavoriteIcon from '@material-ui/icons/Favorite';

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

    
  //cleans up annotations
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.type = obj.geometry.shape_kind     //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.shape_kind
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
      annotate_test : cleanAnnotInput(this.state.annotations) //this.state.annotations, //add annotations w/o prototype
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
    console.log("Printing annotations here:::", this.state.annotations)
    console.log("reached");
    console.log(annotations_cleaned_up);
    this.setState({file: null});  //try a refresh
  }


  /*from React and Medium websites combined*/
  render() {
    //Chatbook login protection
    if (!this.props.uid) return <div>Goodbye! Thank you for using Weworld.</div>;

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