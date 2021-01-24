import React, { Component } from "react";

import "../../utilities.css";
import "./Skeleton.css";
import { get } from "../../utilities";
// import UserInfo from "../modules/UserInfo.js";
import { Link } from "@reach/router";
import View_Flashcards from "../pages/View_Flashcards.js";
import IndividualFlashcard from "../modules/IndividualFlashcard.js";

//This is an initial attempt at the friend page, to print users, hopefully leading to
//Being able to add friends and see profiles

class Friends_1251 extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      allUserList: [], //set initial user list to be empty
      allPhotos: [],
      showInNativeLanguage: false
    };
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

  //async/await ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  getUsers = async() => {
    try {
    const allUsers = await get("/api/all_user_find");
    this.setState({
        allUserList: allUsers.filter(userCheck => userCheck.photoCount > 0)
      });
    let allPhotoList = [];
    for (let uu = 0; uu < this.state.allUserList.length; uu++)
    {
      console.log(uu, "USER INFO", this.state.allUserList[uu]);
      const newPhoto = await get("/api/photosimpletestOne", { userId: this.state.allUserList[uu]._id });
      console.log("PHOTO", newPhoto);
      allPhotoList = allPhotoList.concat(newPhoto);
    };
    
    this.setState({allPhotos : allPhotoList});
    this.runFlip();
    console.log("ALL PHOTOS", this.state.allPhotos)
    }
    catch (e) {console.log(e)}
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
    switchLanguage = (event) => {
      this.setState({showInNativeLanguage : !this.state.showInNativeLanguage});
      this.runFlip();
    };

    runFlip = () => {
      //Flip the tags and printout languages in each annotation for each photo
      for (let pp = 0; pp < this.state.allPhotos.length; pp++) 
      {
        for (let aa = 0; aa < this.state.allPhotos[pp].annotation_info_array.length; aa++)
        {
          const initialTag = this.state.allPhotos[pp].annotation_info_array[aa].data.text;
          const initialText = this.state.allPhotos[pp].annotation_info_array[aa].data.textforBox;
          this.state.allPhotos[pp].annotation_info_array[aa].data.text = initialText;
          this.state.allPhotos[pp].annotation_info_array[aa].data.textforBox = initialTag;
          console.log("in inner loop");
        }
      }
};

  render() {
    //Chatbook login protection
    if (!this.props.userId) return <div>Goodbye! Thank you for using Weworld.</div>; //login protect
    console.log(this.state.allUserList);

    //get all users who uploaded, JavaScript lecture slide 32, revised to check photoCount
    // let allUploadedUserList = this.state.allUserList.filter(userCheck => userCheck.photoCount > 0);

    //If you are the requesting user, show "Me" instead of your name
    //if (this.props.userId === this.state.requestingUserId) {this.setState({ nameForPrint :"Me"} )}else {this.setState({ nameForPrint : this.state.userName} )};
    let langSwitchText = "Show comments and captions in language learning!";
    if (this.state.showInNativeLanguage === false) {langSwitchText = "Show comments and captions in English!"}
    
    return (
      <div className="u-flexColumn u-flex-alignCenter" style={{ width: "100%" }}>
        {/*Many thanks to Justin for Piazza link advice*/}
        {/*https://stackoverflow.com/questions/30115324/pass-props-in-link-react-router link for passing props */}
        {/* map syntax from chatbook br is html line break* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br*/}
        <h1 className="u-textCenter">
          Showing one photo from each user in the database! <br />
          (There are also links for showing all the photo from the users.)
        </h1>
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
        {this.state.allPhotos.map((p,i) => 
          <IndividualFlashcard photoFacts={p} ownPhoto={false} onlyOne = {true} hasLooped={false} viewingUserId={this.props.userId} showInNativeLanguage={this.state.showInNativeLanguage}/>
        )}
      </div>
    );
  }
}

export default Friends_1251;
