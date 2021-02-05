import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./Skeleton.css";
import "./HomePage.css";

class FAQ extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="u-flex u-flex-justifyCenter">
        <div className="postColumn paddedText">

          <p className="questiontext">What is WeWorld?</p>
          <p className="answertext">
            WeWorld enables you to learn a language through your and others' photos. (Currently only Chinese is supported. This is <a href="https://sites.google.com/site/opti365/translate_codes" className="linktext">Chinese (Simplified) in Google Translate)</a> As you relate
            the language to your life through photo tags, you will learn and have fun! Please note this version of the website is a different version with another language replacing Spanish, which was used for the web.lab competition: this is not the version submitted for the web.lab competition.
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
            , you upload your photos and add tags in your native language or the language in which
            you feel most comfortable learning. A translation will be provided for you and placed in
            the tag, along with your original input! You can also rate the photo's difficulty, like the photo, and add a caption (which will be translated as well).
          </p>
          <p className="questiontext">Are my photos private?</p>
          <p className="answertext">
            Please note all users can see everyone's content. So please do not share any image or text you do not want
            shared publicly. Also your timestamp of use and name are recorded and associated with
            your image.
          </p>
          <p className="questiontext">
            I want a challenge and to really learn. Can I test myself?
          </p>
          <p className="answertext">
            Our{" "}
            <Link to="/Quiz" className="linktext">
              Quizzes page{" "}
            </Link>
            has questions to test your knowledge, where you will have to pick the word corresponding to a tag in a
            photo.
          </p>
          <p className="questiontext">
            Now, you also said this is social? Can I see my friends' adorable pet<sup>*</sup> pictures and
            learn from them?
          </p>
          
          <p className="answertext">
            Yup! The{" "}
            <Link to="/Friends" className="linktext">
              {" "}
              Social page{" "}
            </Link>{" "}
            has other WeWorld users' photos. There are several different viewing settings (including most liked, most difficult, and most commented).
          </p>
          <p className="questiontext">How can I review my past activity?</p>
          <p className="answertext">
            {" "}
            On the{" "}
            {this.props.userId && (
              <Link to={`/Flashcards/${this.props.userId}`} className="linktext">
                Review page
              </Link>
            )}{" "}
            you can scroll through all of your photos and review words- as well as your memories. You can also review photos you liked, commented on, or rated the difficulty of.
          </p>
          <p className="questiontext">
            What are the different ways I can interact with a photo?
          </p>
          <p className="answertext">
            You can like photos and rate their difficulty when uploading, taking the quiz, or viewing (in Social or Review). Also, when viewing (in Social or Review), you can comment on a photo. When viewing photos, please note that a difficulty of 0 means a photo's difficulty has not yet been rated (difficulty is on a scale of 1 to 5).
          </p>
          <p className="questiontext">
            How can I control whether I see tags/text in English or Chinese?
          </p>
          <p className="answertext">
          When viewing (in Social or Review), you can select the translation icon to flip between viewing in English and in Chinese. The tag text below the image will be in one language, and the tag text on the image will be in the other language.
          </p>
          <p className="questiontext">
            What if I see troubling or inappropriate content uploaded by another user?
          </p>
          <p className="answertext">
            WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at
            weblab2021 at gmail.com, so we can look into and address your concern.
          </p>
          <p className="questiontext">How did WeWorld come about?</p>
          {/*ref for other URLs https://www.w3schools.com/html/html_links.asp*/}
          <p className="answertext">
            WeWorld is our{" "}
            <a href="https://weblab.mit.edu" className="linktext">
              MIT web.lab
            </a>{" "}
            course project. We are very grateful to the course team and our test users for their
            help and advice with this project! Please note this version of the website is a different version with another language replacing Spanish, which was used for the web.lab competition: this is not the version submitted for the web.lab competition.
          </p>
          <p><sup>*</sup>WeWorld likes animals of all kinds, including both cats and dogs!</p>
          <p></p>
        </div>
      </div>
      );
    }
  }

// {
//     constructor(props) {
//       super(props);
//       // Initialize Default State
//     }

//     render() {
//         return(
//         <div className="u-flex u-flex-justifyCenter">
//         <div className="postColumn paddedText">

//           <p className="questiontext">What is WeWorld?</p>
//           <p className="answertext">
//             WeWorld enables you to learn a language through your and others' photos. (Currently only Spanish is supported.) As you relate
//             the language to your life through photo tags, you will learn and have fun!
//           </p>
//           <p className="questiontext">
//             Nice! I am excited to put my selfies to educational use. How can I get started learning
//             from my photos?
//           </p>
//           <p className="answertext">
//             On the{" "}
//             <Link className="linktext" to="/Upload">
//               Upload page
//             </Link>
//             , you upload your photos and add tags in your native language or the language in which
//             you feel most comfortable learning. A translation will be provided for you and placed in
//             the tag, along with your original input!
//           </p>
//           <p className="questiontext">Are my photos private?</p>
//           <p className="answertext">
//             Please note currently all users can see everyone's content given this is an early
//             testing version of the website. So please do not share any image or text you do not want
//             shared publicly. Also your timestamp of use and name are recorded and associated with
//             your image.
//           </p>
//           <p className="questiontext">So once my photos are uploaded, how can I review them?</p>
//           <p className="answertext">
//             {" "}
//             On the{" "}
//             {this.props.userId && (
//               <Link to={`/Flashcards/${this.props.userId}`} className="linktext">
//                 Review page
//               </Link>
//             )}{" "}
//             you can scroll through all of your photos and review words- as well as your memories.
//           </p>
//           <p className="questiontext">
//             I'm excited to review, but I want a challenge and to really learn. Can I test myself?
//           </p>
//           <p className="answertext">
//             Our{" "}
//             <Link to="/Quiz" className="linktext">
//               Quizzes page{" "}
//             </Link>
//             has questions to test your knowledge, where you will have to pick the word corresponding to a tag in a
//             photo.
//           </p>
//           <p className="questiontext">
//             Now, you also said this is social? Can I see my friends' adorable pet* pictures and
//             learn from them?
//           </p>
//           <p className="answertext">
//             Yup! The{" "}
//             <Link to="/Friends" className="linktext">
//               {" "}
//               Social page{" "}
//             </Link>{" "}
//             has other WeWorld users' photos. There are several different viewing settings, and you can also see all of a user's photos by navigating to their review pagge.
//           </p>
//           <p className="questiontext">
//             What if I see troubling or inappropriate content uploaded by another user?
//           </p>
//           <p className="answertext">
//             WeWorld wants to ensure it is a welcoming and inclusive website. Please email us at
//             weblab2021@gmail.com, so we can look into and address your concern.
//           </p>
//           <p className="questiontext">How did WeWorld come about?</p>
//           {/*ref for other URLs https://www.w3schools.com/html/html_links.asp*/}
//           <p className="answertext">
//             WeWorld is our{" "}
//             <a href="https://weblab.mit.edu" className="linktext">
//               MIT web.lab
//             </a>{" "}
//             course project. We are very grateful to the course team and our test users for their
//             help and advice with this project!
//           </p>
//           <p>*WeWorld likes animals of all kinds, including both cats and dogs!</p>
//           <p></p>
//         </div>
//       </div>
//     );
//     }
// }

export default FAQ;