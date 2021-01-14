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
/*from React and Medium websites above*/
  constructor(props){
    super(props);
    this.state = {
      file: null,
      difficulty: 0,
      quality: 0,
      annotations: [],      // get tags locations and info
    }
    this.onTagSubmit = this.onTagSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  /*from Medium website above*/
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }
  /*from React website above*/
  handleSubmit(event) {

    //17:39 this is a messy way to change type to shape_kind
    //for loop from lecture on javascript code
    let annotations_cleaned_up = [] //empty array to populate
    console.log("INIT");
    console.log(annotations_cleaned_up);
    let annot_to_clean = [...this.state.annotations]; //this makes a copy can edit from lecture on Javascript
    
    //change type field to shape_kind field
    //run renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key
    for (let annot_to_add = 0; annot_to_add < this.state.annotations.length; annot_to_add++)
      {
        let new_annot_init = annot_to_clean[annot_to_add];

        //make type shape kind and delete type
        new_annot_init.geometry.shape_kind = new_annot_init.geometry.type;
        delete new_annot_init.geometry.type;

        //add in new annotation
        annotations_cleaned_up.push(new_annot_init);

        //tracer print statements
        //Why is so much being printed out on first run?
        console.log("which iteration?")
        console.log(annot_to_add);
        console.log(annotations_cleaned_up);
      };
      
    //removed the type which cause mongoose errors, many thanks to Johan for 1/13 OH help with this!
    //now set up info for push
    const test_body = {
      caption_text : this.postCaption.current.value, 
      tag_text: this.curTag.current.value,
      photo_placeholder: this.fileInput.current.files[0].name,
      difficulty: this.state.difficulty,
      quality: this.state.quality,
      //taglist: this.state.taglist,
      annotate_test : annotations_cleaned_up //this.state.annotations, //add annotations w/o prototype
      //annotate_test: [{geometry : {x: 1, y : 2}}, {geometry : {x: 3, y : 4}}], //this.state.annotations[0].data.text, 
    };
    post("/api/photo_simple_w_annotate", test_body);
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
    return (
      <form onSubmit={this.handleSubmit}>
        {/* Give a handle for uploading and previewing images */}
        {/* <div className="u-offsetByX">
          <img className="u-showImg" src={this.state.file}/> 
          height = "300" width="300"/> 
        </div> */}
        {/* If there is no image file then do not have anything shown, and when there is an image file it will be able to be tagged */}
        <div className="u-img">
        <ReactAnnotate img_using = {this.state.file} onTagSubmit={this.onTagSubmit} annotationslst={this.state.annotations} />
        </div>
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
          Upload file:
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
        {/* { this.state.file ? 
          (
            <ReactAnnotate img_using = {this.state.file} onTagSubmit={this.onTagSubmit} annotationslst={this.state.annotations} />
          )
          : (<></>)
        } */}
        </div>

        <input type="submit" value="Submit" />        

      </form>
    );
  }
}

export default ImgUpload_1716_try_no_prototype;