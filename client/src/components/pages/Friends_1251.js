import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get, post } from "../../utilities";
// import UserInfo from "../modules/UserInfo.js";
import { Link } from "@reach/router";
import View_Flashcards from "../pages/View_Flashcards.js";
import IndividualFlashcard from "../modules/IndividualFlashcard.js";
import Loading from "../modules/Loading.js";
const clonedeep = require("lodash.clonedeep");

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      allUserList: [], //set initial user list to be empty
      allPhotos: [],
      // showInNativeLanguage: false,
      haveSwitched: false,
      filters: {
        // *** Caution!!! be extra careful to set only one of these to true. Otherwise, will only get the first true in the list *** //
        getOneFromAll: true,
        mostDifficult: false,
        leastDifficult: false,
        mostLiked: false,
        mostCommented: false
      },
      loading: true
    };
    this.filterLabels = ["Get 1 from each user", "Most Difficult", "Least Difficult", "Most Liked", "Most commented"];
  }

  // remember -- api calls go here!, get call adapted from catbook
  //run get request to get first image of the user, will build up to getting images one by
  //one or all on one page
  //only make req if logged in
  componentDidMount() {
    if (this.props.userId) {
      this.getUsers();
    }
  }

  //redo get request if previously failed, many thanks to Nikhil for explaining in 1/15 office hours
  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.getUsers();
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

    this.setState({ filters: tmpFilters }, this.getUsers);
  };

  //async/await course slides were very helpful
  getUsers = async () => {
    try {
      let allPhotoList = []; // set allUsers to be none before any api calls
      const photoLim = 10; // How many photo to grab per get request
      const startInd = 0; // skip all the initial items in the list until we get to Ind
      // check which flag is set true
      for (let filter of Object.keys(this.state.filters)) {
        //ref: https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
        if (filter === "getOneFromAll" && this.state.filters[filter]) {
          const allUsers = await get("/api/all_user_find");
          this.setState({
            allUserList: allUsers.filter((userCheck) => userCheck.photoCount > 0),
          });
          for (let uu = 0; uu < this.state.allUserList.length; uu++) {
            const newPhoto = await get("/api/photoFilter", {
              sortString: "submit_stamp_raw",
              sortFlag: -1,
              startInd: startInd,
              lim: 1,
              keyname: "uid",
              keyvalue: this.state.allUserList[uu]._id,
            });
            allPhotoList = allPhotoList.concat(newPhoto);
          }
          return this.setState({ allPhotos: allPhotoList, loading: false });
        }

        if (filter === "mostDifficult" && this.state.filters[filter]) {
          allPhotoList = await get("/api/photoFilter", {
            sortString: "difficulty",
            sortFlag: -1,
            startInd: startInd,
            lim: photoLim,
            keyname: "",
            keyvalue: "",
          });
          return this.setState({ allPhotos: allPhotoList, loading: false });
        }

        if (filter === "leastDifficult" && this.state.filters[filter]) {
          console.log(filter === "leastDifficult", filter);
          allPhotoList = await get("/api/photoFilter", {
            sortString: "difficulty",
            sortFlag: 1,
            startInd: startInd,
            lim: photoLim,
            keyname: "",
            keyvalue: "",
          });
          return this.setState({ allPhotos: allPhotoList, loading: false });
        }

        if (filter === "mostLiked" && this.state.filters[filter]) {
          allPhotoList = await get("/api/photoFilter", {
            sortString: "likeCount",
            sortFlag: -1,
            startInd: startInd,
            lim: photoLim,
            keyname: "",
            keyvalue: "",
          });
          return this.setState({ allPhotos: allPhotoList, loading: false });
        }

        if (filter === "mostCommented" && this.state.filters[filter]) {
          allPhotoList = await get("/api/photoFilter", {
            sortString: "commentCount",
            sortFlag: -1,
            startInd: startInd,
            lim: photoLim,
            keyname: "",
            keyvalue: "",
          });
          return this.setState({ allPhotos: allPhotoList, loading: false });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  //     .then((allUsers) => get()).then(allPhotos => {this.setState({})})
  //   });
  // };

  //if requesting user's cards are being visualized, return my, otherwise return possessive of name
  // getPossessive = (reqUser, visUser, visUserName) => {
  //   if (reqUser === visUser) {
  //     return "my";
  //   } else {
  //     return visUserName + "'s";
  //   }
  // };

  //on click flip to show in either native language or language learning ref https://stackoverflow.com/questions/12772494/how-to-get-opposite-boolean-value-of-variable-in-javascript/12772502
  // switchLanguage = (event) => {
    //   if (!this.state.everSwitched)
    //   {this.setState({everSwitched : true})
    // console.log("SWITCH 1")}
    //   else {const languagePreference = !this.state.showInNativeLanguage;
    //     this.setState({showInNativeLanguage : languagePreference})
    //   console.log("LATER SWITCH")};

    //   //run flip
    //   console.log("IN SWITCH LANGUAGE", thiss.state.showInNativeLanguage);

    // this.setState({ showInNativeLanguage: !this.state.showInNativeLanguage });
    // let photos = clonedeep(this.state.allPhotos); // copy of photos ref https://www.geeksforgeeks.org/lodash-_-clonedeep-method/
    // console.log("PHOTOS in runflip", photos)
    // //Flip the tags and printout languages in each annotation for each photo
    // for (let pp = 0; pp < this.state.allPhotos.length; pp++)
    // {
    //   for (let aa = 0; aa < this.state.allPhotos[pp].annotation_info_array.length; aa++)
    //   {

    //     const nativeTag = photos[pp].annotation_info_array[aa].data.nativeLanguageTag;
    //     const learningTag = photos[pp].annotation_info_array[aa].data.learningLanguageTag;
    //     console.log("BOOLEAN", this.state.showInNativeLanguage)
    //     if (!this.state.showInNativeLanguage)
    //     {
    //       photos[pp].annotation_info_array[aa].data.text = photos[pp].annotation_info_array[aa].data.nativeLanguageTag;
    //       photos[pp].annotation_info_array[aa].data.textforBox = photos[pp].annotation_info_array[aa].data.learningLanguageTag;
    //     }
    //     else
    //     {
    //       photos[pp].annotation_info_array[aa].data.text = photos[pp].annotation_info_array[aa].data.learningLanguageTag;
    //       photos[pp].annotation_info_array[aa].data.textforBox = photos[pp].annotation_info_array[aa].data.nativeLanguageTag;
    //     }
    //   }
    // }
    // this.setState({allPhotos: photos})
  // };

  // runFlipInit = () =>{
  //   let photos = clonedeep(this.state.allPhotos); // copy of photos ref https://www.geeksforgeeks.org/lodash-_-clonedeep-method/
  //   console.log("PHOTOS in runflip", photos)
  //   //Flip the tags and printout languages in each annotation for each photo
  //   for (let pp = 0; pp < this.state.allPhotos.length; pp++)
  //   {
  //     for (let aa = 0; aa < this.state.allPhotos[pp].annotation_info_array.length; aa++)
  //     {

  //       const nativeTag = photos[pp].annotation_info_array[aa].data.nativeLanguageTag;
  //       const learningTag = photos[pp].annotation_info_array[aa].data.learningLanguageTag;
  //       console.log("BOOLEAN", this.state.showInNativeLanguage)
  //       if (!this.state.showInNativeLanguage)
  //       {
  //         photos[pp].annotation_info_array[aa].data.text = photos[pp].annotation_info_array[aa].data.nativeLanguageTag;
  //         photos[pp].annotation_info_array[aa].data.textforBox = photos[pp].annotation_info_array[aa].data.learningLanguageTag;
  //       }

  //     }
  //   }
  //   this.setState({allPhotos: photos})
  // }

  //pass as prop to individual flashcard components
  //take in photoid and rating and update difficulty rating
  updateDifficulty = (difficultyRating, phototoEdit) => {
    console.log("difficulty", difficultyRating, "for", phototoEdit._id);
    post("/api/difficultyRating", {
      difficultyRating: difficultyRating,
      photoId: phototoEdit._id,
    }).then((photoUpdated) => {
      let newPhotoArray = clonedeep(this.state.allPhotos);
      for (let pp = 0; pp < newPhotoArray.length; pp++) {
        if (newPhotoArray[pp]._id === phototoEdit._id) {
          //when find the array entry fixed, set it to be the revised entry
          newPhotoArray[pp] = photoUpdated;
          newPhotoArray[pp].photo_placeholder = this.state.allPhotos[pp].photo_placeholder; //fix photo placeholder so don't repeat mongoose call
          console.log("UPDATED", newPhotoArray[pp]._id, "ENTRY", pp);
        }
      }
      this.setState({ allPhotos: newPhotoArray });
    });
  };

  //pass as prop to individual flashcard components
  //take in photoid and rating and whether the user wants to like or unlike, and updates the likes
  updateLikes = (phototoEdit, liking) => 
  {
    console.log("NEED TO LIKE?", liking);
    console.log("NEED TO UNLIKE?", !liking);
    post("/api/likingRating", {photoId: phototoEdit._id, addLike: liking}).then((photoUpdated) => {
      let newPhotoArray = clonedeep(this.state.allPhotos); //copy of array
      for (let pp = 0; pp < newPhotoArray.length; pp++)
      {
        if (newPhotoArray[pp]._id === phototoEdit._id) //when find the array entry fixed, set it to be the revised entry
        {
          newPhotoArray[pp] = photoUpdated
          newPhotoArray[pp].photo_placeholder = this.state.allPhotos[pp].photo_placeholder //fix photo placeholder so don't repeat mongoose call
          console.log("UPDATED", newPhotoArray[pp]._id, "ENTRY", pp)
        }
      };
      this.setState({allPhotos : newPhotoArray});
    })

  };

  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    console.log(this.state.allUserList);

    //get all users who uploaded, JavaScript lecture slide 32, revised to check photoCount
    // let allUploadedUserList = this.state.allUserList.filter(userCheck => userCheck.photoCount > 0);

    //If you are the requesting user, show "Me" instead of your name
    //if (this.props.userId === this.state.requestingUserId) {this.setState({ nameForPrint :"Me"} )}else {this.setState({ nameForPrint : this.state.userName} )};
    // let langSwitchText = "Show comments and captions in language learning!";
    // if (this.state.showInNativeLanguage === false) {
    //   langSwitchText = "Show comments and captions in English!";
    // }

    return (
      (this.state.loading) ? (<Loading/>) : (
      <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
        <form>
          <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
            <label for="imgFilter">Which image filters do you want?</label>
            <br />
            <select onChange={this.handleFilters} id="imgFilter">
              {console.log(Object.keys(this.state.filters))}
              {Object.keys(this.state.filters).map((ff, ii) => (
                <option value={ff} key={ii + ff}>
                  {this.filterLabels[ii]}
                </option>
              ))}
            </select>
          </div>
        </form>
        {console.log("08:09 this.state.filters", this.state.filters)}

        {/*Many thanks to Justin for Piazza link advice*/}
        {/*https://stackoverflow.com/questions/30115324/pass-props-in-link-react-router link for passing props */}
        {/* map syntax from chatbook br is html line break* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br*/}
        <h1 className="u-textCenter">
          Learn from the WeWorld community's photos! <br />
        </h1>
        {/* <button
          type="button"
          onClick={this.switchLanguage}
          // style={{ border: "none", backgroundColor: "transparent" }}     //no longer need this as now styling with Image_aesthetics.css
        >
          {" "}
          {langSwitchText}
        </button> */}
        {/* {allUploadedUserList.map((u, i) => (
          <>
            {console.log(u)}
            <p>{u._id}</p>
            {/* <View_Flashcards onlyOne={true} userId={u._id} key={i} /> */}
        {/* <UserInfo userNameInfo={u.name} userId={u._id} key={i} /> */}
        {/* either print my or the user with a possessive */}
        {/* <Link to={"/Flashcards/" + u._id}>
              I want to see all of {this.getPossessive(u._id, this.props.userId, u.name)}{" "}
              flashcards!
            </Link> */}
        {/* <br />
          </>
 */}
        {this.state.allPhotos.map((p, i) => (
          <IndividualFlashcard
            photoFacts={p}
            ownPhoto={false}
            onlyOne={true}
            hasLooped={false}
            viewingUserId={this.props.userId}
            // showInNativeLanguage={this.state.showInNativeLanguage}
            updateDifficulty={this.updateDifficulty}
            updateLikes={this.updateLikes}
          />
        ))}
      </div>
    ));
  }
}

export default Friends_1251;
