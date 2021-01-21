import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import "./HomePage.css";
import { get } from "../../utilities";
import ReactAnnotate from "../modules/ReactAnnotate.js";

class Home_Page extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      photo_info_array: [], //this is a photo info array};
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

    get("/api/photosimpletestOnebyid", { photoId: "60075dbc90f80b3495af511d" }).then(
      (ImageInfo_one) => {
        console.log(ImageInfo_one);
        this.setState({
          photo_info_array: [ImageInfo_one],
        });
      }
    );
  };

  //cleans up annotations
  cleanAnnotInput = (initAnnotInput) => {
    initAnnotInput.map((obj) => {
      obj.geometry.type = obj.geometry.shape_kind; //[ref: renaming https://stackoverflow.com/questions/4647817/javascript-object-rename-key]
      delete obj.geometry.shape_kind;
    });
    return initAnnotInput;
  };

  //give info on a first photo, now as text, would want to translate to picture/rating/annotation/etc.
  GetPhotoInfo(PhotoInfo) {
    //debugging code
    // console.log("Initial annotation array");
    // console.log(PhotoInfo.annotation_info_array);

    //change annotation field so it is type which react-image-annotate needs
    let annotPhotoInfo = this.cleanAnnotInput(PhotoInfo.annotation_info_array);

    //debugging code
    // console.log("Revised annotation array");
    // console.log(annotPhotoInfo);

    //multiple classes https://stackoverflow.com/questions/11918491/using-two-css-classes-on-one-element https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01 helped with row and column, other refs in css file
    return (
      <ReactAnnotate
        allowEdits={false}
        border-radius="10%"
        img_using={PhotoInfo.photo_placeholder}
        annotationslst={annotPhotoInfo}
        height="100"
        width="100"
      />
    );
  }

  render() {
    if (!this.props.userId) return <div>Goodbye! Thank you so much for using Weworld.</div>; //login protect
    //tried https://www.w3schools.com/html/html_lists.asp for list but then decided not
    return (
      <div className="u-flex u-flex-justifyCenter">
        <div className="postColumn paddedText">
          {this.state.photo_info_array ? (
            <div className="u-flex u-flex-justifyCenter">
              <div className="homeImg">
                {this.state.photo_info_array.map((p) => this.GetPhotoInfo(p))}
              </div>
            </div>
          ) : (
            <p></p>
          )}
          {/* Use username prop */}
          <p>Welcome {this.props.username}!</p>
          <p className="questiontext">What is WeWorld?</p>
          <p className="answertext">
            WeWorld enables you to learn a language through your and others' photos. As you relate
            the language to your life through photo tags, you will learn and have fun!
          </p>
          <p className="questiontext">
            Nice! I am excited to put my selfies to educational use. How can I get started learning
            from my photos?
          </p>
          <p className="answertext">
            On the{" "}
            <Link className="linktext" to="/Upload">
              Upload page
            </Link>
            , you upload your photos and add tags (currently you have to supply the translation, and
            we are hoping to implement translation!).
          </p>
          <p className="questiontext">Are my photos private?</p>
          <p className="answertext">
            Please note currently all users can see everyone's content given this is an early
            testing version of the website. So please do not share any image or text you do not want
            shared publicly. Also your timestamp of use and name are recorded and associated with
            your image.
          </p>
          <p className="questiontext">So once my photos are uploaded, how can I review them?</p>
          <p className="answertext">
            {" "}
            On the{" "}
            {this.props.userId && (
              <Link to={`/Flashcards/${this.props.userId}`} className="linktext">
                Review page
              </Link>
            )}{" "}
            you can scroll through all of your photos and review words- as well as your memories.
          </p>
          <p className="questiontext">
            I'm excited to review, but I want a challenge and to really learn. Can I test myself?
          </p>
          <p className="answertext">
            We are considering adding this! Our{" "}
            <Link to="/Quiz" className="linktext">
              Quizzes page{" "}
            </Link>
            shows a quiz module (right now with a sample history lesson) which we are thinking of maybe implementing, where you will have to pick the word corresponding to a tag in a photo.
          </p>
          <p className="questiontext">
            Now, you also said this is social? Can I see my friends' adorable pet* pictures and
            learn from them?
          </p>
          <p className="answertext">
            Yup! The{" "}
            <Link to="/Friends" className="linktext">
              {" "}
              Social page{" "}
            </Link>{" "}
            shows a photo for each WeWorld user and has a link for you to see all of their photos.
          </p>
          <p className="questiontext">
            What if I see troubling or inappropriate content uploaded by another user?
          </p>
          <p className="answertext">
            WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at
            weblab2021@gmail.com, so we can look into and address your concern.
          </p>
          <p className="questiontext">
            I want inspiration, though! The idea of using my photos as a tool to help teach me a
            language is really new to me. How do I know which kinds of photos to upload?
          </p>
          <p className="answertext">
            We are thinking of adding a{" "}
            <Link to="/Scavenger_Hunts" className="linktext">
              {" "}
              Scavenger Hunts page
            </Link>
            , which would provide photo prompts to get the learning and fun started!
          </p>
          <p className="questiontext">
            How did WeWorld come about?
          </p>
          {/*ref for other URLs https://www.w3schools.com/html/html_links.asp*/}
          <p className="answertext">
            WeWorld is our <a href="https://weblab.mit.edu" className="linktext">MIT web.lab</a> course project. We are very grateful to the course team and Dr. Anindya Roy of MIT Open Learning for their help and advice with this project!
          </p>
          <p>*WeWorld likes animals of all kinds, including both cats and dogs!</p>
          <p></p>
        </div>
      </div>
    );
  }
}

export default Home_Page;
