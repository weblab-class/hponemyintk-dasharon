import { render } from "react-dom";
import React, { Component } from "react";
import { get, post } from "../../utilities";
// import authentication library
// const auth = require("../../../../server/auth");
import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import IndividualFlashcard from "../modules/IndividualFlashcard.js";

/*
code for rating bar
https://material-ui.com/components/rating/
https://material-ui.com/api/rating/
https://medium.com/@weberzt/creating-a-rating-feature-using-react-js-and-material-ui-f6e18652f602
*/
import FavoriteIcon from "@material-ui/icons/Favorite";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import ReactAnnotate from "../modules/ReactAnnotate.js";
import { useLocation, navigate } from "@reach/router"; //ref https://reach.tech/router/api/useLocation

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class View_Flashcards extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      photo_info_array: [], //this is a photo info array
      userName: "Someone",
      requestingUserId: "User_Requesting",
      requestingUserName: "UserName_Requesting",
      showInNativeLanguage: false,
      //nameForPrint: "SomeoneName",
    };
  }

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
    get("/api/singleUserFind", { checkUserId: this.props.userId }).then((userInfo) => {
      //get info on one user
      console.log(userInfo);
      this.setState({
        userName: userInfo.name, //assume 1 name
      });
      //console.log("USER INFO IS", userInfo);
      //console.log("USER INFO IS", userInfo[0]);
    });

    //Find requesting user
    get("/api/whoami").then((user) => {
      if (user._id) {
        // if they are registed in the database then set
        this.setState({ requestingUserId: user._id, requestingUserName: user.name });
      }
    });

    //Find photos
    console.log("Here in View_Flashcards.js before get request!!!", this.props.onlyOne);
    if (this.props.onlyOne) {
      console.log("Here in View_Flashcards.js before get request!!!1111");
      get("/api/photosimpletestOne", { userId: this.props.userId }).then((ImageInfo_one) => {
        console.log(ImageInfo_one);
        this.setState({
          photo_info_array: [ImageInfo_one],
        });
        this.runFlip(); //flip to start with the language you are learning
      });
    } else {
      console.log("Here in View_Flashcards.js before get request!!!2222");
      get("/api/photosimpletest", { userId: this.props.userId }).then((ImageInfo) => {
        console.log(ImageInfo);
        this.setState({
          photo_info_array: ImageInfo,
        });
        // this.runFlip(); //flip to start with the language you are learning
      });
    }
  };

  // runFlip = () => {
  //       //Flip the tags and printout languages in each annotation for each photo
  //       for (let pp = 0; pp < this.state.photo_info_array.length; pp++) 
  //       {
  //         for (let aa = 0; aa < this.state.photo_info_array[pp].annotation_info_array.length; aa++)
  //         {
  //           const initialTag = this.state.photo_info_array[pp].annotation_info_array[aa].data.text;
  //           const initialText = this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox;
  //           this.state.photo_info_array[pp].annotation_info_array[aa].data.text = initialText;
  //           this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox = initialTag;
  //           console.log("in inner loop");
  //         }
  //       }
  // };

  //post request to delete the relevant photo
  handleDelete = (event) => {
    event.preventDefault();
    //let photoId = photoToDelete._id;
    console.log("DELETE CLICKED");
    console.log(event.target);
    console.log(event.target.value);
    let photoDeleteBody = { deletionId: event.target.value }; //set the request to be for this photo ID
    post("/api/deletePhoto", photoDeleteBody); //run the delete request
    alert("Adios photo! Au revoir! Your photo has been deleted");

    //after deletion, send back to where you were (e.g., if you are on your flashcards page return there, and if you are on the friends page go back there)
    // const pageLocation = this.props.location;
    // console.log(pageLocation);
    // console.log(pageLocation.pathname);
    // navigate(pageLocation.pathname);
    window.location.reload(true); //https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
    //what we do not want to do
    //(this.props.onlyOne) ? (navigate("/Flashcards/"+this.state.requestingUserId)) : (navigate("/Friends"));
    //alert("Delete" + photoToDelete.caption_text_s);
    //event.preventDefault();
  };

  //on click flip to show in either native language or language learning ref https://stackoverflow.com/questions/12772494/how-to-get-opposite-boolean-value-of-variable-in-javascript/12772502
  switchLanguage = (event) => {
    this.setState({showInNativeLanguage : !this.state.showInNativeLanguage});
    // ss
    //Flip the tags and printout languages in each annotation for each photo
    // for (let pp = 0; pp < this.state.photo_info_array.length; pp++) 
    // {
    //   for (let aa = 0; aa < this.state.photo_info_array[pp].annotation_info_array.length; aa++)
    //   {
    //     const initialTag = this.state.photo_info_array[pp].annotation_info_array[aa].data.text;
    //     const initialText = this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox;
    //     this.state.photo_info_array[pp].annotation_info_array[aa].data.text = initialText;
    //     this.state.photo_info_array[pp].annotation_info_array[aa].data.textforBox = initialTag;
    //     console.log("in inner loop");
    //   }
    // }
  };

  //cleans up annotations
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.shape_kind;
    });
    return initAnnotInput;
  };


  //pass as prop to individual flashcard components
  //take in photo id
  //many thanks to Jess, this should delete 1 photo
  deletefromPhotoArray = (photoforDeletion) => {
    this.setState({
      photo_info_array : this.state.photo_info_array.filter((p) => (p._id !== photoforDeletion))
    })
  };

  render() {
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    //if (!this.state.stillLoggedIn) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect with api call because of how prop was given in link
    console.log("ViewFlashCards:::", this.props.userId);
    //let ownCards = null; //will use to see if these are your own cards
    let userNameToShow = ""; //username to display
    {
      this.state.requestingUserId === this.props.userId
        ? (userNameToShow = this.state.userName + " (Me)")
        : (userNameToShow = this.state.userName);
    }
    //If you are the requesting user, show "Me" instead of your name
    //if (this.props.userId === this.state.requestingUserId) {this.setState({ nameForPrint :"Me"} )}else {this.setState({ nameForPrint : this.state.userName} )};
    let langSwitchText = "Show comments and captions in language learning!";
    if (this.state.showInNativeLanguage === false) {langSwitchText = "Show comments and captions in English!"}
    
    return (
      //***Very very important! Try className=center and edit styles in above code for row and column Kyaw had a great find that we could use container to get things a lot cleaner. This isn't yet working but would be a really great thing to get implemented, will commit and try further */
      <div className="u-textCenter" style={{ width: "100%" }}>
        {/* <p className="u-bold">Flashcards!</p> */}
        <br />
    
        <button
                type="button"
                onClick={this.switchLanguage}
                // style={{ border: "none", backgroundColor: "transparent" }}     //no longer need this as now styling with Image_aesthetics.css
              > {langSwitchText}
                {/* <FontAwesomeIcon icon={faTrashAlt} style={{ color: "#0099ff" }} /> */}
                {/* <FontAwesomeIcon icon={faTimesCircle} size="3x" style={{ color: "#0099ff" }} /> */}
                {/* <FontAwesomeIcon icon={faTimes} size="3x" style={{ color: "#0099ff" }} /> */}
                {/* <FontAwesomeIcon icon={["fas", "sign-out-alt"]} fixedWidth /> */}
              </button>

        {console.log("ViewFlashCards:::Printing photo_info_array", this.state.photo_info_array)}

        {/*Establishing whether a user is seeing own flashcards, if so make Me- this is earlier code*/}
        {/* {(this.state.requestingUserId === this.props.userId) ? (<p>****{this.props.userId} req and view</p>) : (<p>****{this.state.requestingUserId} req and {this.props.userId} view</p>)} */}

        {/* {ownCards ? (userNameToShow = this.state.userName + " (Me)") : (userNameToShow = this.state.userName)} */}
        {/* If there is a photo then give info on it. Otherwise have a message saying there is 
      nothing to return. Length ref: https://www.geeksforgeeks.org/how-to-determine-length-or-size-of-an-array-in-java/*/}
        {this.state.photo_info_array ? (
          <>
            {console.log(
              "ViewFlashCards:::Printing photo_placeholder",
              this.state.photo_info_array
            )}
            
            {this.props.onlyOne ? (
              <></>
            ) : (
              <>
              <p className="nametext">{userNameToShow}</p>
              <p className="u-textCenter">
              {this.state.photo_info_array.length} flashcards
                {/* There are {this.state.photo_info_array.length} flashcards for {userNameToShow} */}
                {/*, req by {this.state.requestingUserId} named {this.state.requestingUserName}*/}
              </p>
              </>
            )}
            {/* <p>{this.state.photo_info_array.caption_text_s}</p>
      <p>{this.state.photo_info_array.photo_placeholder}</p> */}
            {/*below uses syntax from Nikhil's GCP example 
            make a new Individual_Flashcard object*/}
            <div>
              {this.state.photo_info_array.map((p) => //ADD ME! eleteFromPhotoarray = {this.RunDeletion}
                <IndividualFlashcard deletionFunction = {this.deletefromPhotoArray} photoFacts={p} ownPhoto={this.state.requestingUserId === this.props.userId} onlyOne = {this.props.onlyOne} hasLooped={false} viewingUserId={this.state.requestingUserId} showInNativeLanguage={this.state.showInNativeLanguage}/>
              )}
            </div>
          </>
        ) : (
          <p>Nothing to return. Please upload!</p>
        )}
      </div>
    );
  }
}
export default View_Flashcards;
