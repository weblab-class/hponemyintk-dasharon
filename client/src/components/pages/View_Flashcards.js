import { render } from "react-dom";
import React, { Component } from "react";
import { get, post } from "../../utilities";
// import authentication library
// const auth = require("../../../../server/auth");
import "../../utilities.css";
import "../modules/Image_aesthetics.css";
import IndividualFlashcard from "../modules/IndividualFlashcard.js";
import Loading from "../modules/Loading.js";

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
const clonedeep = require("lodash.clonedeep");

class View_Flashcards extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      photo_info_array: [], //this is a photo info array
      userName: "Someone",
      requestingUserId: "User_Requesting",
      requestingUserName: "UserName_Requesting",
      // showInNativeLanguage: false,
      userLiked: [],
      userCommented: [],
      userDifficultyRated: [],
      //nameForPrint: "SomeoneName",
      filters: {
        // *** Caution!!! be extra careful to set only one of these to true. Otherwise, will only get the first true in the list *** //
        allOwn: true,
        mymostDifficult: false,
        myleastDifficult: false,
        myLiked: false,
        myComments: false,
      },
      loading: true,
      filterLabels: [
        "All user's photos",
        "User rated most difficult",
        "User rated least difficult",
        "User personal favorites",
        "Photos user commented on",
      ],
    };
    //this.filterLabels = ["All my photos", "My rated most difficult", "My rated least difficult", "My personal favorites", "Photos I commented on"];
  }

  componentDidMount() {
    // remember -- api calls go here!, get call adapted from catbook
    //run get request to get first image of the user, will build up to getting images one by
    //one or all on one page
    //onyl make req if logged in
    if (this.props.userId) {
      this.userInfoLoad();
      this.imageLoad();
      // this.setFilters();
      this.filterLabels = this.setFilters(); //update filters
      this.setFilters();
    } else {
      console.log("SHOULD LOG OUT");
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.userInfoLoad();
      this.imageLoad();
      this.filterLabels = this.setFilters(); //update filters
      this.setFilters();
    } else {
      console.log("SHOULD LOG OUT");
    }
  }

  //change filter values
  handleFilters = (event) => {
    event.preventDefault();
    // make a deep copy of the object list, and set all values to false
    let tmpFilters = clonedeep(this.state.filters);
    for (const [key, value] of Object.entries(tmpFilters)) {
      tmpFilters[key] = false;
    }
    tmpFilters[event.target.value] = true;

    this.setState({ filters: tmpFilters }, this.imageLoad);
  };

  //Get user info
  userInfoLoad = () => {
    console.log("calling image load*****");

    //Find user whose photos we are seeing
    get("/api/singleUserFind", { checkUserId: this.props.userId }).then((userInfo) => {
      //get info on one user
      console.log(userInfo.name);
      this.setState(
        {
          userName: userInfo.name, //assume 1 name
          userLiked: userInfo.likeList,
          userCommented: userInfo.commentList,
          userDifficultyRated: userInfo.difficultyList,
        },
        this.setFilters
      );

      //console.log("USER INFO IS", userInfo);
      //console.log("USER INFO IS", userInfo[0]);
    });

    //Find requesting user
    get("/api/whoami").then((user) => {
      if (user._id) {
        // if they are registed in the database then set
        this.setState({ requestingUserId: user._id, requestingUserName: user.name });
        //this.setFilters();
      }
    });
  };

  //Find photos
  imageLoad = async () => {
    for (let filter of Object.keys(this.state.filters)) {
      //all own photos
      //ref: https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
      if (filter === "allOwn" && this.state.filters[filter]) {
        console.log("Here in View_Flashcards.js before get request!!!2222");
        get("/api/photosimpletest", { userId: this.props.userId }).then((ImageInfo) => {
          console.log(ImageInfo);
          return this.setState({
            photo_info_array: ImageInfo,
            loading: false,
          });
          // this.runFlip(); //flip to start with the language you are learning
        });
      }

      //all photos individual user has liked
      if (filter === "myLiked" && this.state.filters[filter]) {
        console.log("Here in View_Flashcards.js before get request!!!2222");
        console.log("STATE", this.state);
        get("/api/photoswithIdsWithTime", {
          idstoGet: this.state.userLiked,
          sortbyTime: true,
        }).then((ImageInfo) => {
          console.log(ImageInfo);
          return this.setState({
            photo_info_array: ImageInfo,
            loading: false,
          });
          // this.runFlip(); //flip to start with the language you are learning
        });
      }

      //all photos individual user has commented on
      if (filter === "myComments" && this.state.filters[filter]) {
        console.log("Here in View_Flashcards.js before get request!!!2222");
        console.log("STATE", this.state);
        get("/api/photoswithIdsWithTime", {
          idstoGet: this.state.userCommented,
          sortbyTime: true,
        }).then((ImageInfo) => {
          console.log(ImageInfo);
          return this.setState({
            photo_info_array: ImageInfo,
            loading: false,
          });
          // this.runFlip(); //flip to start with the language you are learning
        });
      }

      //all photos individual user has rated difficulty for: hardest first
      if (filter === "mymostDifficult" && this.state.filters[filter]) {
        console.log("Here in View_Flashcards.js before get request!!!2222");
        console.log("STATE", this.state);
        //sort array by user difficulty, hardest first ref https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        let newDifficulty = clonedeep(this.state.userDifficultyRated);
        newDifficulty.sort((a, b) => (a.ratingValue > b.ratingValue ? -1 : 1));

        //convert to array of photoIds
        let idsforDifficulty = newDifficulty.map(
          (difficultyEntry) => difficultyEntry.ratingPhotoId
        );
        console.log("new difficulty", newDifficulty);
        console.log("ids for difficulty", idsforDifficulty);

        get("/api/photoswithIdsWithoutTime", {
          idstoGet: idsforDifficulty,
          sortbyTime: false,
        }).then((ImageInfo) => {
          console.log(ImageInfo);
          return this.setState({
            photo_info_array: ImageInfo,
            loading: false,
          });

          // sort by least difficulty
        });
      }

      if (filter === "myleastDifficult" && this.state.filters[filter]) {
        console.log("Here in View_Flashcards.js before get request!!!2222");
        console.log("STATE", this.state);
        //sort array by user difficulty, hardest first ref https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        let newDifficulty = clonedeep(this.state.userDifficultyRated);
        newDifficulty.sort((a, b) => (a.ratingValue > b.ratingValue ? 1 : -1));

        //convert to array of photoIds
        let idsforDifficulty = newDifficulty.map(
          (difficultyEntry) => difficultyEntry.ratingPhotoId
        );
        console.log("new difficulty", newDifficulty);
        console.log("ids for difficulty", idsforDifficulty);

        get("/api/photoswithIdsWithoutTime", {
          idstoGet: idsforDifficulty,
          sortbyTime: false,
        }).then((ImageInfo) => {
          console.log(ImageInfo);
          return this.setState({
            photo_info_array: ImageInfo,
            loading: false,
          });

          // this.runFlip(); //flip to start with the language you are learning
        });
      }
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

  //on click flip to show in either native language or language learning ref https://stackoverflow.com/questions/12772494/how-to-get-opposite-boolean-value-of-variable-in-javascript/12772502
  switchLanguage = (event) => {
    this.setState({ showInNativeLanguage: !this.state.showInNativeLanguage });
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
      photo_info_array: this.state.photo_info_array.filter((p) => p._id !== photoforDeletion),
    });
  };

  //pass as prop to individual flashcard components
  //take in photoid and rating and update difficulty rating
  updateDifficulty = (difficultyRating, phototoEdit) => {
    console.log("difficulty", difficultyRating, "for", phototoEdit._id);
    post("/api/difficultyRating", {
      difficultyRating: difficultyRating,
      photoId: phototoEdit._id,
    }).then((photoUpdated) => {
      let newPhotoArray = clonedeep(this.state.photo_info_array);
      for (let pp = 0; pp < newPhotoArray.length; pp++) {
        if (newPhotoArray[pp]._id === phototoEdit._id) {
          //when find the array entry fixed, set it to be the revised entry
          newPhotoArray[pp] = photoUpdated;
          newPhotoArray[pp].photo_placeholder = this.state.photo_info_array[pp].photo_placeholder; //fix photo placeholder so don't repeat mongoose call
          console.log("UPDATED", newPhotoArray[pp]._id, "ENTRY", pp);
        }
      }
      this.setState({ photo_info_array: newPhotoArray });
    });
  };

  //pass as prop to individual flashcard components
  //take in photoid and rating and whether the user wants to like or unlike, and updates the likes
  updateLikes = (phototoEdit, liking) => {
    console.log("NEED TO LIKE?", liking);
    console.log("NEED TO UNLIKE?", !liking);
    post("/api/likingRating", { photoId: phototoEdit._id, addLike: liking }).then(
      (photoUpdated) => {
        let newPhotoArray = clonedeep(this.state.photo_info_array); //copy of array
        for (let pp = 0; pp < newPhotoArray.length; pp++) {
          if (newPhotoArray[pp]._id === phototoEdit._id) {
            //when find the array entry fixed, set it to be the revised entry
            newPhotoArray[pp] = photoUpdated;
            newPhotoArray[pp].photo_placeholder = this.state.photo_info_array[pp].photo_placeholder; //fix photo placeholder so don't repeat mongoose call
            console.log("UPDATED", newPhotoArray[pp]._id, "ENTRY", pp);
          }
        }
        this.setState({ photo_info_array: newPhotoArray });
      }
    );
  };

  //update filters
  setFilters = () => {
    let filterLabels = [];
    if (this.state.requestingUserId === this.props.userId) {
      filterLabels = [
        "All my photos",
        "My rated most difficult",
        "My rated least difficult",
        "My personal favorites",
        "Photos I commented on",
      ];
      console.log("SETTING FILTERS");
    } else {
      filterLabels = [
        "All " + this.state.userName + "'s photos",
        this.state.userName + "'s rated most difficult",
        this.state.userName + "'s rated least difficult",
        this.state.userName + "'s personal favorites",
        "Photos " + this.state.userName + " commented on",
      ];
    }
    this.setState({ filterLabels: filterLabels });
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

    // let filterLabels = [];
    // if (this.state.requestingUserId === this.props.userId) {
    //   filterLabels = ["All my photos", "My rated most difficult", "My rated least difficult", "My personal favorites", "Photos I commented on"];
    //   console.log("SETTING FILTERS");
    // } else {
    //   filterLabels = ["All " + this.state.userName +"'s photos", this.state.userName +"'s rated most difficult", this.state.userName +"'s rated least difficult", this.state.userName +"'s personal favorites", "Photos " + this.state.userName + " commented on"];
    // }
    // this.setState({filterLabels : filterLabels})

    //If you are the requesting user, show "Me" instead of your name
    //if (this.props.userId === this.state.requestingUserId) {this.setState({ nameForPrint :"Me"} )}else {this.setState({ nameForPrint : this.state.userName} )};
    // let langSwitchText = "Show comments and captions in language learning!";
    // if (this.state.showInNativeLanguage === false) {langSwitchText = "Show comments and captions in English!"}

    return this.state.loading ? (
      <Loading />
    ) : (
      //***Very very important! Try className=center and edit styles in above code for row and column Kyaw had a great find that we could use container to get things a lot cleaner. This isn't yet working but would be a really great thing to get implemented, will commit and try further */
      <div className="u-textCenter" style={{ width: "100%" }}>
        {/* <p className="u-bold">Flashcards!</p> */}
        <br />

        <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
          <label for="imgFilter">Which image filters do you want?</label>
          <br />
          <select onChange={this.handleFilters} id="imgFilter">
            {console.log(Object.keys(this.state.filters))}
            {Object.keys(this.state.filters).map((ff, ii) => (
              <option value={ff} key={ii + ff}>
                {this.state.filterLabels[ii]}
              </option>
            ))}
          </select>
        </div>
        {/*<button
                type="button"
                onClick={this.switchLanguage}
                // style={{ border: "none", backgroundColor: "transparent" }}     //no longer need this as now styling with Image_aesthetics.css
              > {langSwitchText}
                {/* <FontAwesomeIcon icon={faTrashAlt} style={{ color: "#0099ff" }} /> */}
        {/* <FontAwesomeIcon icon={faTimesCircle} size="3x" style={{ color: "#0099ff" }} /> */}
        {/* <FontAwesomeIcon icon={faTimes} size="3x" style={{ color: "#0099ff" }} /> */}
        {/* <FontAwesomeIcon icon={["fas", "sign-out-alt"]} fixedWidth /> */}
        {/*</button>*/}

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

            <>
              <p className="nametext">{userNameToShow}</p>
              <p className="u-textCenter">
                {this.state.photo_info_array.length} flashcards
                {/* There are {this.state.photo_info_array.length} flashcards for {userNameToShow} */}
                {/*, req by {this.state.requestingUserId} named {this.state.requestingUserName}*/}
              </p>
            </>

            {/* <p>{this.state.photo_info_array.caption_text_s}</p>
      <p>{this.state.photo_info_array.photo_placeholder}</p> */}
            {/*below uses syntax from Nikhil's GCP example 
            make a new Individual_Flashcard object*/}
            <div>
              {this.state.photo_info_array.map((
                p //ADD ME! eleteFromPhotoarray = {this.RunDeletion}
              ) => (
                <IndividualFlashcard
                  key={p._id}
                  deletionFunction={this.deletefromPhotoArray}
                  photoFacts={p}
                  ownPhoto={this.state.requestingUserId === p.uid}
                  onlyOne={false}
                  hasLooped={false}
                  viewingUserId={this.state.requestingUserId}
                  updateDifficulty={this.updateDifficulty}
                  updateLikes={this.updateLikes}
                />
              ))}
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
